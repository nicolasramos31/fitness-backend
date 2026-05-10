const mongoose = require("mongoose");

const medicalFileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["apto_fisico", "estudios", "radiografia", "cardiologia", "otro"],
      default: "otro",
    },
    description: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
    },
    fileType: {
      type: String,
    },
    // Guardamos el archivo como base64 (data URL)
    fileData: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalFile", medicalFileSchema);