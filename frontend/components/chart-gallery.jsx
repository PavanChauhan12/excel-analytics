"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, Eye, CuboidIcon as Cube } from "lucide-react"

export function ChartGallery() {
  const [recentCharts, setRecentCharts] = useState([])

  useEffect(() => {
    // Load charts from localStorage
    const loadCharts = () => {
      try {
        const charts = JSON.parse(localStorage.getItem("userCharts") || "[]")
        setRecentCharts(charts.slice(0, 3)) // Show only 3 most recent
      } catch (error) {
        console.error("Error loading charts:", error)
        setRecentCharts([])
      }
    }

    loadCharts()

    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      loadCharts()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleViewChart = (chartId) => {
    // Increment view count
    try {
      const charts = JSON.parse(localStorage.getItem("userCharts") || "[]")
      const updatedCharts = charts.map((chart) =>
        chart.id === chartId ? { ...chart, views: (chart.views || 0) + 1 } : chart,
      )
      localStorage.setItem("userCharts", JSON.stringify(updatedCharts))
      setRecentCharts(updatedCharts.slice(0, 3))
    } catch (error) {
      console.error("Error updating view count:", error)
    }

    // Navigate to chart
    window.location.href = `/chart/${chartId}`
  }

  const handleDownloadChart = (chartId) => {
    // Increment download count
    try {
      const charts = JSON.parse(localStorage.getItem("userCharts") || "[]")
      const updatedCharts = charts.map((chart) =>
        chart.id === chartId ? { ...chart, downloads: (chart.downloads || 0) + 1 } : chart,
      )
      localStorage.setItem("userCharts", JSON.stringify(updatedCharts))
      setRecentCharts(updatedCharts.slice(0, 3))
    } catch (error) {
      console.error("Error updating download count:", error)
    }

    // Here you would implement actual download functionality
    console.log("Downloading chart:", chartId)
  }

  if (recentCharts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Charts
          </CardTitle>
          <CardDescription>Your latest generated visualizations</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No charts created yet</p>
          <p className="text-sm text-gray-400">Upload an Excel file and create your first chart!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Recent Charts
        </CardTitle>
        <CardDescription>Your latest generated visualizations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentCharts.map((chart) => (
          <div
            key={chart.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center">
                {chart.is3D ? (
                  <Cube className="h-4 w-4 text-blue-600" />
                ) : (
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-sm">{chart.title}</h4>
                <p className="text-xs text-gray-500">
                  {chart.type} • {chart.created}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{chart.views || 0} views</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{chart.downloads || 0} downloads</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{chart.type}</Badge>
              {chart.is3D && <Badge className="bg-blue-500 text-white">3D</Badge>}
              <Button variant="ghost" size="sm" onClick={() => handleViewChart(chart.id)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDownloadChart(chart.id)}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
