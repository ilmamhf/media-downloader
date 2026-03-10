from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from rq import Queue
from redis import Redis
import os
import uuid
import json

from downloader import download_media

app = FastAPI(title="MediaConvert API")

redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
redis_conn = Redis.from_url(redis_url)
# TTL logic is handled in downloader, but can also be applied to RQ results if needed
q = Queue('media_queue', connection=redis_conn)

class DownloadRequest(BaseModel):
    url: str
    format: str # 'mp4' or 'mp3'
    quality: str # '1080p', '720p', '480p'

@app.post("/api/download")
def trigger_download(req: DownloadRequest):
    # Basic validation
    if not req.url:
        raise HTTPException(status_code=400, detail="URL is required")
    if req.format not in ['mp4', 'mp3']:
        raise HTTPException(status_code=400, detail="Invalid format")
    
    job_id = str(uuid.uuid4())
    
    # Enqueue the background task
    q.enqueue(download_media, job_id, req.url, req.format, req.quality, job_id=job_id, result_ttl=600)
    
    # Initialize state in Redis (10m TTL)
    redis_conn.setex(f"job:{job_id}", 600, json.dumps({
        "status": "queued",
        "progress": 0,
        "filename": None,
        "thumbnail_url": None,
        "title": None,
        "description": None
    }))

    return {"job_id": job_id}

@app.get("/api/job/{job_id}")
def get_job_status(job_id: str):
    data = redis_conn.get(f"job:{job_id}")
    if not data:
        raise HTTPException(status_code=404, detail="Job not found or expired")
    
    return json.loads(data)

@app.get("/api/file/{filename}")
def get_file(filename: str):
    # Be careful not to allow directory traversal
    safe_filename = os.path.basename(filename)
    file_path = os.path.join("/app/downloads", safe_filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    return FileResponse(path=file_path, filename=safe_filename)
