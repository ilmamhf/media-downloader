FROM python:3.11-slim

# Install ffmpeg for yt-dlp
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# We'll map the codebase via volumes in docker-compose for dev
# But we ensure the code directory is created
RUN mkdir -p /app/downloads

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
