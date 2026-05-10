const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["student", "coach"],
    default: "student"
  },

  // ── Foto de perfil (el alumno puede cambiar) ──
  profileImage: {
    type: String,
    default: ""
  },

  avatar: {
    type: String,
    default: ""
  },

  // ── Datos físicos (solo el coach puede editar) ──
  weight: {
    type: Number,
    default: null
  },

  height: {
    type: Number,
    default: null
  },

  age: {
    type: Number,
    default: null
  },

  goal: {
    type: String,
    default: ""
  },

  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", ""],
    default: ""
  },

  // ── Goals (legacy, mantener compatibilidad) ──
  goals: {
    weight: { type: String, default: "" },
    focus:  { type: String, default: "" },
    notes:  { type: String, default: "" }
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);