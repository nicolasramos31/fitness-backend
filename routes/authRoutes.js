const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  register,
  login,
  getStudents,
  updateStudent,
  updateProfile
} = require("../controllers/authController");

// ── Públicas ──────────────────────────────────────
router.post("/register", register);
router.post("/login",    login);

// ── Protegidas ────────────────────────────────────

// Coach: ver lista de alumnos
router.get("/students",       protect, getStudents);

// Coach: editar datos físicos de un alumno
// PUT /api/auth/students/:id
router.put("/students/:id",   protect, updateStudent);

// Alumno: actualizar su propia foto de perfil
// PUT /api/auth/profile
router.put("/profile",        protect, updateProfile);

module.exports = router;