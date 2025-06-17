const User = require("../models/User")
const AdminRequest = require("../models/Admin")

class UserController {
  // Get user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id

      // Get user details
      const user = await User.findById(userId).select("-password")
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Get admin request status
      const adminRequest = await AdminRequest.findOne({
        user: userId,
      }).sort({ createdAt: -1 })

      const profile = {
        id: user._id,
        firstName: user.firstName || user.username,
        lastName: user.lastName || "",
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        adminRequestStatus: adminRequest ? adminRequest.status : null,
      }

      res.json(profile)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      res.status(500).json({ message: "Server error" })
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id
      const { firstName, lastName } = req.body

      const updatedUser = await User.findByIdAndUpdate(userId, { firstName, lastName }, { new: true }).select(
        "-password",
      )

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json({
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          username: updatedUser.username,
          role: updatedUser.role,
        },
      })
    } catch (error) {
      console.error("Error updating user profile:", error)
      res.status(500).json({ message: "Server error" })
    }
  }
}

module.exports = UserController
