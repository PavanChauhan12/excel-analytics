"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  Palette,
  FileSpreadsheet,
  CuboidIcon as Cube,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react"
import * as XLSX from "xlsx"

// Define chart types for selection
const chartTypes = [
  {
    id: "bar",
    name: "Bar Chart",
    icon: BarChart3,
    description: "Compare values across categories",
    best_for: "Categorical data comparison",
    is3D: false,
  },
  {
    id: "line",
    name: "Line Chart",
    icon: LineChart,
    description: "Show trends over time",
    best_for: "Time series data",
    is3D: false,
  },
  {
    id: "pie",
    name: "Pie Chart",
    icon: PieChart,
    description: "Show parts of a whole",
    best_for: "Percentage breakdown",
    is3D: false,
  },
  {
    id: "area",
    name: "Area Chart",
    icon: AreaChart,
    description: "Show cumulative values over time",
    best_for: "Stacked data visualization",
    is3D: false,
  },
  {
    id: "scatter",
    name: "Scatter Plot",
    icon: ScatterChart,
    description: "Show correlation between variables",
    best_for: "Relationship analysis",
    is3D: false,
  },
  {
    id: "bar3d",
    name: "3D Bar Chart",
    icon: Cube,
    description: "Compare values across multiple dimensions",
    best_for: "Multi-dimensional data comparison",
    is3D: true,
  },
  {
    id: "scatter3d",
    name: "3D Scatter Plot",
    icon: Cube,
    description: "Show correlation between three variables",
    best_for: "Multi-dimensional relationship analysis",
    is3D: true,
  },
  {
    id: "surface3d",
    name: "3D Surface Plot",
    icon: Cube,
    description: "Visualize a function of two variables",
    best_for: "Surface visualization and terrain mapping",
    is3D: true,
  },
]

// Define color themes for chart customization
const colorThemes = [
  {
    name: "Default",
    colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
  },
  {
    name: "Ocean",
    colors: ["#0ea5e9", "#06b6d4", "#0891b2", "#0e7490", "#155e75"],
  },
  {
    name: "Forest",
    colors: ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"],
  },
  {
    name: "Sunset",
    colors: ["#f59e0b", "#f97316", "#ef4444", "#dc2626", "#b91c1c"],
  },
  {
    name: "Purple",
    colors: ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"],
  },
  {
    name: "Yellow",
    colors: ["#f1c40f", "#f39c12", "#e67e22", "#d35400", "#c0392b"],
  },
]

