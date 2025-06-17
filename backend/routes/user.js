const express = require("express")
const router = express.Router()
const UserController = require("../controllers/userController")
const { authenticateToken } = require("../middleware/authMiddleware")

// Get user profile
router.get("/profile", authenticateToken, UserController.getProfile)

// Update user profile
router.put("/profile", authenticateToken, UserController.updateProfile)

module.exports = router
