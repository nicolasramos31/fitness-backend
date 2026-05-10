require("dotenv").config(); // 🔥 SIEMPRE primera línea

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// ── Routes ──
const authRoutes        = require("./routes/authRoutes");
const workoutRoutes     = require("./routes/workoutRoutes");
const progressRoutes    = require("./routes/progressRoutes");
const medicalFileRoutes = require("./routes/medicalFileRoutes");

connectDB();

const app = express();

// ── Middlewares ──
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// ── Rutas ──
app.use("/api/auth",          authRoutes);
app.use("/api/workouts",      workoutRoutes);
app.use("/api/progress",      progressRoutes);
app.use("/api/medical-files", medicalFileRoutes);

app.get("/", (req, res) => {
  res.send("API running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});