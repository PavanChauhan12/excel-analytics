"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, CuboidIcon as Cube } from "lucide-react"

export default function ChartPage() {
  const navigate = useNavigate()
  const chartRef = useRef(null)
  const plotlyInstance = useRef(null)
  const [chartConfig, setChartConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()
  const chartId = id

  // Load chart config from localStorage
  useEffect(() => {
    if (!chartId) {
      setError("No chart ID provided")
      setLoading(false)
      return
    }

    try {
      const config = localStorage.getItem(`chartConfig_${chartId}`)
      if (!config) {
        setError("Chart configuration not found")
        setLoading(false)
        return
      }

      const parsedConfig = JSON.parse(config)
      setChartConfig(parsedConfig)
      setLoading(false)
    } catch (err) {
      console.error("Error loading chart config:", err)
      setError("Failed to load chart configuration")
      setLoading(false)
    }
  }, [chartId])

  // Render chart when config is loaded
  useEffect(() => {
    if (chartConfig && chartRef.current && !plotlyInstance.current) {
      renderChart()
    }

    return () => {
      if (plotlyInstance.current && chartRef.current) {
        try {
          window.Plotly?.purge(chartRef.current)
        } catch (e) {
          console.log("Plotly cleanup error:", e)
        }
        plotlyInstance.current = null
      }
    }
  }, [chartConfig])

  const renderChart = async () => {
    if (!chartRef.current || !chartConfig) return

    // Load Plotly dynamically
    if (!window.Plotly) {
      try {
        const Plotly = await import("plotly.js-dist")
        window.Plotly = Plotly.default
      } catch (error) {
        console.error("Failed to load Plotly:", error)
        setError("Failed to load chart library")
        return
      }
    }

    try {
      const { type, xData, yData, zData, xAxis, yAxis, zAxis, chartTitle, selectedTheme, showLegend, showGrid, is3D } =
        chartConfig

      // Color themes
      const colorThemes = [
        { name: "Default", colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"] },
        { name: "Ocean", colors: ["#0ea5e9", "#06b6d4", "#0891b2", "#0e7490", "#155e75"] },
        { name: "Forest", colors: ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"] },
        { name: "Sunset", colors: ["#f59e0b", "#f97316", "#ef4444", "#dc2626", "#b91c1c"] },
        { name: "Purple", colors: ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"] },
        { name: "Yellow", colors: ["#f1c40f", "#f39c12", "#e67e22", "#d35400", "#c0392b"] },
      ]

      const themeColors = colorThemes.find((t) => t.name === selectedTheme)?.colors || colorThemes[0].colors
      const primaryColor = themeColors[0]

      let plotData = []
      let layout = {
        title: chartTitle,
        showlegend: showLegend,
        margin: { l: 60, r: 60, b: 60, t: 80, pad: 4 },
        paper_bgcolor: "white",
        plot_bgcolor: "white",
      }

      // Configure chart based on type
      if (is3D) {
        // 3D chart configuration
        switch (type) {
          case "bar3d":
          case "scatter3d":
            plotData = [
              {
                type: "scatter3d",
                mode: type === "bar3d" ? "markers" : "markers",
                x: xData,
                y: yData,
                z: zData,
                marker: {
                  size: type === "bar3d" ? 8 : 6,
                  color: primaryColor,
                  opacity: 0.8,
                },
                name: `${yAxis} vs ${xAxis} vs ${zAxis}`,
              },
            ]
            break
          case "surface3d":
            // For surface plots, organize data into a grid
            const uniqueX = [...new Set(xData)].sort((a, b) => a - b)
            const uniqueY = [...new Set(yData)].sort((a, b) => a - b)

            const zValues = Array(uniqueY.length)
              .fill()
              .map(() => Array(uniqueX.length).fill(0))

            // Fill in z values where we have data
            xData.forEach((x, index) => {
              const y = yData[index]
              const z = zData[index]
              const xIndex = uniqueX.indexOf(x)
              const yIndex = uniqueY.indexOf(y)
              if (xIndex >= 0 && yIndex >= 0) {
                zValues[yIndex][xIndex] = z
              }
            })

            plotData = [
              {
                type: "surface",
                x: uniqueX,
                y: uniqueY,
                z: zValues,
                colorscale: "Viridis",
                name: `${zAxis} by ${xAxis} and ${yAxis}`,
              },
            ]
            break
        }

        // 3D layout settings
        layout = {
          ...layout,
          scene: {
            xaxis: { title: xAxis, showgrid: showGrid },
            yaxis: { title: yAxis, showgrid: showGrid },
            zaxis: { title: zAxis, showgrid: showGrid },
          },
        }
      } else {
        // 2D chart configuration
        switch (type) {
          case "bar":
            plotData = [
              {
                type: "bar",
                x: xData,
                y: yData,
                marker: { color: primaryColor },
                name: yAxis,
              },
            ]
            break
          case "line":
            plotData = [
              {
                type: "scatter",
                mode: "lines+markers",
                x: xData,
                y: yData,
                line: { color: primaryColor },
                name: yAxis,
              },
            ]
            break
          case "pie":
            plotData = [
              {
                type: "pie",
                labels: xData,
                values: yData,
                marker: { colors: themeColors },
                name: yAxis,
              },
            ]
            break
          case "area":
            plotData = [
              {
                type: "scatter",
                mode: "lines",
                x: xData,
                y: yData,
                fill: "tozeroy",
                fillcolor: `${primaryColor}33`,
                line: { color: primaryColor },
                name: yAxis,
              },
            ]
            break
          case "scatter":
            plotData = [
              {
                type: "scatter",
                mode: "markers",
                x: xData,
                y: yData,
                marker: { color: primaryColor },
                name: yAxis,
              },
            ]
            break
        }

        // 2D layout settings
        if (type !== "pie") {
          layout = {
            ...layout,
            xaxis: { title: xAxis, showgrid: showGrid },
            yaxis: { title: yAxis, showgrid: showGrid },
          }
        }
      }

      // Create the Plotly chart
      await window.Plotly.newPlot(chartRef.current, plotData, layout, {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ["pan2d", "lasso2d", "select2d"],
      })
      plotlyInstance.current = true
    } catch (err) {
      console.error("Error rendering chart:", err)
      setError("Failed to render chart")
    }
  }

  const downloadChart = async () => {
    if (plotlyInstance.current && chartRef.current) {
      try {
        const imgData = await window.Plotly.toImage(chartRef.current, {
          format: "png",
          width: 1200,
          height: 800,
        })

        const link = document.createElement("a")
        link.download = `${chartConfig.chartTitle || "chart"}.png`
        link.href = imgData
        link.click()
      } catch (err) {
        console.error("Error downloading chart:", err)
        alert("Failed to download chart")
      }
    }
  }

  const shareChart = () => {
    const shareUrl = `${window.location.origin}/chart/${chartId}`
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("Chart link copied to clipboard!")
      })
      .catch(() => {
        alert("Failed to copy link")
      })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading your chart...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (!chartConfig) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chart not found</h1>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadChart}>
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>
          <Button variant="outline" onClick={shareChart}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {chartConfig.is3D && <Cube className="h-5 w-5" />}
            {chartConfig.chartTitle}
          </CardTitle>
          <CardDescription>
            Generated from {chartConfig.fileName} • {chartConfig.type} chart • {chartConfig.selectedTheme} theme
            {chartConfig.is3D && " • 3D Visualization"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] w-full">
            <div ref={chartRef} className="w-full h-full"></div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Chart Type</p>
            <p className="font-semibold capitalize">{chartConfig.type}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">X-Axis</p>
            <p className="font-semibold">{chartConfig.xAxis}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Y-Axis</p>
            <p className="font-semibold">{chartConfig.yAxis}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">{chartConfig.is3D ? "Z-Axis" : "Data Points"}</p>
            <p className="font-semibold">{chartConfig.is3D ? chartConfig.zAxis : chartConfig.xData?.length || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
