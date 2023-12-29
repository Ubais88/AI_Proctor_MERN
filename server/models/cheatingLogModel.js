const mongoose = require("mongoose");

// Define a schema for the cheating log
const cheatingLogSchema = new mongoose.Schema(
  {
    noFaceCount: { type: Number, default: 0 },
    multipleFaceCount: { type: Number, default: 0 },
    cellPhoneCount: { type: Number, default: 0 },
    prohibitedObjectCount: { type: Number, default: 0 },
    examId: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create a model using the schema
module.exports = mongoose.model("CheatingLog", cheatingLogSchema);
