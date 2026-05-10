const mongoose = require("mongoose");

const exerciseSchema = {
  name: String,
  reps: String,
  video: String
};

const blockSchema = {
  name: String,
  exercises: [exerciseSchema]
};

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    exercises: [exerciseSchema], // viejo (compatibilidad)

    blocks: [blockSchema], // 🔥 NUEVO

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
