"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileSpreadsheet,
  Search,
  Upload,
  Download,
  Eye,
  Trash2,
  MoreHorizontal,
  Calendar,
  BarChart3,
  Plus,
  TrendingUp,
  Database,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { UploadDialog } from "@/components/upload-dialog"

import { FileAnalysisInlineView } from "@/components/file-analysis"

const allUserFiles = [
  {
    id: 1,
    name: "Q4_Sales_Report.xlsx",
    size: "2.4 MB",
    uploadDate: "2024-06-08",
    lastModified: "2024-06-08 14:30",
    status: "Processed",
    charts: 3,
    downloads: 12,
    views: 45,
    type: "Sales Data",
    rows: 1250,
    columns: 8,
    health: "excellent",
  },
  {
    id: 2,
    name: "Customer_Analytics_2024.xls",
    size: "5.7 MB",
    uploadDate: "2024-06-07",
    lastModified: "2024-06-07 09:15",
    status: "Processed",
    charts: 8,
    downloads: 23,
    views: 89,
    type: "Analytics",
    rows: 3420,
    columns: 12,
    health: "good",
  },
  {
    id: 3,
    name: "Financial_Data_Q1.xlsx",
    size: "3.2 MB",
    uploadDate: "2024-06-06",
    lastModified: "2024-06-06 16:45",
    status: "Processing",
    charts: 5,
    downloads: 7,
    views: 34,
    type: "Financial",
    rows: 2100,
    columns: 15,
    health: "good",
  },
  {
    id: 4,
    name: "Marketing_Campaign_Results.xlsx",
    size: "1.8 MB",
    uploadDate: "2024-06-05",
    lastModified: "2024-06-05 11:20",
    status: "Processed",
    charts: 4,
    downloads: 15,
    views: 67,
    type: "Marketing",
    rows: 890,
    columns: 6,
    health: "excellent",
  },
  {
    id: 5,
    name: "Inventory_Report_May.xls",
    size: "4.1 MB",
    uploadDate: "2024-06-04",
    lastModified: "2024-06-04 13:10",
    status: "Error",
    charts: 0,
    downloads: 0,
    views: 12,
    type: "Inventory",
    rows: 0,
    columns: 0,
    health: "poor",
  },
  {
    id: 6,
    name: "Employee_Performance.xlsx",
    size: "2.9 MB",
    uploadDate: "2024-06-03",
    lastModified: "2024-06-03 10:30",
    status: "Processed",
    charts: 6,
    downloads: 8,
    views: 28,
    type: "HR",
    rows: 1680,
    columns: 10,
    health: "good",
  },
  {
    id: 7,
    name: "Product_Sales_Analysis.xlsx",
    size: "6.3 MB",
    uploadDate: "2024-06-02",
    lastModified: "2024-06-02 15:45",
    status: "Processed",
    charts: 9,
    downloads: 31,
    views: 102,
    type: "Sales Data",
    rows: 4250,
    columns: 14,
    health: "excellent",
  },
  {
    id: 8,
    name: "Budget_Planning_2024.xls",
    size: "3.7 MB",
    uploadDate: "2024-06-01",
    lastModified: "2024-06-01 08:20",
    status: "Processed",
    charts: 7,
    downloads: 19,
    views: 56,
    type: "Financial",
    rows: 2800,
    columns: 11,
    health: "good",
  },
]

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false)

  const filteredFiles = allUserFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || file.status.toLowerCase() === statusFilter
    const matchesType = typeFilter === "all" || file.type.toLowerCase() === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status) => {
    const variants = {
      Processed: { variant: "default", className: "bg-green-100 text-green-800 border-green-200" },
      Processing: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      Error: { variant: "destructive", className: "bg-red-100 text-red-800 border-red-200" },
    }
    const config = variants[status] || variants.Processing
    return <Badge className={config.className}>{status}</Badge>
  }

  const getTypeBadge = (type) => {
    const colors = {
      "Sales Data": "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
      Analytics: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300",
      Financial: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      Marketing: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300",
      Inventory: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300",
      HR: "bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-300",
    }
    return <Badge className={`${colors[type] || colors.Inventory} border`}>{type}</Badge>
  }

  const getHealthIndicator = (health) => {
    const indicators = {
      excellent: { color: "bg-green-500", text: "Excellent" },
      good: { color: "bg-blue-500", text: "Good" },
      poor: { color: "bg-red-500", text: "Poor" },
    }
    const config = indicators[health] || indicators.good
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
        <span className="text-xs text-gray-600">{config.text}</span>
      </div>
    )
  }

  const handleViewFile = (file) => {
    setSelectedFile(file)
    setAnalysisModalOpen(true)
  }

  const totalFiles = allUserFiles.length
  const totalStorage = allUserFiles.reduce((acc, file) => {
    const size = Number.parseFloat(file.size.replace(" MB", ""))
    return acc + size
  }, 0)
  const totalCharts = allUserFiles.reduce((acc, file) => acc + file.charts, 0)
  const totalViews = allUserFiles.reduce((acc, file) => acc + file.views, 0)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                File Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and analyze your uploaded Excel files</p>
            </div>
            <Button
              onClick={() => setUploadDialogOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Upload className="h-4 w-4" />
              Upload New File
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Files</p>
                    <p className="text-3xl font-bold">{totalFiles}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <FileSpreadsheet className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Storage</p>
                    <p className="text-3xl font-bold">{totalStorage.toFixed(1)} MB</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Database className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Charts Created</p>
                    <p className="text-3xl font-bold">{totalCharts}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Total Views</p>
                    <p className="text-3xl font-bold">{totalViews}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Files Table */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-800">File Library</CardTitle>
                  <CardDescription>Complete history of all your uploaded files with analysis</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 border-gray-200 focus:border-blue-400"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sales data">Sales Data</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700">File Details</TableHead>
                      <TableHead className="font-semibold text-gray-700">Type</TableHead>
                      <TableHead className="font-semibold text-gray-700">Data Info</TableHead>
                      <TableHead className="font-semibold text-gray-700">Upload Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Analytics</TableHead>
                      <TableHead className="font-semibold text-gray-700">Health</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow key={file.id} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                              <FileSpreadsheet className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>Modified {file.lastModified}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(file.type)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">{file.rows.toLocaleString()} rows</p>
                            <p className="text-gray-500">{file.columns} columns</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{file.uploadDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(file.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3 text-blue-500" />
                              <span className="text-gray-600">{file.charts}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3 text-green-500" />
                              <span className="text-gray-600">{file.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3 text-purple-500" />
                              <span className="text-gray-600">{file.downloads}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getHealthIndicator(file.health)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewFile(file)}
                              className="hover:bg-blue-100 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Create Chart
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      <FileAnalysisInlineView open={analysisModalOpen} onOpenChange={setAnalysisModalOpen} file={selectedFile} />
    </div>
  )
}
