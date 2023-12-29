const express = require("express");
const {
  authUser,
  getUserProfile,
  logoutUser,
  registerUser,
  updateUserProfile,
} = require("../controllers/userController.js");
const { protect } = require("../middleware/authMiddleware.js");
const { createExam, getExams } = require("../controllers/examController.js");
const userRoutes = express.Router();
userRoutes.post("/", registerUser);
userRoutes.post("/auth", authUser);
userRoutes.post("/logout", logoutUser);
userRoutes.post("/register", registerUser);
// protecting profile route using auth middleware protect
userRoutes
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = userRoutes;
