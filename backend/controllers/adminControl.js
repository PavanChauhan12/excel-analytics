const AdminRequest = require("../models/Admin")
const User = require("../models/User")

class AdminController {
  // Submit admin access request
  static async requestAdminAccess(req, res) {
    try {
      const { reason, experience } = req.body
      const userId = req.user.id

      if (!reason || reason.trim() === "") {
        return res.status(400).json({ message: "Reason is required" })
      }

      // Check if user already has a pending request
      const existingRequest = await AdminRequest.findOne({
        user: userId,
        status: "pending",
      })

      if (existingRequest) {
        return res.status(400).json({ message: "You already have a pending admin request" })
      }

      // Create new admin request
      const request = new AdminRequest({
        user: userId,
        reason,
        experience,
      })

      await request.save()

      res.status(201).json({
        message: "Admin request submitted successfully",
        request,
      })
    } catch (error) {
      console.error("Error creating admin request:", error)
      res.status(500).json({ message: "Server error" })
    }
  }

  // Get all pending admin requests (admin only)
  static async getPendingRequests(req, res) {
    try {
      const requests = await AdminRequest.find({ status: "pending" })
        .populate("user", "firstName lastName email username")
        .sort({ createdAt: -1 })

      // Format the response to match frontend expectations
      const formattedRequests = requests.map((request) => ({
        id: request._id,
        reason: request.reason,
        experience: request.experience,
        status: request.status,
        createdAt: request.createdAt,
        user: {
          id: request.user._id,
          firstName: request.user.firstName || request.user.username,
          lastName: request.user.lastName || "",
          email: request.user.email,
        },
      }))

      res.json(formattedRequests)
    } catch (error) {
      console.error("Error fetching admin requests:", error)
      res.status(500).json({ message: "Server error" })
    }
  }

  // Approve admin request (admin only)
  static async approveRequest(req, res) {
    try {
      const requestId = req.params.id
      const processedBy = req.user.id

      // Find the request
      const request = await AdminRequest.findOne({
        _id: requestId,
        status: "pending",
      })

      if (!request) {
        return res.status(404).json({ message: "Request not found or already processed" })
      }

      // Update user role to admin
      await User.findByIdAndUpdate(request.user, { role: "admin" })

      // Update request status to approved
      request.status = "approved"
      request.processedBy = processedBy
      request.processedAt = new Date()
      await request.save()

      res.json({ message: "Admin request approved successfully" })
    } catch (error) {
      console.error("Error approving admin request:", error)
      res.status(500).json({ message: "Server error" })
    }
  }

  // Reject admin request (admin only)
  static async rejectRequest(req, res) {
    try {
      const requestId = req.params.id
      const processedBy = req.user.id

      const request = await AdminRequest.findOneAndUpdate(
        { _id: requestId, status: "pending" },
        {
          status: "rejected",
          processedBy,
          processedAt: new Date(),
        },
        { new: true },
      )

      if (!request) {
        return res.status(404).json({ message: "Request not found or already processed" })
      }

      res.json({ message: "Admin request rejected" })
    } catch (error) {
      console.error("Error rejecting admin request:", error)
      res.status(500).json({ message: "Server error" })
    }
  }
}

module.exports = AdminController
