"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  UserX,
  Crown,
  FileSpreadsheet,
  BarChart3,
  Filter,
  ChevronDown,
  ChevronRight,
  Trash2,
  Download,
  Eye,
  Calendar,
  FileText,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import Aurora from "@/components/ui/aurora"
import axios from "axios"
import toast from "react-hot-toast"

export default function AdminUsersPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [expandedUser, setExpandedUser] = useState(null)
  const [userFiles, setUserFiles] = useState([])
  const [userCharts, setUserCharts] = useState([])
  const [actionDialog, setActionDialog] = useState({ open: false, type: "", user: null })
  const [loading, setLoading] = useState(true)
  const [loadingUserData, setLoadingUserData] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "admin") {
      navigate("/dashboard")
      return
    }
    fetchUsers()
  }, [navigate])

  useEffect(() => {
    const filtered = users.filter((user) => {
  const username = user.username || ""
  const email = user.email || ""

  const matchesSearch =
    username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesRole = filterRole === "all" || user.role === filterRole
  const matchesStatus = filterStatus === "all" || user.status === filterStatus

  return matchesSearch && matchesRole && matchesStatus
})


    setFilteredUsers(filtered)
  }, [users, searchTerm, filterRole, filterStatus])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setUsers(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId) => {
    setLoadingUserData(true)
    try {
      const [filesResponse, chartsResponse] = await Promise.all([
        axios.get(`http://localhost:5050/api/admin/users/${userId}/files`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(`http://localhost:5050/api/admin/users/${userId}/charts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ])

      setUserFiles(filesResponse.data || [])
      setUserCharts(chartsResponse.data || [])
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast.error("Failed to fetch user details")
    } finally {
      setLoadingUserData(false)
    }
  }

  const handleUserAction = async (action, userId) => {
    try {
      const response = await axios.put(
        `http://localhost:5050/api/admin/users/${userId}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      if (response.data.success) {
        toast.success(`User ${action} successfully`)
        fetchUsers()
        setActionDialog({ open: false, type: "", user: null })
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error)
      toast.error(`Failed to ${action} user`)
    }
  }

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5050/api/admin/files/${fileId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      toast.success("File deleted successfully")
      fetchUserDetails(expandedUser.id) // Refresh user data
      fetchUsers() // Refresh user counts
    } catch (error) {
      console.error("Error deleting file:", error)
      toast.error("Failed to delete file")
    }
  }

  const handleDeleteChart = async (chartId) => {
    try {
      await axios.delete(`http://localhost:5050/api/admin/charts/${chartId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      toast.success("Chart deleted successfully")
      fetchUserDetails(expandedUser.id) // Refresh user data
      fetchUsers() // Refresh user counts
    } catch (error) {
      console.error("Error deleting chart:", error)
      toast.error("Failed to delete chart")
    }
  }

  const toggleUserExpansion = (user) => {
    if (expandedUser?.id === user.id) {
      setExpandedUser(null)
    } else {
      setExpandedUser(user)
      fetchUserDetails(user.id)
    }
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { className: "bg-red-900 text-red-300 border-red-600", icon: Crown },
      user: { className: "bg-blue-900 text-blue-300 border-blue-600", icon: Users },
    }

    const config = roleConfig[role] || roleConfig.user
    const IconComponent = config.icon

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {role}
      </Badge>
    )
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { className: "bg-green-900 text-green-300 border-green-600" },
      suspended: { className: "bg-red-900 text-red-300 border-red-600" },
      pending: { className: "bg-yellow-900 text-yellow-300 border-yellow-600" },
    }

    const config = statusConfig[status] || statusConfig.active
    return <Badge className={config.className}>{status}</Badge>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-red-400">Loading users...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden z-0">
      {/* Aurora Background with red theme */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Aurora colorStops={["#ff0038", "#ff4d00", "#330022"]} amplitude={1.2} blend={0.4} />
      </div>

      <AdminSidebar />

      <div className="flex-1 z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mt-12">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-red-500" />
              <h1 className="text-4xl font-bold text-white">User Management</h1>
            </div>
            <div className="text-sm text-red-300 bg-red-950 border border-red-400 px-3 py-1 rounded-full">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <Card className="mb-8 border border-red-500/20 bg-black/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-300" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-red-600 bg-black text-red-200"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40 border-red-600 bg-black text-white">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600 text-white">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 border-red-600 bg-black text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-600 text-white">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border border-red-500/20 bg-black/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-400">All Users</CardTitle>
              <CardDescription className="text-red-300">
                Manage user accounts, roles, and view their content
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-red-950/20 border-red-800">
                      <TableHead className="text-red-300 w-8"></TableHead>
                      <TableHead className="text-red-300">User</TableHead>
                      <TableHead className="text-red-300">Role</TableHead>
                      <TableHead className="text-red-300">Status</TableHead>
                      <TableHead className="text-red-300">Files</TableHead>
                      <TableHead className="text-red-300">Charts</TableHead>
                      <TableHead className="text-red-300">Joined</TableHead>
                      <TableHead className="text-red-300 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <>
                        <TableRow key={user.id} className="hover:bg-red-950/10 transition-colors border-red-900/20">
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleUserExpansion(user)}
                              className="p-1 hover:bg-red-500/10"
                            >
                              {expandedUser?.id === user.id ? (
                                <ChevronDown className="h-4 w-4 text-red-300" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-red-300" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-red-900 to-red-700 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-red-300" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{user.username}</p>
                                <p className="text-sm text-red-300">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status || "active")}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-red-300">
                              <FileSpreadsheet className="h-4 w-4" />
                              <span>{user.fileCount || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-red-300">
                              <BarChart3 className="h-4 w-4" />
                              <span>{user.chartCount || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-red-300">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              {user.role !== "admin" && (
                                <Dialog
                                  open={
                                    actionDialog.open &&
                                    actionDialog.user?.id === user.id &&
                                    actionDialog.type === "promote"
                                  }
                                  onOpenChange={(open) =>
                                    !open && setActionDialog({ open: false, type: "", user: null })
                                  }
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-500 text-red-400 hover:bg-red-950"
                                      onClick={() => setActionDialog({ open: true, type: "promote", user })}
                                    >
                                      <Crown className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-black border-red-600 text-white">
                                    <DialogHeader>
                                      <DialogTitle className="text-red-400">Promote to Admin</DialogTitle>
                                      <DialogDescription className="text-red-300">
                                        Are you sure you want to promote {user.username} to admin? This will give them
                                        full administrative privileges.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setActionDialog({ open: false, type: "", user: null })}
                                        className="border-red-600 text-red-400"
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => handleUserAction("promote", user.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                      >
                                        Promote to Admin
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}

                              <Dialog
                                open={
                                  actionDialog.open &&
                                  actionDialog.user?.id === user.id &&
                                  actionDialog.type === "suspend"
                                }
                                onOpenChange={(open) => !open && setActionDialog({ open: false, type: "", user: null })}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-500 text-red-400 hover:bg-red-950"
                                    onClick={() => setActionDialog({ open: true, type: "suspend", user })}
                                    disabled={user.role === "admin"}
                                  >
                                    <UserX className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-black border-red-600 text-white">
                                  <DialogHeader>
                                    <DialogTitle className="text-red-400">Suspend Account</DialogTitle>
                                    <DialogDescription className="text-red-300">
                                      Are you sure you want to suspend {user.username}'s account? They will lose access
                                      to the platform.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setActionDialog({ open: false, type: "", user: null })}
                                      className="border-red-600 text-red-400"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => handleUserAction("suspend", user.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      Suspend Account
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Expanded User Details */}
                        {expandedUser?.id === user.id && (
                          <TableRow className="bg-red-950/5 border-red-900/20">
                            <TableCell colSpan={8} className="p-0">
                              <div className="p-6 border-t border-red-800/30">
                                {loadingUserData ? (
                                  <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                                    <span className="ml-3 text-red-300">Loading user data...</span>
                                  </div>
                                ) : (
                                  <Tabs defaultValue="files" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-red-950/20 border border-red-800">
                                      <TabsTrigger
                                        value="files"
                                        className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-red-300"
                                      >
                                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                                        Files ({userFiles.length})
                                      </TabsTrigger>
                                      <TabsTrigger
                                        value="charts"
                                        className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-red-300"
                                      >
                                        <BarChart3 className="h-4 w-4 mr-2" />
                                        Charts ({userCharts.length})
                                      </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="files" className="mt-4">
                                      {userFiles.length === 0 ? (
                                        <div className="text-center py-8">
                                          <FileSpreadsheet className="h-12 w-12 text-red-400 mx-auto mb-4" />
                                          <p className="text-red-300">No files uploaded yet</p>
                                        </div>
                                      ) : (
                                        <div className="space-y-3">
                                          {userFiles.map((file) => (
                                            <div
                                              key={file.id}
                                              className="flex items-center justify-between p-4 bg-red-950/10 rounded-lg border border-red-800/30"
                                            >
                                              <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-red-400" />
                                                <div>
                                                  <p className="font-medium text-white">{file.fileName}</p>
                                                  <div className="flex items-center gap-4 text-sm text-red-300">
                                                    <span>{file.fileSize || "Unknown size"}</span>
                                                    <span className="flex items-center gap-1">
                                                      <Calendar className="h-3 w-3" />
                                                      {file.uploadedAt
                                                        ? new Date(file.uploadedAt).toLocaleDateString()
                                                        : "Unknown date"}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  className="border-red-500 text-red-400 hover:bg-red-950"
                                                >
                                                  <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  className="border-red-500 text-red-400 hover:bg-red-950"
                                                >
                                                  <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  className="border-red-500 text-red-400 hover:bg-red-950"
                                                  onClick={() => handleDeleteFile(file.id)}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </TabsContent>

                                    <TabsContent value="charts" className="mt-4">
                                      {userCharts.length === 0 ? (
                                        <div className="text-center py-8">
                                          <BarChart3 className="h-12 w-12 text-red-400 mx-auto mb-4" />
                                          <p className="text-red-300">No charts created yet</p>
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                          {userCharts.map((chart) => (
                                            <div
                                              key={chart.id}
                                              className="p-4 bg-red-950/10 rounded-lg border border-red-800/30"
                                            >
                                              <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-medium text-white truncate">{chart.title}</h4>
                                                <div className="flex items-center gap-1">
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-500 text-red-400 hover:bg-red-950 p-1"
                                                  >
                                                    <Eye className="h-3 w-3" />
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-500 text-red-400 hover:bg-red-950 p-1"
                                                    onClick={() => handleDeleteChart(chart.id)}
                                                  >
                                                    <Trash2 className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                              <div className="text-sm text-red-300 space-y-1">
                                                <p>Type: {chart.type || "Unknown"}</p>
                                                <p className="flex items-center gap-1">
                                                  <Calendar className="h-3 w-3" />
                                                  {chart.createdAt
                                                    ? new Date(chart.createdAt).toLocaleDateString()
                                                    : "Unknown date"}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </TabsContent>
                                  </Tabs>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-300 mb-2">No users found</h3>
              <p className="text-red-400">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
