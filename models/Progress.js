const mongoose = require("mongoose");

const exerciseProgressSchema = new mongoose.Schema({
  exerciseId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
    exercises: [exerciseProgressSchema],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Evita duplicados de progreso por usuario + workout + día
progressSchema.index({ user: 1, workout: 1, date: 1 });

module.exports = mongoose.model("Progress", progressSchema);