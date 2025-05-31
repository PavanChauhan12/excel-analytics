"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, Eye, BarChart3 } from "lucide-react"

const recentFiles = [
  {
    name: "Sales_Data_Q4.xlsx",
    size: "2.4 MB",
    uploaded: "2 hours ago",
    status: "processed",
    charts: 3,
  },
  {
    name: "Customer_Analytics.xls",
    size: "1.8 MB",
    uploaded: "1 day ago",
    status: "processed",
    charts: 5,
  },
  {
    name: "Financial_Report.xlsx",
    size: "3.2 MB",
    uploaded: "3 days ago",
    status: "processing",
    charts: 0,
  },
]

export function RecentUploads() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Recent Uploads
        </CardTitle>
        <CardDescription>Your latest uploaded Excel files</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentFiles.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-medium text-sm">{file.name}</h4>
                <p className="text-xs text-gray-500">
                  {file.size} • {file.uploaded}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={file.status === "processed" ? "default" : "secondary"}>{file.status}</Badge>
              {file.charts > 0 && (
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
