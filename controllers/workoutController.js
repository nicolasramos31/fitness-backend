const Workout = require("../models/Workout");

// Crear rutina (solo coach)
const createWorkout = async (req, res) => {
  try {

    if (req.user.role !== "coach") {
      return res.status(403).json({ message: "Only coach can create workouts" });
    }

    const { title, description, exercises, blocks, userId } = req.body;

    const workout = new Workout({
      title,
      description,
      exercises,
      blocks,
      user: userId && userId !== "" ? userId : req.user._id,
      createdBy: req.user._id
    });

    await workout.save();

    console.log("GUARDADO:", workout); // 👈 DEBUG

    res.status(201).json(workout); // ✅ SOLO UNA VEZ

  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Obtener rutinas del usuario logueado
const getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id })
      .populate("user", "name email")
      .populate("createdBy", "name email role");

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWorkout, getUserWorkouts };