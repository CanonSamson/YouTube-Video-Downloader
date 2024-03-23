const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  video: {
    type: String,
    required: true,
  },
  ip_address: {
    type: String,
    required: true,
  },
  videoData: {
    data: Buffer, // Binary data field
    contentType: String, // Content type of the file
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Video", videoSchema);