export function ChartCreationDialog({ open, onOpenChange, selectedFile }) {
  const [fileData, setFileData] = useState([])
  const [columns, setColumns] = useState([])
  const [selectedChart, setSelectedChart] = useState("line")
  const [xAxis, setXAxis] = useState("")
  const [yAxis, setYAxis] = useState("")
  const [zAxis, setZAxis] = useState("")
  const [chartTitle, setChartTitle] = useState("")
  const [selectedTheme, setSelectedTheme] = useState("Default")
  const [showLegend, setShowLegend] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [fileName, setFileName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const chartRef = useRef(null)
  const plotlyInstance = useRef(null)

  // Define the steps in the workflow
  const steps = ["Select Data", "Choose Chart", "Configure Axes", "Style & Theme", "Preview"]

  // Process the selected file when component mounts or file changes
  useEffect(() => {
    if (selectedFile && open) {
      processExcelFile(selectedFile)
    }
  }, [selectedFile, open])

  // Effect hook to re-render the preview chart
  useEffect(() => {
    if (currentStep === 4 && fileData.length > 0 && xAxis && yAxis && selectedChart) {
      renderPreviewChart()
    }
  }, [currentStep, fileData, xAxis, yAxis, zAxis, selectedChart, selectedTheme, showLegend, showGrid])

  // Cleanup effect
  useEffect(() => {
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
  }, [])

  // Improved function to detect if a value can be treated as a number
  const isNumericValue = (value) => {
    if (value === null || value === undefined || value === "") return false
    if (typeof value === "number") return !isNaN(value)
    if (typeof value === "string") {
      const cleanValue = value.toString().replace(/[,$%\s]/g, "")
      return !isNaN(cleanValue) && !isNaN(Number.parseFloat(cleanValue)) && cleanValue !== ""
    }
    return false
  }

  // Improved function to detect column type based on multiple samples
  const detectColumnType = (columnName, data) => {
    const samples = data.slice(0, Math.min(10, data.length))
    let numericCount = 0
    let totalCount = 0

    for (const row of samples) {
      const value = row[columnName]
      if (value !== null && value !== undefined && value !== "") {
        totalCount++
        if (isNumericValue(value)) {
          numericCount++
        }
      }
    }

    return totalCount > 0 && numericCount / totalCount > 0.7 ? "number" : "text"
  }

  // Process the Excel file
  const processExcelFile = (file) => {
    if (!file) {
      console.error("No file provided")
      setIsProcessing(false)
      return
    }

    setIsProcessing(true)
    setFileName(file.name || "Unknown file")

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "binary" })
        const firstSheet = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheet]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        if (jsonData.length === 0) {
          console.error("No data found in the Excel sheet.")
          setIsProcessing(false)
          return
        }

        setFileData(jsonData)

        const headers = Object.keys(jsonData[0])
        const columnsWithTypes = headers.map((header) => {
          const detectedType = detectColumnType(header, jsonData)
          return {
            name: header,
            type: detectedType,
            sample: jsonData[0][header],
          }
        })

        setColumns(columnsWithTypes)
        setIsProcessing(false)
      } catch (error) {
        console.error("Error processing Excel file:", error)
        setIsProcessing(false)
      }
    }

    if (file instanceof Blob) {
      reader.readAsBinaryString(file)
    } else {
      console.error("Invalid file object:", file)
      setIsProcessing(false)
    }
  }

  // Render preview chart using Plotly.js
  const renderPreviewChart = async () => {
    if (!chartRef.current || !selectedChart) return

    // Load Plotly dynamically
    if (!window.Plotly) {
      try {
        const Plotly = await import("plotly.js-dist")
        window.Plotly = Plotly.default
      } catch (error) {
        console.error("Failed to load Plotly:", error)
        return
      }
    }

    // Clean up previous chart if it exists
    if (plotlyInstance.current) {
      window.Plotly.purge(chartRef.current)
    }

    try {
      // Extract data
      const xData = fileData.map((row) => row[xAxis])
      const yData = fileData.map((row) => {
        const value = row[yAxis]
        return isNumericValue(value) ? Number.parseFloat(value.toString().replace(/[,$%\s]/g, "")) : 0
      })

      // Extract z-axis data for 3D charts
      const zData = zAxis
        ? fileData.map((row) => {
            const value = row[zAxis]
            return isNumericValue(value) ? Number.parseFloat(value.toString().replace(/[,$%\s]/g, "")) : 0
          })
        : []

      const themeColors = colorThemes.find((t) => t.name === selectedTheme)?.colors || colorThemes[0].colors
      const primaryColor = themeColors[0]

      // Determine if the selected chart is 3D
      const is3D = chartTypes.find((chart) => chart.id === selectedChart)?.is3D || false

      let plotData = []
      let layout = {
        title: chartTitle || `${yAxis} vs ${xAxis}${zAxis ? ` vs ${zAxis}` : ""}`,
        showlegend: showLegend,
        margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
        paper_bgcolor: "white",
        plot_bgcolor: "white",
      }

      // Configure chart based on type
      if (is3D) {
        // 3D chart configuration
        switch (selectedChart) {
          case "bar3d":
            plotData = [
              {
                type: "scatter3d",
                mode: "markers",
                x: xData,
                y: yData,
                z: zData,
                marker: {
                  size: 8,
                  color: primaryColor,
                  opacity: 0.8,
                },
                name: `${yAxis} vs ${xAxis} vs ${zAxis}`,
              },
            ]
            break
          case "scatter3d":
            plotData = [
              {
                type: "scatter3d",
                mode: "markers",
                x: xData,
                y: yData,
                z: zData,
                marker: {
                  size: 6,
                  color: primaryColor,
                  opacity: 0.8,
                },
                name: `${yAxis} vs ${xAxis} vs ${zAxis}`,
              },
            ]
            break
          case "surface3d":
            // For surface plots, we need to organize data into a grid
            const uniqueX = [...new Set(xData)].sort((a, b) => a - b)
            const uniqueY = [...new Set(yData)].sort((a, b) => a - b)

            // Create a 2D array for z values
            const zValues = Array(uniqueY.length)
              .fill()
              .map(() => Array(uniqueX.length).fill(0))

            // Fill in z values where we have data
            fileData.forEach((row) => {
              const x = row[xAxis]
              const y = row[yAxis]
              const z = row[zAxis]

              if (isNumericValue(x) && isNumericValue(y) && isNumericValue(z)) {
                const xIndex = uniqueX.indexOf(x)
                const yIndex = uniqueY.indexOf(y)
                if (xIndex >= 0 && yIndex >= 0) {
                  zValues[yIndex][xIndex] = Number.parseFloat(z.toString().replace(/[,$%\s]/g, ""))
                }
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
        switch (selectedChart) {
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
        if (selectedChart !== "pie") {
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
        displayModeBar: false,
      })
      plotlyInstance.current = true
    } catch (error) {
      console.error("Error rendering chart:", error)
    }
  }

  // Handle chart type selection
  const handleChartTypeSelect = (chartType) => {
    setSelectedChart(chartType)

    // Reset z-axis if switching from 3D to 2D chart
    const is3D = chartTypes.find((chart) => chart.id === chartType)?.is3D || false
    if (!is3D) {
      setZAxis("")
    }
  }

  // Handle next step in workflow
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Handle previous step in workflow
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Create chart and close dialog
  const handleCreateChart = () => {
    if (!xAxis || !yAxis) {
      console.error("Please select both X and Y axes.")
      return
    }

    // For 3D charts, ensure z-axis is selected
    const is3D = chartTypes.find((chart) => chart.id === selectedChart)?.is3D || false
    if (is3D && !zAxis) {
      console.error("Please select a Z-axis for 3D chart.")
      return
    }

    // Extract data for chart configuration
    const xData = fileData.map((row) => row[xAxis])
    const yData = fileData.map((row) => {
      const value = row[yAxis]
      return isNumericValue(value) ? Number.parseFloat(value.toString().replace(/[,$%\s]/g, "")) : 0
    })

    // Extract z-axis data for 3D charts
    const zData = zAxis
      ? fileData.map((row) => {
          const value = row[zAxis]
          return isNumericValue(value) ? Number.parseFloat(value.toString().replace(/[,$%\s]/g, "")) : 0
        })
      : []

    const chartConfig = {
      type: selectedChart,
      xAxis,
      yAxis,
      zAxis: zAxis || null,
      chartTitle: chartTitle || `${yAxis} vs ${xAxis}${zAxis ? ` vs ${zAxis}` : ""}`,
      selectedTheme,
      showLegend,
      showGrid,
      xData,
      yData,
      zData,
      fileName,
      is3D,
      createdAt: new Date().toISOString(),
      dataPoints: fileData.length,
    }

    // Generate unique ID and store chart config
    const chartId = `chart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    try {
      // Store chart configuration
      localStorage.setItem(`chartConfig_${chartId}`, JSON.stringify(chartConfig))

      // Store chart metadata for gallery
      const chartMetadata = {
        id: chartId,
        title: chartConfig.chartTitle,
        type: selectedChartType?.name || selectedChart,
        file: fileName,
        created: new Date().toLocaleString(),
        is3D,
        views: 0,
        downloads: 0,
      }

      // Get existing charts and add new one
      const existingCharts = JSON.parse(localStorage.getItem("userCharts") || "[]")
      existingCharts.unshift(chartMetadata)
      localStorage.setItem("userCharts", JSON.stringify(existingCharts))

      onOpenChange(false)

      // Navigate to chart page
      window.location.href = `/chart/${chartId}`
    } catch (error) {
      console.error("Failed to save chart config:", error)
    }
  }

  const selectedChartType = chartTypes.find((chart) => chart.id === selectedChart)
  const is3D = selectedChartType?.is3D || false

  // Get available columns for Y-axis and Z-axis
  const availableYAxisColumns = columns.filter((col) => col.name !== xAxis && col.name !== zAxis)
  const availableZAxisColumns = columns.filter((col) => col.name !== xAxis && col.name !== yAxis)
  const numericYAxisColumns = availableYAxisColumns.filter((col) => col.type === "number")
  const numericZAxisColumns = availableZAxisColumns.filter((col) => col.type === "number")

  // Determine if we can proceed to the next step
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0: // Select Data
        return fileData.length > 0 && columns.length > 0
      case 1: // Choose Chart
        return !!selectedChart
      case 2: // Configure Axes
        return !!xAxis && !!yAxis && (!is3D || !!zAxis)
      case 3: // Style & Theme
        return true
      case 4: // Preview
        return true
      default:
        return false
    }
  }

  if (isProcessing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-black border border-cyan-600">
          <div className="flex flex-col items-center justify-center py-8">
            <FileSpreadsheet className="h-16 w-16 text-cyan-500 animate-pulse mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-cyan-100">Processing Excel File</h3>
            <p className="text-sm text-cyan-300 text-center">Reading and analyzing your data...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] overflow-y-auto bg-black border border-cyan-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-100">
            {is3D ? <Cube className="h-5 w-5" /> : <BarChart3 className="h-5 w-5" />}
            Create {is3D ? "3D " : ""}Chart from {fileName}
          </DialogTitle>
          <DialogDescription className="text-cyan-300">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </DialogDescription>
        </DialogHeader>

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-center mb-6 overflow-x-auto">
          <div className="flex items-center space-x-2 min-w-max">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    index <= currentStep ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-1 text-xs hidden sm:inline ${
                    index <= currentStep ? "text-cyan-400" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-4 h-0.5 mx-2 ${index < currentStep ? "bg-cyan-600" : "bg-gray-700"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* select data */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <Card className="bg-black border border-cyan-800">
              <CardHeader>
                <CardTitle className="text-cyan-100">Data Analysis</CardTitle>
                <CardDescription className="text-cyan-300">
                  We've analyzed your Excel file and found the following data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fileData.length === 0 && (
                    <div className="bg-red-950 border border-red-500 text-red-300 px-4 py-3 rounded-md flex items-start mb-4">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        height="1em"
                        width="1em"
                        className="mr-2 flex-shrink-0"
                      >
                        <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 18a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4-4.5a1 1 0 00-2 0v-4a1 1 0 00-2 0v4a1 1 0 002 0v.5a1.5 1.5 0 013 0v-.5a1 1 0 00-1-1h-1a1 1 0 000 2h1a3.5 3.5 0 00-7 0v-.5a1.5 1.5 0 013 0v.5a1 1 0 001 1h1a1 1 0 000-2h-1a1 1 0 00-1 1v4a1 1 0 002 0v-.5a1.5 1.5 0 01-3 0v.5a1 1 0 001 1h1a1 1 0 000-2h-1a3.5 3.5 0 007 0v.5z"></path>
                      </svg>
                      <div>
                        <h4 className="font-semibold">No Data Available</h4>
                        <p>Please upload a valid Excel file to proceed.</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2 text-cyan-100">File Information</h3>
                      <p className="text-sm text-cyan-300">Filename: {fileName}</p>
                      <p className="text-sm text-cyan-300">Rows: {fileData.length}</p>
                      <p className="text-sm text-cyan-300">Columns: {columns.length}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-cyan-100">Column Types</h3>
                      <p className="text-sm text-cyan-300">
                        Numeric columns: {columns.filter((c) => c.type === "number").length}
                      </p>
                      <p className="text-sm text-cyan-300">
                        Text columns: {columns.filter((c) => c.type === "text").length}
                      </p>
                    </div>
                  </div>

                  {columns.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-white">
                          <thead>
                            <tr className="bg-cyan-950">
                              <th className="px-4 py-2 text-left text-cyan-200">Column Name</th>
                              <th className="px-4 py-2 text-left text-cyan-200">Type</th>
                              <th className="px-4 py-2 text-left text-cyan-200">Sample Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {columns.map((column, index) => (
                              <tr key={index} className={index % 2 === 0 ? "bg-black" : "bg-gray-900"}>
                                <td className="px-4 py-2 border-t border-cyan-800 text-cyan-100">{column.name}</td>
                                <td className="px-4 py-2 border-t border-cyan-800">
                                  <Badge variant="outline" className="border-cyan-500 text-cyan-300">
                                    {column.type}
                                  </Badge>
                                </td>
                                <td className="px-4 py-2 border-t border-cyan-800 text-cyan-200">
                                  {String(column.sample).substring(0, 30)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* choose chart */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <Card className="bg-black border border-cyan-800">
              <CardHeader>
                <CardTitle className="text-cyan-100">Choose Chart Type</CardTitle>
                <CardDescription className="text-cyan-300">
                  Select the visualization that best represents your data
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  {chartTypes.map((chart) => (
                    <Card
                      key={chart.id}
                      className={`cursor-pointer transition-all hover:shadow-md hover:shadow-cyan-500/20 ${
                        selectedChart === chart.id
                          ? "ring-2 ring-cyan-500 bg-cyan-950"
                          : "bg-black border border-cyan-800"
                      }`}
                      onClick={() => handleChartTypeSelect(chart.id)}
                    >
                      <CardContent className="p-2 text-center h-36 flex flex-col items-center justify-center gap-2 rounded-md">
                        <chart.icon
                          className={`h-6 w-6 ${selectedChart === chart.id ? "text-cyan-400" : "text-gray-400"}`}
                        />
                        <h3 className="font-medium text-md leading-tight text-cyan-100">{chart.name}</h3>
                        <p className="text-xs text-cyan-400 line-clamp-2 leading-tight max-w-[90%]">
                          {chart.description}
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          <Badge
                            variant="outline"
                            className="px-1 py-[1px] leading-tight whitespace-normal break-words text-[10px] max-w-[100px] border-cyan-500 text-cyan-300"
                          >
                            {chart.best_for}
                          </Badge>
                          {chart.is3D && (
                            <Badge className="text-[10px] px-1 py-0 bg-cyan-600 leading-tight text-white">3D</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedChartType && (
                  <div className="mt-6 p-4 bg-cyan-950 border border-cyan-600 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <selectedChartType.icon className="h-5 w-5 text-cyan-400" />
                      <h4 className="font-medium text-cyan-100">{selectedChartType.name}</h4>
                    </div>
                    <p className="text-sm text-cyan-200">{selectedChartType.description}</p>
                    <p className="text-xs text-cyan-400 mt-1">Best for: {selectedChartType.best_for}</p>
                    {selectedChartType.is3D && (
                      <p className="text-xs text-cyan-300 mt-1 font-semibold">
                        This is a 3D chart and requires X, Y, and Z axes selection.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ask axes */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <Card className="bg-black border border-cyan-800">
              <CardHeader>
                <CardTitle className="text-cyan-100">Select Chart Axes</CardTitle>
                <CardDescription className="text-cyan-300">
                  Choose which columns from your Excel file to use for {is3D ? "X, Y, and Z axes" : "X and Y axes"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`grid ${is3D ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"} gap-4`}>
                  <div>
                    <Label htmlFor="x-axis" className="text-sm font-medium text-cyan-300">
                      X-Axis (Categories)
                    </Label>
                    <Select value={xAxis} onValueChange={setXAxis}>
                      <SelectTrigger className="mt-1 border-cyan-600 bg-black text-white">
                        <SelectValue placeholder="Select X-axis" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-cyan-600 text-white">
                        {columns
                          .filter((column) => column.name !== yAxis && column.name !== zAxis)
                          .map((column) => (
                            <SelectItem key={column.name} value={column.name}>
                              <div className="flex items-center justify-between w-full">
                                <span className="truncate">{column.name}</span>
                                <Badge variant="outline" className="ml-2 text-xs border-cyan-500 text-cyan-300">
                                  {column.type}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {xAxis && (
                      <p className="text-xs text-cyan-300 mt-1 truncate">
                        Sample: {columns.find((c) => c.name === xAxis)?.sample}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="y-axis" className="text-sm font-medium text-cyan-300">
                      Y-Axis (Values)
                    </Label>
                    <Select value={yAxis} onValueChange={setYAxis}>
                      <SelectTrigger className="mt-1 border-cyan-600 bg-black text-white">
                        <SelectValue placeholder="Select Y-axis" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-cyan-600 text-white">
                        {numericYAxisColumns.length > 0
                          ? numericYAxisColumns.map((column) => (
                              <SelectItem key={column.name} value={column.name}>
                                <div className="flex items-center justify-between w-full">
                                  <span className="truncate">{column.name}</span>
                                  <Badge variant="outline" className="ml-2 text-xs border-cyan-500 text-cyan-300">
                                    {column.type}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))
                          : availableYAxisColumns.map((column) => (
                              <SelectItem key={column.name} value={column.name}>
                                <div className="flex items-center justify-between w-full">
                                  <span className="truncate">{column.name}</span>
                                  <Badge variant="outline" className="ml-2 text-xs border-cyan-500 text-cyan-300">
                                    {column.type}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    {yAxis && (
                      <p className="text-xs text-cyan-300 mt-1 truncate">
                        Sample: {columns.find((c) => c.name === yAxis)?.sample}
                      </p>
                    )}
                  </div>

                  {/* 3d z axis */}
                  {is3D && (
                    <div>
                      <Label htmlFor="z-axis" className="text-sm font-medium text-cyan-300">
                        Z-Axis (Depth)
                      </Label>
                      <Select value={zAxis} onValueChange={setZAxis}>
                        <SelectTrigger className="mt-1 border-cyan-600 bg-black text-white">
                          <SelectValue placeholder="Select Z-axis" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-cyan-600 text-white">
                          {numericZAxisColumns.length > 0
                            ? numericZAxisColumns.map((column) => (
                                <SelectItem key={column.name} value={column.name}>
                                  <div className="flex items-center justify-between w-full">
                                    <span className="truncate">{column.name}</span>
                                    <Badge variant="outline" className="ml-2 text-xs border-cyan-500 text-cyan-300">
                                      {column.type}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))
                            : availableZAxisColumns.map((column) => (
                                <SelectItem key={column.name} value={column.name}>
                                  <div className="flex items-center justify-between w-full">
                                    <span className="truncate">{column.name}</span>
                                    <Badge variant="outline" className="ml-2 text-xs border-cyan-500 text-cyan-300">
                                      {column.type}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                      {zAxis && (
                        <p className="text-xs text-cyan-300 mt-1 truncate">
                          Sample: {columns.find((c) => c.name === zAxis)?.sample}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {xAxis && yAxis && (!is3D || zAxis) && (
                  <div className="p-3 bg-cyan-950 border border-cyan-600 rounded-lg">
                    <h4 className="font-medium text-cyan-200 mb-1 text-sm">Chart Preview</h4>
                    <p className="text-xs text-cyan-300">
                      Your chart will show <strong className="text-cyan-100">{yAxis}</strong> values across different{" "}
                      <strong className="text-cyan-100">{xAxis}</strong>{" "}
                      {is3D && (
                        <>
                          and <strong className="text-cyan-100">{zAxis}</strong>
                        </>
                      )}{" "}
                      categories
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* theme and style */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-black border border-cyan-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-cyan-100">Chart Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="chart-title" className="text-sm text-cyan-300">
                      Chart Title
                    </Label>
                    <Input
                      id="chart-title"
                      value={chartTitle}
                      onChange={(e) => setChartTitle(e.target.value)}
                      placeholder={`${yAxis} vs ${xAxis}${zAxis ? ` vs ${zAxis}` : ""}`}
                      className="mt-1 border-cyan-600 bg-black text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="legend-toggle" className="text-sm text-cyan-300">
                        Show Legend
                      </Label>
                      <Switch id="legend-toggle" checked={showLegend} onCheckedChange={setShowLegend} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="grid-toggle" className="text-sm text-cyan-300">
                        Show Grid Lines
                      </Label>
                      <Switch id="grid-toggle" checked={showGrid} onCheckedChange={setShowGrid} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black border border-cyan-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-cyan-100">
                    <Palette className="h-4 w-4" />
                    Color Theme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {colorThemes.map((theme) => (
                      <div
                        key={theme.name}
                        className={`p-2 border rounded-lg cursor-pointer transition-all ${
                          selectedTheme === theme.name
                            ? "ring-2 ring-cyan-500 bg-cyan-950"
                            : "hover:bg-gray-900 border-cyan-700"
                        }`}
                        onClick={() => setSelectedTheme(theme.name)}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <span className="font-medium text-sm text-cyan-100">{theme.name}</span>
                          <div className="flex gap-1">
                            {theme.colors.slice(0, 4).map((color, index) => (
                              <div
                                key={index}
                                className="w-3 h-3 rounded-full border border-cyan-600"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* preview */}
        {currentStep === 4 && (
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-cyan-950 rounded-lg">
                <div>
                  <p className="text-xs text-cyan-400">Chart Type</p>
                  <p className="font-medium text-sm truncate text-cyan-100">
                    {selectedChartType?.name || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-cyan-400">X-Axis</p>
                  <p className="font-medium text-sm truncate text-cyan-100">{xAxis || "Not selected"}</p>
                </div>
                <div>
                  <p className="text-xs text-cyan-400">Y-Axis</p>
                  <p className="font-medium text-sm truncate text-cyan-100">{yAxis || "Not selected"}</p>
                </div>
                {is3D ? (
                  <div>
                    <p className="text-xs text-cyan-400">Z-Axis</p>
                    <p className="font-medium text-sm truncate text-cyan-100">{zAxis || "Not selected"}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-cyan-400">Theme</p>
                    <p className="font-medium text-sm truncate text-cyan-100">{selectedTheme}</p>
                  </div>
                )}
              </div>

              <div className="h-80 bg-white rounded-lg flex items-center justify-center p-4 border">
                {selectedChart && xAxis && yAxis && (!is3D || zAxis) && fileData.length > 0 ? (
                  <div id="plotly-chart" ref={chartRef} className="w-full h-full"></div>
                ) : (
                  <div className="text-center text-cyan-400">
                    {is3D ? (
                      <Cube className="h-12 w-12 mx-auto mb-3 text-cyan-500" />
                    ) : (
                      <BarChart3 className="h-12 w-12 mx-auto mb-3 text-cyan-500" />
                    )}
                    <p className="text-sm">Complete the configuration to see the preview</p>
                    {!selectedChart && <p className="text-xs mt-1">Select a chart type</p>}
                    {(!xAxis || !yAxis) && <p className="text-xs mt-1">Select X and Y axes</p>}
                    {is3D && !zAxis && <p className="text-xs mt-1">Select Z axis for 3D chart</p>}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )}

        <div className="flex justify-between pt-4 border-t">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              onClick={handlePrevStep}
              className="flex items-center gap-2 border-cyan-500 text-cyan-400 hover:bg-cyan-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-950"
            >
              Cancel
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNextStep}
              disabled={!canProceedToNextStep()}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleCreateChart}
              disabled={!selectedChart || !xAxis || !yAxis || (is3D && !zAxis)}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Check className="h-4 w-4" />
              Create Chart
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
