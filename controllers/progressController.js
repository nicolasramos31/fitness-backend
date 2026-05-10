const mongoose = require("mongoose");
const Progress = require("../models/Progress");

// 🔥 Toggle ejercicio
exports.toggleExercise = async (req, res) => {
  try {

    const { userId, workoutId, exerciseId } = req.body;

    if (!userId || !workoutId || !exerciseId) {
      return res.status(400).json({ message: "Missing data" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(workoutId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const workoutObjectId = new mongoose.Types.ObjectId(workoutId);

    const today = new Date();
    today.setHours(0,0,0,0);

    let progress = await Progress.findOne({
      user: userObjectId,
      workout: workoutObjectId,
      date: { $gte: today }
    });

    // 🆕 crear progreso
    if (!progress) {

      progress = new Progress({
        user: userObjectId,
        workout: workoutObjectId,
        date: new Date(),
        exercises: [
          {
            exerciseId,
            completed: true
          }
        ],
        completedWorkout: false
      });

      await progress.save();

      return res.status(201).json(progress);
    }

    // 🔍 buscar ejercicio
    const exercise = progress.exercises.find(
      ex => ex.exerciseId === exerciseId
    );

    if (exercise) {

      exercise.completed = !exercise.completed;

    } else {

      progress.exercises.push({
        exerciseId,
        completed: true
      });

    }

    // 🔥 detectar rutina completa
    const completedCount = progress.exercises.filter(e => e.completed).length;
    const totalCount = progress.exercises.length;

    if (completedCount === totalCount) {
      progress.completedWorkout = true;
    }

    await progress.save();

    res.json(progress);

  } catch (error) {

    console.error("🔥 Toggle error:", error);

    res.status(500).json({ message: "Server error" });

  }
};


// 🔥 progreso por rutina
exports.getWorkoutProgress = async (req, res) => {

  try {

    const { userId, workoutId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(workoutId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const progress = await Progress.find({
      user: userId,
      workout: workoutId
    }).sort({ date: -1 });

    res.json(progress);

  } catch (error) {

    console.error("🔥 Get workout progress error:", error);

    res.status(500).json({ message: "Server error" });

  }

};


// 🔥 progreso total usuario
exports.getUserProgress = async (req, res) => {

  try {

    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const progress = await Progress.find({
      user: userId
    })
    .populate("workout", "title name")
    .sort({ date: -1 });

    res.json(progress);

  } catch (error) {

    console.error("🔥 Get user progress error:", error);

    res.status(500).json({ message: "Server error" });

  }

};