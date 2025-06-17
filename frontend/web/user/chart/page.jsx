"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, CuboidIcon as Cube } from 'lucide-react'

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

      // Original color themes
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
        title: {
          text: chartTitle,
          font: {
            color: "#00FFFF", // Neon cyan for title
          },
        },
        showlegend: showLegend,
        margin: { l: 60, r: 60, b: 60, t: 80, pad: 4 },
        paper_bgcolor: "#121212", // Dark background for chart paper
        plot_bgcolor: "#1a1a1a", // Dark background for plot area
        font: {
          color: "#00FFFF", // Neon cyan for text
        },
        colorway: themeColors, // Use the original theme colors
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
                  line: {
                    color: themeColors[1] || primaryColor,
                    width: 1,
                  },
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
                colorscale: [
                  [0, "#121212"],
                  [0.5, themeColors[1] || "#777777"],
                  [1, primaryColor],
                ],
                name: `${zAxis} by ${xAxis} and ${yAxis}`,
              },
            ]
            break
        }

        // 3D layout settings
        layout = {
          ...layout,
          scene: {
            xaxis: {
              title: xAxis,
              showgrid: showGrid,
              gridcolor: "#333333",
              linecolor: "#555555",
              zerolinecolor: "#444444",
            },
            yaxis: {
              title: yAxis,
              showgrid: showGrid,
              gridcolor: "#333333",
              linecolor: "#555555",
              zerolinecolor: "#444444",
            },
            zaxis: {
              title: zAxis,
              showgrid: showGrid,
              gridcolor: "#333333",
              linecolor: "#555555",
              zerolinecolor: "#444444",
            },
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
                marker: {
                  color: primaryColor,
                  line: {
                    color: themeColors[1] || primaryColor,
                    width: 1,
                  },
                },
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
                line: {
                  color: primaryColor,
                  width: 3,
                },
                marker: {
                  color: themeColors[1] || primaryColor,
                  size: 8,
                },
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
                textinfo: "label+percent",
                textfont: {
                  color: "#ffffff", // White text for better contrast on colored pie slices
                },
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
                fillcolor: `${primaryColor}33`, // Add transparency
                line: {
                  color: primaryColor,
                  width: 3,
                },
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
                marker: {
                  color: primaryColor,
                  size: 10,
                  line: {
                    color: themeColors[1] || primaryColor,
                    width: 1,
                  },
                },
                name: yAxis,
              },
            ]
            break
        }

        // 2D layout settings
        if (type !== "pie") {
          layout = {
            ...layout,
            xaxis: {
              title: xAxis,
              showgrid: showGrid,
              gridcolor: "#333333",
              linecolor: "#555555",
              zerolinecolor: "#444444",
            },
            yaxis: {
              title: yAxis,
              showgrid: showGrid,
              gridcolor: "#333333",
              linecolor: "#555555",
              zerolinecolor: "#444444",
            },
          }
        }
      }

      // Create the Plotly chart
      await window.Plotly.newPlot(chartRef.current, plotData, layout, {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ["pan2d", "lasso2d", "select2d"],
        modeBarStyle: {
          color: "#00FFFF",
          backgroundColor: "#121212",
        },
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
      <div className="neon-bg min-h-screen" style={{ backgroundColor: "#121212" }}>
        <div className="container mx-auto py-10 px-4">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
              <p style={{ color: "#00FFFF", textShadow: "0 0 5px rgba(0, 255, 255, 0.7)" }}>Loading your chart...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "black" }}>
        <div className="container mx-auto py-10 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: "#00FFFF", textShadow: "0 0 5px rgba(0, 255, 255, 0.7)" }}>Error</h1>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => navigate("/dashboard")} className="bg-black hover:bg-[#00FFFF] text-black">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!chartConfig) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "black" }}>
        <div className="container mx-auto py-10 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: "#00FFFF", textShadow: "0 0 5px rgba(0, 255, 255, 0.7)" }}>Chart not found</h1>
            <Button onClick={() => navigate("/dashboard")} className="bg-black hover:bg-[#00FFFF] text-black">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#121212" }}>
      <div className="container mx-auto py-10 px-4">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")} 
            className="border-[#00BFFF] text-[#00FFFF] hover:bg-[#121212] hover:border-[#00FFFF] bg-black"
            style={{ borderColor: "#00BFFF", color: "#00FFFF" }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={downloadChart} 
              className="border-[#00BFFF] text-[#00FFFF] hover:bg-[#121212] hover:border-[#00FFFF] bg-black"
              style={{ borderColor: "#00BFFF", color: "#00FFFF" }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PNG
            </Button>
            <Button 
              variant="outline" 
              onClick={shareChart} 
              className="border-[#00BFFF] text-[#00FFFF] hover:bg-[#121212] hover:border-[#00FFFF] bg-black"
              style={{ borderColor: "#00BFFF", color: "#00FFFF" }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <Card style={{ 
          backgroundColor: "rgba(18, 18, 18, 0.8)", 
          borderColor: "#00BFFF", 
          boxShadow: "0 0 10px rgba(0, 191, 255, 0.3)" 
        }}>
          <CardHeader style={{ borderBottomColor: "rgba(0, 191, 255, 0.3)" }}>
            <CardTitle className="flex items-center gap-2" style={{ color: "#00FFFF" }}>
              {chartConfig.is3D && <Cube className="h-5 w-5" style={{ color: "#00FFFF" }} />}
              {chartConfig.chartTitle}
            </CardTitle>
            <CardDescription style={{ color: "rgba(0, 191, 255, 0.7)" }}>
              Generated from {chartConfig.fileName} • {chartConfig.type} chart • {chartConfig.selectedTheme} theme
              {chartConfig.is3D && " • 3D Visualization"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px] w-full p-4">
              <div ref={chartRef} className="w-full h-full"></div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card style={{ 
            backgroundColor: "rgba(18, 18, 18, 0.8)", 
            borderColor: "#00BFFF", 
            boxShadow: "0 0 10px rgba(0, 191, 255, 0.3)" 
          }}>
            <CardContent className="p-4">
              <p style={{ color: "rgba(0, 191, 255, 0.7)", fontSize: "0.875rem" }}>Chart Type</p>
              <p style={{ color: "#00FFFF", fontWeight: "600", textTransform: "capitalize" }}>{chartConfig.type}</p>
            </CardContent>
          </Card>
          <Card style={{ 
            backgroundColor: "rgba(18, 18, 18, 0.8)", 
            borderColor: "#00BFFF", 
            boxShadow: "0 0 10px rgba(0, 191, 255, 0.3)" 
          }}>
            <CardContent className="p-4">
              <p style={{ color: "rgba(0, 191, 255, 0.7)", fontSize: "0.875rem" }}>X-Axis</p>
              <p style={{ color: "#00FFFF", fontWeight: "600" }}>{chartConfig.xAxis}</p>
            </CardContent>
          </Card>
          <Card style={{ 
            backgroundColor: "rgba(18, 18, 18, 0.8)", 
            borderColor: "#00BFFF", 
            boxShadow: "0 0 10px rgba(0, 191, 255, 0.3)" 
          }}>
            <CardContent className="p-4">
              <p style={{ color: "rgba(0, 191, 255, 0.7)", fontSize: "0.875rem" }}>Y-Axis</p>
              <p style={{ color: "#00FFFF", fontWeight: "600" }}>{chartConfig.yAxis}</p>
            </CardContent>
          </Card>
          <Card style={{ 
            backgroundColor: "rgba(18, 18, 18, 0.8)", 
            borderColor: "#00BFFF", 
            boxShadow: "0 0 10px rgba(0, 191, 255, 0.3)" 
          }}>
            <CardContent className="p-4">
              <p style={{ color: "rgba(0, 191, 255, 0.7)", fontSize: "0.875rem" }}>{chartConfig.is3D ? "Z-Axis" : "Data Points"}</p>
              <p style={{ color: "#00FFFF", fontWeight: "600" }}>
                {chartConfig.is3D ? chartConfig.zAxis : chartConfig.xData?.length || 0}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}