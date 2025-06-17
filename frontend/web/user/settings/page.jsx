"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Shield, Send, CheckCircle, Clock } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { toast } from "sonner"
// import { getUserProfile, requestAdminAccess } from "@/services/api"
import Iridescence from "@/components/ui/iridescence"

export default function UserSettings() {
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requestLoading, setRequestLoading] = useState(false)
  const [adminRequest, setAdminRequest] = useState({
    reason: "",
    experience: "",
    status: null,
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const profile = await getUserProfile()
      setUserProfile(profile)
      setAdminRequest((prev) => ({ ...prev, status: profile.adminRequestStatus }))
    } catch (error) {
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleRequestAdminAccess = async () => {
    if (!adminRequest.reason.trim()) {
      toast.error("Please provide a reason for admin access")
      return
    }

    setRequestLoading(true)
    try {
      await requestAdminAccess({
        reason: adminRequest.reason,
        experience: adminRequest.experience,
      })
      toast.success("Admin access request submitted successfully!")
      setAdminRequest((prev) => ({ ...prev, status: "pending" }))
    } catch (error) {
      toast.error("Failed to submit admin request")
    } finally {
      setRequestLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0a0f1c] text-white">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-cyan-400">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0a0f1c] overflow-hidden text-white relative">
      <div className="absolute inset-0 z-0 opacity-20 h-full">
        <Iridescence />
      </div>

      <DashboardSidebar />

      <div className="flex flex-col flex-1 relative z-0">
        <main className="flex-1 p-6 space-y-6">
          <div className="text-center mt-8 space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              User Settings
            </h1>
            <p className="text-slate-400">Manage your account and preferences</p>
          </div>

          {/* Profile Information */}
          <Card className="bg-transparent border border-blue-900/50 shadow-xl backdrop-blur-3xl shadow-[0_0_20px_rgba(0,191,255,0.1)]">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-slate-400">Your account details and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-cyan-300">First Name</Label>
                  <Input
                    value={userProfile?.firstName || ""}
                    readOnly
                    className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-cyan-300">Last Name</Label>
                  <Input
                    value={userProfile?.lastName || ""}
                    readOnly
                    className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-cyan-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  value={userProfile?.email || ""}
                  readOnly
                  className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <Label className="text-cyan-300">Current Role</Label>
                  <Badge className="bg-cyan-900/30 text-cyan-300 border-cyan-500/50">
                    <Shield className="w-3 h-3 mr-1" />
                    {userProfile?.role || "User"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-cyan-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </Label>
                  <p className="text-slate-300">
                    {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Access Request */}
          {userProfile?.role !== "admin" && (
            <Card className="bg-transparent border border-blue-900/50 shadow-xl backdrop-blur-3xl shadow-[0_0_20px_rgba(0,191,255,0.1)]">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Request Admin Access
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {adminRequest.status === "pending"
                    ? "Your admin access request is pending approval"
                    : adminRequest.status === "approved"
                      ? "Your admin access request has been approved"
                      : adminRequest.status === "rejected"
                        ? "Your admin access request was rejected"
                        : "Request elevated privileges to access admin features"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {adminRequest.status === "pending" ? (
                  <div className="flex items-center gap-2 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-300">Request pending admin approval</span>
                  </div>
                ) : adminRequest.status === "approved" ? (
                  <div className="flex items-center gap-2 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300">Admin access approved! Please refresh to see changes.</span>
                  </div>
                ) : adminRequest.status === "rejected" ? (
                  <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <span className="text-red-300">
                      Admin access request was rejected. You can submit a new request.
                    </span>
                  </div>
                ) : null}

                {(!adminRequest.status || adminRequest.status === "rejected") && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-cyan-300">Reason for Admin Access</Label>
                      <Textarea
                        placeholder="Explain why you need admin access..."
                        value={adminRequest.reason}
                        onChange={(e) => setAdminRequest((prev) => ({ ...prev, reason: e.target.value }))}
                        className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-cyan-300">Relevant Experience (Optional)</Label>
                      <Textarea
                        placeholder="Describe your relevant experience or qualifications..."
                        value={adminRequest.experience}
                        onChange={(e) => setAdminRequest((prev) => ({ ...prev, experience: e.target.value }))}
                        className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 min-h-[80px]"
                      />
                    </div>

                    <Button
                      onClick={handleRequestAdminAccess}
                      disabled={requestLoading || !adminRequest.reason.trim()}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_10px_rgba(0,191,255,0.3)]"
                    >
                      {requestLoading ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
