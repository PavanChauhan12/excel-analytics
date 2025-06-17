const express = require("express")
const router = express.Router()
const UserController = require("../controllers/userControl")
const { verifyToken } = require("../middleware/authMiddleware")

// Get user profile
router.get("/profile", verifyToken, UserController.getProfile)

// Update user profile
router.put("/profile", verifyToken, UserController.updateProfile)

module.exports = router
