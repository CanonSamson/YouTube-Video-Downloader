# YouTube Video Downloader

This project is a YouTube video downloader built using Express.js, Mongoose for MongoDB integration, and the yt-dlp tool.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git

## Install dependencies:

cd your-repo
npm install


## API Endpoints

GET /download?videoId=YOUR_VIDEO_ID: Downloads the YouTube video with the specified video ID and saves it to MongoDB.

## Project Structure

app.js: Express.js application entry point.
models/video.js: Mongoose model for storing video metadata and binary data.
bin/yt-dlp.exe: Executable for yt-dlp tool (not included in the repository).