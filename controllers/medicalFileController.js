const MedicalFile = require("../models/MedicalFile");

// ── SUBIR ARCHIVO (alumno) ────────────────────────────────────────
const uploadFile = async (req, res) => {
  try {
    const { category, description, fileName, fileSize, fileType, fileData } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ message: "Nombre y datos del archivo son obligatorios" });
    }

    const MAX_BASE64_SIZE = 14 * 1024 * 1024; // ~10MB
    if (fileData.length > MAX_BASE64_SIZE) {
      return res.status(400).json({ message: "El archivo supera el límite de 10MB" });
    }

    const file = await MedicalFile.create({
      user:        req.user._id,
      category:    category    || "otro",
      description: description || "",
      fileName,
      fileSize,
      fileType,
      fileData,
    });

    res.status(201).json({ message: "Archivo subido correctamente", file });

  } catch (error) {
    console.error("uploadFile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ── OBTENER ARCHIVOS DEL ALUMNO LOGUEADO ─────────────────────────
const getMyFiles = async (req, res) => {
  try {
    const files = await MedicalFile.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ files });
  } catch (error) {
    console.error("getMyFiles error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ── OBTENER TODOS LOS ARCHIVOS (solo coach) ───────────────────────
const getAllFiles = async (req, res) => {
  try {
    if (req.user.role !== "coach") {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    const files = await MedicalFile.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ files });
  } catch (error) {
    console.error("getAllFiles error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ── OBTENER ARCHIVOS DE UN ALUMNO ESPECÍFICO (coach) ─────────────
const getFilesByStudent = async (req, res) => {
  try {
    if (req.user.role !== "coach") {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    const files = await MedicalFile.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json({ files });
  } catch (error) {
    console.error("getFilesByStudent error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ── ELIMINAR ARCHIVO ─────────────────────────────────────────────
const deleteFile = async (req, res) => {
  try {
    const file = await MedicalFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }
    const isOwner = file.user.toString() === req.user._id.toString();
    const isCoach = req.user.role === "coach";
    if (!isOwner && !isCoach) {
      return res.status(403).json({ message: "Sin permiso para eliminar este archivo" });
    }
    await MedicalFile.findByIdAndDelete(req.params.id);
    res.json({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("deleteFile error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadFile, getMyFiles, getAllFiles, getFilesByStudent, deleteFile };
