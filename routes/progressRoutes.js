const express = require("express");
const router = express.Router();
const {
  toggleExercise,
  getWorkoutProgress,
  getUserProgress,
} = require("../controllers/progressController");
const Progress = require("../models/Progress");

// POST → marcar/desmarcar ejercicio
router.post("/toggle", toggleExercise);

// 🆕 GET / → todos los progresos (para coach en Historial)
router.get("/", async (req, res) => {
  try {
    const progress = await Progress.find()
      .populate("workout", "title name")
      .populate("user", "name email")
      .sort({ date: -1 });
    res.json(progress);
  } catch (err) {
    console.error("getAllProgress error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET → progreso por usuario + workout
router.get("/:userId/:workoutId", getWorkoutProgress);
router.get("/:userId", getUserProgress);

module.exports = router;