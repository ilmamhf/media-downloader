import requests
import time

API_URL = "http://localhost:8000/api"

print("1. Triggering download...")
payload = {
    "url": "https://www.youtube.com/watch?v=jNQXAC9IVRw", 
    "format": "mp3", 
    "quality": "320"
}
response = requests.post(f"{API_URL}/download", json=payload)
print(response.json())
job_id = response.json().get("job_id")

if job_id:
    print(f"Job started: {job_id}")
    for _ in range(15):
        time.sleep(2)
        status = requests.get(f"{API_URL}/job/{job_id}").json()
        print(status)
        if status.get("status") in ("finished", "failed"):
            break
            
print("Test completed.")
