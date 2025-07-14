"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Shield, Crown, Check, X, Clock, AlertCircle } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { toast } from "sonner"
import { getUserProfile, getAdminRequests, approveAdminRequest, rejectAdminRequest } from "@/services/api"
import { getAdminStats } from "@/services/admin-api"
import Iridescence from "@/components/ui/iridescence"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminSettings() {
  const [userProfile, setUserProfile] = useState(null)
  const [adminRequests, setAdminRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestsLoading, setRequestsLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const profile = await getUserProfile()
      setUserProfile(profile)
      
      // Only fetch admin requests if user is admin
      if (profile.role === 'admin') {
        const requests = await getAdminRequests()
        setAdminRequests(requests)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }


  const handleApproveRequest = async (requestId) => {
    setRequestsLoading(true)
    try {
      await approveAdminRequest(requestId)
      toast.success("Admin request approved successfully!")
      fetchData()
    } catch (error) {
      toast.error("Failed to approve request")
    } finally {
      setRequestsLoading(false)
    }
  }

  const handleRejectRequest = async (requestId) => {
    setRequestsLoading(true)
    try {
      await rejectAdminRequest(requestId)
      toast.success("Admin request rejected")
      // Refresh the admin requests
      const requests = await getAdminRequests()
      setAdminRequests(requests)
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast.error("Failed to reject request")
    } finally {
      setRequestsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0a0f1c] text-white">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-red-400">Loading admin settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0a0f1c] overflow-hidden text-white relative">
      <div className="absolute inset-0 z-0 opacity-20 h-full">
        <Iridescence color={[1, 0.2, 0.2]} />
      </div>

      <AdminSidebar />

      <div className="flex flex-col flex-1 relative z-0">
        <main className="flex-1 p-6 space-y-6">
          <div className="text-center mt-8 space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-pink-300 to-red-500 bg-clip-text text-transparent">
              Admin Settings
            </h1>
            <p className="text-slate-400">Manage your admin account and user requests</p>
          </div>

          {/* Admin Profile Information */}
          <Card className="bg-transparent border border-red-900/50 shadow-xl backdrop-blur-3xl shadow-[0_0_20px_rgba(255,0,56,0.1)]">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Admin Profile
              </CardTitle>
              <CardDescription className="text-slate-400">Your administrator account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-red-300">First Name</Label>
                  <Input
                    value={userProfile?.username || ""}
                    readOnly
                    className="bg-slate-800/50 border-red-500/30 text-white focus:border-red-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-red-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  value={userProfile?.email || ""}
                  readOnly
                  className="bg-slate-800/50 border-red-500/30 text-white focus:border-red-400"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <Label className="text-red-300">Current Role</Label>
                  <Badge className="bg-red-900/30 text-red-300 border-red-500/50">
                    <Crown className="w-3 h-3 mr-1" />
                    Administrator
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-red-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Admin Since
                  </Label>
                  <p className="text-slate-300">
                    {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Requests Section */}
          <Card className="bg-transparent border border-red-900/50 shadow-xl backdrop-blur-3xl shadow-[0_0_20px_rgba(255,0,56,0.1)]">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Admin Access Requests
                {adminRequests.length > 0 && (
                  <Badge className="bg-red-900/30 text-red-300 border-red-500/50 ml-2">{adminRequests.length}</Badge>
                )}
              </CardTitle>
              <CardDescription className="text-slate-400">
                Review and manage user requests for admin access
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adminRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                  <p className="text-slate-400">No pending admin requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {adminRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 border border-red-500/30 rounded-lg bg-red-900/10 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-900 to-pink-800 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-red-300" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">
                              {request.user.firstName || request.user.username} {request.user.lastName || ""}
                            </h4>
                            <p className="text-sm text-red-300">{request.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-900/30 text-yellow-300 border-yellow-500/50">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div>
                          <Label className="text-red-300 text-sm">Reason:</Label>
                          <p className="text-slate-300 text-sm mt-1">{request.reason}</p>
                        </div>
                        {request.experience && (
                          <div>
                            <Label className="text-red-300 text-sm">Experience:</Label>
                            <p className="text-slate-300 text-sm mt-1">{request.experience}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={requestsLoading}
                          size="sm"
                          className="bg-green-600 hover:bg-green-500 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={requestsLoading}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-300 hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
