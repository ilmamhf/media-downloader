# MediaConvert - Social Media Video & Audio Downloader

A modern, fast, and secure web application for downloading videos and extracting audio from popular social media platforms like Youtube, Instagram and TikTok. 

![Project Overview](https://img.shields.io/badge/Status-Active-success)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI-green)
![Queue](https://img.shields.io/badge/Queue-Redis%20%2B%20RQ-red)

## 🌟 Features

- **Multi-Platform Support**: Download content from YouTube, Instagram, and TikTok.
- **Format Extraction**: Extract high-quality MP4 video or 320kbps MP3 audio.
- **Instant Processing**: Lightning-fast cloud processing using distributed background workers via Redis Queue.
- **Privacy-Focused**: No account required. All downloaded content is temporary and deleted automatically.
- **Modern UI**: A beautiful, responsive, and dark-mode compatible interface built with React, TailwindCSS, and Vite.

## 🏗️ Architecture Stack

This project uses a microservice-style architecture containerized with Docker:

### 1. Frontend (`/frontend`)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for blazing fast HMR and optimized builds
- **Styling**: TailwindCSS for utility-first styling
- **Icons**: Google Material Symbols

### 2. Backend API (`/backend`)
- **Framework**: FastAPI (Python 3.11)
- **Server**: Uvicorn for ASGI deployment
- **Role**: Handles incoming client requests, creates downloading jobs, and serves completed files.

### 3. Background Worker (`/backend/worker.py`)
- **Queue System**: RQ (Redis Queue)
- **Downloader Engine**: `yt-dlp` paired with `FFmpeg` for media extraction and format conversion.
- **Role**: Asynchronously processes heavy download and conversion tasks without blocking the main API thread.

### 4. Database/Cache (`redis:alpine`)
- **Role**: Acts as the message broker for RQ and stores temporary job status/metadata (expiring after 10 minutes).

## 🚀 Getting Started

The easiest way to run the entire project locally is by using Docker Compose.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Execution

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/socmed-downloader.git
   cd socmed-downloader
   ```

2. **Start the services via Docker Compose**
   ```bash
   docker-compose up --build
   ```
   *This command will pull necessary images (like Redis), build the custom Frontend, API, and Worker containers, and start them all together.*

3. **Access the application**
   - **Frontend UI**: Open your browser and navigate to `http://localhost:5173`
   - **Backend API Docs**: Open `http://localhost:8000/docs` to view the interactive Swagger API documentation.

## 🧪 Testing the API directly

If you want to test the download queue without using the frontend UI, a simple test script is provided.

Open a new terminal window in the project root and run:
```bash
python test_api.py
```
*Note: You must have the Docker containers running for the API and Redis instances to be reachable.*

## 📁 Directory Structure Overview

```text
socmed-downloader/
├── backend/               # Python FastAPI backend & RQ worker
│   ├── downloader.py      # Core yt-dlp logic
│   ├── main.py            # FastAPI endpoints
│   ├── worker.py          # RQ worker entrypoint
│   └── requirements.txt   # Python dependencies
├── frontend/              # React + Vite frontend
│   ├── src/               # React components, pages, styles
│   ├── index.html         # Main HTML entrypoint
│   └── package.json       # Node.js dependencies
├── downloads/             # Temporary volume for processed files
├── docker-compose.yml     # Orchestration configuration
├── test_api.py            # CLI script to test backend queuing
└── .gitignore            
```

## ⚖️ Disclaimer
This tool is for educational and personal use only. Please respect the copyright of the content creators and the Terms of Service of the respective platforms you download from.
