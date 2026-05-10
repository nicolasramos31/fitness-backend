const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // 1. Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autorizado, token faltante" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. 🔥 FIX: buscar el usuario COMPLETO incluyendo role
    // Usamos decoded.id (así lo guarda authController.js al crear el token)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // 4. Adjuntar usuario completo a req
    req.user = user;

    next();

  } catch (error) {
    console.error("authMiddleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado, iniciá sesión de nuevo" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido" });
    }

    res.status(401).json({ message: "No autorizado" });
  }
};

module.exports = protect;