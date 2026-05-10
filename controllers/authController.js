const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ── REGISTER ─────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nombre, email y contraseña son obligatorios" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student"
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Usuario creado con éxito",
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role
      },
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── LOGIN ────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        _id:          user._id,
        name:         user.name,
        email:        user.email,
        role:         user.role,
        profileImage: user.profileImage || "",
        weight:       user.weight,
        height:       user.height,
        age:          user.age,
        goal:         user.goal,
        level:        user.level
      },
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET STUDENTS (coach ve todos los alumnos) ─────
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE STUDENT (solo coach puede editar datos físicos) ─────────
// PUT /api/auth/students/:id
const updateStudent = async (req, res) => {
  try {
    // Solo el coach puede llamar este endpoint
    if (req.user.role !== "coach") {
      return res.status(403).json({ message: "Solo el coach puede modificar datos del alumno" });
    }

    const { weight, height, age, goal, level } = req.body;

    // Construir objeto solo con campos enviados
    const updateData = {};
    if (weight  !== undefined && weight  !== "") updateData.weight  = Number(weight);
    if (height  !== undefined && height  !== "") updateData.height  = Number(height);
    if (age     !== undefined && age     !== "") updateData.age     = Number(age);
    if (goal    !== undefined)                  updateData.goal    = goal;
    if (level   !== undefined)                  updateData.level   = level;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    res.json({
      message: "Datos actualizados correctamente",
      student: updated
    });

  } catch (error) {
    console.error("updateStudent error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE PROFILE (el alumno puede cambiar su foto) ────────────────
// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { profileImage } = req.body;

    const updateData = {};
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json({
      message: "Perfil actualizado",
      user: updated
    });

  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getStudents,
  updateStudent,
  updateProfile
};