const mongoose = require("mongoose");
require("dotenv").config(); // 🔥 FIX: cargar .env antes de leer MONGO_URI

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI no está definida en el archivo .env");
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB conectado:", mongoose.connection.host);

  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;