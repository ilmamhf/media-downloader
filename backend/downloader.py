import os
import json
import yt_dlp
import redis
import time

# Connect to Redis
redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
r = redis.from_url(redis_url)

OUTPUT_DIR = "/app/downloads"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 10 minutes TTL in seconds
TTL_SECONDS = 10 * 60

def my_hook(d, job_id):
    info_dict = d.get('info_dict', {})
    thumbnail_url = info_dict.get('thumbnail')
    title = info_dict.get('title')
    description = info_dict.get('description')
    
    # Truncate description to keep redis payloads small
    if description and len(description) > 300:
        description = description[:297] + "..."

    if d['status'] == 'downloading':
        downloaded = d.get('downloaded_bytes', 0)
        total = d.get('total_bytes') or d.get('total_bytes_estimate') or 0
        
        if total > 0:
            percent = (downloaded / total) * 100
        else:
            percent = 0

        r.setex(f"job:{job_id}", TTL_SECONDS, json.dumps({
            "status": "downloading",
            "progress": round(percent, 2),
            "filename": None,
            "thumbnail_url": thumbnail_url,
            "title": title,
            "description": description
        }))
    elif d['status'] == 'finished':
        r.setex(f"job:{job_id}", TTL_SECONDS, json.dumps({
            "status": "processing",
            "progress": 100,
            "filename": None,
            "thumbnail_url": thumbnail_url,
            "title": title,
            "description": description
        }))

def download_media(job_id: str, url: str, format_type: str, quality: str):
    r.setex(f"job:{job_id}", TTL_SECONDS, json.dumps({
        "status": "starting",
        "progress": 0,
        "filename": None,
        "thumbnail_url": None,
        "title": None,
        "description": None
    }))

    outtmpl = os.path.join(OUTPUT_DIR, f"{job_id}.%(ext)s")
    
    ydl_opts = {
        'outtmpl': outtmpl,
        'progress_hooks': [lambda d: my_hook(d, job_id)],
        'quiet': True,
        'no_warnings': True,
    }

    if format_type == 'mp3':
        ydl_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '320',
            }],
        })
        expected_ext = 'mp3'
    else:
        height = quality.replace('p', '') if quality else '720'
        ydl_opts.update({
            'format': f'bestvideo[height<={height}][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            'merge_output_format': 'mp4',
        })
        expected_ext = 'mp4'

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = f"{job_id}.{expected_ext}"
            
            title = info.get('title')
            description = info.get('description')
            if description and len(description) > 300:
                description = description[:297] + "..."

        r.setex(f"job:{job_id}", TTL_SECONDS, json.dumps({
            "status": "finished",
            "progress": 100,
            "filename": filename,
            "thumbnail_url": info.get('thumbnail'),
            "title": title,
            "description": description
        }))

    except Exception as e:
        print(f"Error downloading {job_id}: {e}")
        r.setex(f"job:{job_id}", TTL_SECONDS, json.dumps({
            "status": "failed",
            "progress": 0,
            "error": str(e),
            "thumbnail_url": None,
            "title": None,
            "description": None
        }))
        raise e
