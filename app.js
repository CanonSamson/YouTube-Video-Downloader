const express = require("express");
const fsExtra = require("fs-extra");
const path = require("path");
const dotenv = require("dotenv");
const ytdl = require("ytdl-core"); // Import ytdl-core
const fs = require("fs");

dotenv.config();

const app = express();

app.get("/download", async (req, res) => {
  const videoId = req.query.videoId;

  try {
    if (!videoId) {
      throw new Error("Video ID is required");
    }

    const videoFilename = videoId + ".mp4";
    const videosDir = path.resolve(__dirname, "videos"); // Directory where videos should be saved
    const videoPath = path.resolve(videosDir, videoFilename); // Construct the absolute video path

    // Create videos directory if it doesn't exist
    await fsExtra.ensureDir(videosDir);

    const writeStream = ytdl(`https://www.youtube.com/watch?v=${videoId}`).pipe(
      fs.createWriteStream("video.mp4")
    );

    writeStream.on("finish", async () => {
      console.log("Video download completed");

      // Send the video file to the client
      res.sendFile(videoPath);
    });

    writeStream.on("error", (error) => {
      console.error("Error writing video file:", error);
      res.status(500).json({ error: "Failed to save video file" });
    });
  } catch (error) {
    console.error("Error handling download request:", error);
    return res
      .status(500)
      .json({ error: error.message || "Unknown error occurred" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
