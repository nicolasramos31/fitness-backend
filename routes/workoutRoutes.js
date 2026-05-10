const express = require("express");
const router = express.Router();

const {
  createWorkout,
  getUserWorkouts,
} = require("../controllers/workoutController");

const protect = require("../middleware/authMiddleware");

// Crear rutina (solo coach)
router.post("/", protect, createWorkout);

// Obtener rutinas del usuario logueado
router.get("/", protect, getUserWorkouts);

module.exports = router;