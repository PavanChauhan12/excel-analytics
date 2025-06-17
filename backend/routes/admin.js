const express = require("express")
const router = express.Router()
const AdminController = require("../controllers/adminController")
const { authenticateToken, requireAdmin } = require("../middleware/authMiddleware")

// Submit admin access request
router.post("/request", authenticateToken, AdminController.requestAdminAccess)

// Get all pending admin requests (admin only)
router.get("/requests", authenticateToken, requireAdmin, AdminController.getPendingRequests)

// Approve admin request (admin only)
router.put("/requests/:id/approve", authenticateToken, requireAdmin, AdminController.approveRequest)

// Reject admin request (admin only)
router.put("/requests/:id/reject", authenticateToken, requireAdmin, AdminController.rejectRequest)

module.exports = router
