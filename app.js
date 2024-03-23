const express = require("express");
const fsExtra = require("fs-extra");
const { exec } = require("child_process");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Video = require("./models/video"); // Import your Mongoose model

dotenv.config();

const app = express();

app.get("/download", async (req, res) => {
  const videoId = req.query.videoId;
  const ipAddress = req.ip;

  try {
    if (!videoId) {
      throw new Error("Video ID is required");
    }

    const ytDlpPath = path.join(__dirname, "bin", "yt-dlp.exe");
    const videoFilename = videoId + ".mp4";
    const videosDir = path.resolve(__dirname, "videos"); // Directory where videos should be saved
    const videoPath = path.resolve(videosDir, videoFilename); // Construct the absolute video path

    // Create videos directory if it doesn't exist
    await fsExtra.ensureDir(videosDir);

    const command = `${ytDlpPath} -o ${videoPath} https://www.youtube.com/watch?v=${videoId}`;

    await new Promise((resolve, reject) => {
      exec(command, async (error, stdout, stderr) => {
        if (error) {
          console.error("Error downloading video:", error);
          return reject("Failed to download video");
        }
        if (stderr) {
          console.error("YT-DLP stderr:", stderr);
        }

        console.log("Video download completed");

        // Read the downloaded video file as binary data
        const videoData = await fsExtra.readFile(videoPath);

        // Save video metadata and binary data to MongoDB using Mongoose
        await Video.create({
          video: videoId,
          ip_address: ipAddress,
          videoData: {
            data: videoData,
            contentType: "video/mp4", // Assuming the video file type is MP4
          },
        });

        resolve();
      });
    });

    if (await fsExtra.pathExists(videoPath)) {
      res.sendFile(videoPath); // Send the file only if it exists
    } else {
      console.error("Downloaded video file not found at:", videoPath);
      throw new Error("Downloaded video file not found");
    }
  } catch (error) {
    console.error("Error handling download request:", error);
    return res
      .status(500)
      .json({ error: error.message || "Unknown error occurred" });
  }
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to mongo-db");
  })
  .catch(() => {
    console.error("error connecting to Mongodb");
  });

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
