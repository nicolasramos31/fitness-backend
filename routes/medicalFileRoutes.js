const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  uploadFile,
  getMyFiles,
  getAllFiles,
  getFilesByStudent,
  deleteFile,
} = require("../controllers/medicalFileController");

// ── Alumno: subir y ver sus propios archivos ──
router.post(  "/",                protect, uploadFile);
router.get(   "/",                protect, getMyFiles);

// ── Coach: ver todos los archivos ──
router.get(   "/all",             protect, getAllFiles);

// ── Coach: ver archivos de un alumno específico ──
router.get(   "/student/:userId", protect, getFilesByStudent);

// ── Eliminar archivo (dueño o coach) ──
router.delete("/:id",             protect, deleteFile);

module.exports = router;
