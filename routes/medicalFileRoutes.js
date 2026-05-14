const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  uploadFile,
  getMyFiles,
  getAllFiles,
  getFilesByStudent,
  deleteFile,
} = require("../controllers/medicalFileController");

router.post("/",                  protect, uploadFile);
router.get("/",                   protect, getMyFiles);
router.get("/all",                protect, getAllFiles);
router.get("/student/:userId",    protect, getFilesByStudent);
router.delete("/:id",             protect, deleteFile);

module.exports = router;
