"use client"

import { useState,useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileSpreadsheet, BarChart3, Download, Eye, Trash2, Plus, Brain } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { WelcomeSection } from "@/components/welcome-section"
import { UploadDialog } from "@/components/upload-dialog"
import { ChartPreview } from "@/components/chart-preview"
import { AIInsights } from "@/components/ai-insights"
import { RecentUploads } from "@/components/recent-uploads"
import { ChartGallery } from "@/components/chart-gallery"
import { StatsCards } from "@/components/stats-cards"


export default function DashboardPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [user, setUser] = useState(null)

useEffect(() => {
  const name = localStorage.getItem("username")
  const email = localStorage.getItem("email")
  if (name && email) {
    setUser({ name, email })
  }
}, [])

if (!user) return <p className="p-6 text-sm text-gray-500">Loading dashboard...</p>

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader name={user.name} email={user.email} />

        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <WelcomeSection name={user.name}  />

          {/* Stats Overview */}
          <StatsCards />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Start analyzing your data with these quick actions</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button onClick={() => setUploadDialogOpen(true)} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Excel File
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Create Chart
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Analysis
              </Button>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentUploads />
                <ChartGallery />
              </div>
              <AIInsights />
            </TabsContent>

            <TabsContent value="files" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Files</CardTitle>
                    <CardDescription>Manage your uploaded Excel files and their analysis</CardDescription>
                  </div>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New File
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Sales_Data_Q4.xlsx",
                        size: "2.4 MB",
                        uploaded: "2 hours ago",
                        charts: 3,
                        status: "processed",
                      },
                      {
                        name: "Customer_Analytics.xls",
                        size: "1.8 MB",
                        uploaded: "1 day ago",
                        charts: 5,
                        status: "processed",
                      },
                      {
                        name: "Financial_Report.xlsx",
                        size: "3.2 MB",
                        uploaded: "3 days ago",
                        charts: 2,
                        status: "processing",
                      },
                    ].map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="h-8 w-8 text-green-600" />
                          <div>
                            <h4 className="font-medium">{file.name}</h4>
                            <p className="text-sm text-gray-500">
                              {file.size} • {file.uploaded} • {file.charts} charts
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={file.status === "processed" ? "default" : "secondary"}>{file.status}</Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chart Gallery</CardTitle>
                  <CardDescription>View and manage all your generated charts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Sales Trend",
                        type: "Line Chart",
                        file: "Sales_Data_Q4.xlsx",
                        created: "2 hours ago",
                      },
                      {
                        title: "Revenue by Region",
                        type: "Bar Chart",
                        file: "Sales_Data_Q4.xlsx",
                        created: "3 hours ago",
                      },
                      {
                        title: "Customer Distribution",
                        type: "3D Pie Chart",
                        file: "Customer_Analytics.xls",
                        created: "1 day ago",
                      },
                      {
                        title: "Monthly Growth",
                        type: "Area Chart",
                        file: "Financial_Report.xlsx",
                        created: "2 days ago",
                      },
                    ].map((chart, index) => (
                      <ChartPreview key={index} chart={chart} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <AIInsights />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </div>
  )
}
