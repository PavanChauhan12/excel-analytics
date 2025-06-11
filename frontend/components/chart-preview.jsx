"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, Eye, Share, CuboidIcon as Cube } from "lucide-react"

export function ChartPreview({ chart }) {
  const handleViewChart = () => {
    if (chart.id) {
      // Increment view count
      try {
        const charts = JSON.parse(localStorage.getItem("userCharts") || "[]")
        const updatedCharts = charts.map((c) => (c.id === chart.id ? { ...c, views: (c.views || 0) + 1 } : c))
        localStorage.setItem("userCharts", JSON.stringify(updatedCharts))
      } catch (error) {
        console.error("Error updating view count:", error)
      }

      window.location.href = `/chart/${chart.id}`
    }
  }

  const handleDownloadChart = () => {
    if (chart.id) {
      // Increment download count
      try {
        const charts = JSON.parse(localStorage.getItem("userCharts") || "[]")
        const updatedCharts = charts.map((c) => (c.id === chart.id ? { ...c, downloads: (c.downloads || 0) + 1 } : c))
        localStorage.setItem("userCharts", JSON.stringify(updatedCharts))
      } catch (error) {
        console.error("Error updating download count:", error)
      }

      console.log("Downloading chart:", chart.id)
    }
  }

  const handleShareChart = () => {
    if (chart.id) {
      const shareUrl = `${window.location.origin}/chart/${chart.id}`
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("Chart link copied to clipboard!")
        })
        .catch(() => {
          alert("Failed to copy link")
        })
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{chart.type}</Badge>
            {chart.is3D && <Badge className="bg-blue-500 text-white">3D</Badge>}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={handleViewChart}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShareChart}>
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownloadChart}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Chart Preview */}
        <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
          {chart.is3D ? <Cube className="h-8 w-8 text-blue-600" /> : <BarChart3 className="h-8 w-8 text-blue-600" />}
        </div>

        {/* Chart Info */}
        <div>
          <CardTitle className="text-sm">{chart.title}</CardTitle>
          <p className="text-xs text-gray-500 mt-1">From {chart.file}</p>
          <p className="text-xs text-gray-400">Created {chart.created}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{chart.views || 0} views</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">{chart.downloads || 0} downloads</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
