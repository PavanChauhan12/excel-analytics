"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useNavigate } from "react-router-dom"
import {
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  TrendingUp,
  Palette,
  Eye,
  FileSpreadsheet,
} from "lucide-react"
import * as XLSX from "xlsx"
import { Chart } from "chart.js/auto"
import toast from "react-hot-toast"

// Define chart types for selection
const chartTypes = [
  {
    id: "bar",
    name: "Bar Chart",
    icon: BarChart3,
    description: "Compare values across categories",
    best_for: "Categorical data comparison",
  },
  {
    id: "line",
    name: "Line Chart",
    icon: LineChart,
    description: "Show trends over time",
    best_for: "Time series data",
  },
  {
    id: "pie",
    name: "Pie Chart",
    icon: PieChart,
    description: "Show parts of a whole",
    best_for: "Percentage breakdown",
  },
  {
    id: "area",
    name: "Area Chart",
    icon: AreaChart,
    description: "Show cumulative values over time",
    best_for: "Stacked data visualization",
  },
  {
    id: "scatter",
    name: "Scatter Plot",
    icon: ScatterChart,
    description: "Show correlation between variables",
    best_for: "Relationship analysis",
  },
]

// Define color themes for chart customization
const colorThemes = [
  { name: "Default", colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"] },
  { name: "Ocean", colors: ["#0ea5e9", "#06b6d4", "#0891b2", "#0e7490", "#155e75"] },
  { name: "Forest", colors: ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"] },
  { name: "Sunset", colors: ["#f59e0b", "#f97316", "#ef4444", "#dc2626", "#b91c1c"] },
  { name: "Purple", colors: ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"] },
  { name: "Yellow", colors: ["#f1c40f", "#f39c12", "#e67e22", "#d35400", "#c0392b"] },
]

export function ChartCreationDialog({ open, onOpenChange, selectedFile }) {
  const navigate = useNavigate()
  const [fileData, setFileData] = useState([])
  const [columns, setColumns] = useState([])
  const [selectedChart, setSelectedChart] = useState("line") // Default to line chart
  const [xAxis, setXAxis] = useState("")
  const [yAxis, setYAxis] = useState("")
  const [chartTitle, setChartTitle] = useState("")
  const [selectedTheme, setSelectedTheme] = useState("Default")
  const [showLegend, setShowLegend] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [fileName, setFileName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  // Process the selected file when component mounts or file changes
  useEffect(() => {
    if (selectedFile && open) {
      processExcelFile(selectedFile)
    }
  }, [selectedFile, open])

  // Effect hook to re-render the preview chart
  useEffect(() => {
    if (fileData.length > 0 && xAxis && yAxis && selectedChart) {
      renderPreviewChart()
    }
  }, [fileData, xAxis, yAxis, selectedChart, selectedTheme, showLegend, showGrid])

  // Improved function to detect if a value can be treated as a number
  const isNumericValue = (value) => {
    if (value === null || value === undefined || value === "") return false
    if (typeof value === "number") return !isNaN(value)
    if (typeof value === "string") {
      // Remove common formatting characters and check if it's a valid number
      const cleanValue = value.toString().replace(/[,$%\s]/g, "")
      return !isNaN(cleanValue) && !isNaN(Number.parseFloat(cleanValue)) && cleanValue !== ""
    }
    return false
  }

  // Improved function to detect column type based on multiple samples
  const detectColumnType = (columnName, data) => {
    const samples = data.slice(0, Math.min(10, data.length)) // Check first 10 rows
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

    // If more than 70% of non-empty values are numeric, consider it a number column
    return totalCount > 0 && numericCount / totalCount > 0.7 ? "number" : "text"
  }

  // Process the Excel file using the logic from the original HTML
  const processExcelFile = (file) => {
    setIsProcessing(true)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        // Use the same logic as the original HTML file
        const workbook = XLSX.read(event.target.result, { type: "binary" })
        const firstSheet = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheet]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        if (jsonData.length === 0) {
          toast.error("No data found in the Excel sheet.")
          setIsProcessing(false)
          return
        }

        setFileData(jsonData)

        // Get headers and populate dropdowns with improved type detection
        const headers = Object.keys(jsonData[0])
        const columnsWithTypes = headers.map((header) => {
          const sampleValue = jsonData[0][header]
          const detectedType = detectColumnType(header, jsonData)

          return {
            name: header,
            type: detectedType,
            sample: sampleValue,
          }
        })

        console.log("Detected columns:", columnsWithTypes) // Debug log
        setColumns(columnsWithTypes)
        setIsProcessing(false)
      } catch (error) {
        console.error("Error processing Excel file:", error)
        alert("Error processing Excel file. Please check the file format.")
        setIsProcessing(false)
      }
    }

    reader.readAsBinaryString(file)
  }

  // Render preview chart using Chart.js logic from the original HTML
  const renderPreviewChart = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    if (!chartRef.current || !selectedChart) return

    const ctx = chartRef.current.getContext("2d")

    // Extract data using the same logic as the original HTML
    const xData = fileData.map((row) => row[xAxis])
    const yData = fileData
      .map((row) => {
        const value = row[yAxis]
        if (isNumericValue(value)) {
          return Number.parseFloat(value.toString().replace(/[,$%\s]/g, ""))
        }
        return 0
      })
      .filter((val) => !isNaN(val))

    if (xData.length === 0 || yData.length === 0) return

    const themeColors = colorThemes.find((t) => t.name === selectedTheme)?.colors || colorThemes[0].colors

    // Use the same Chart.js configuration as the original HTML with enhancements
    const config = {
      type: selectedChart === "pie" ? "pie" : selectedChart === "area" ? "line" : selectedChart,
      data: {
        labels: selectedChart === "scatter" ? [] : xData,
        datasets: [
          {
            label: `${yAxis} vs ${xAxis}`,
            data: selectedChart === "scatter" ? xData.map((x, i) => ({ x: x, y: yData[i] })) : yData,
            borderColor: themeColors[0],
            backgroundColor:
              selectedChart === "line"
                ? "transparent"
                : selectedChart === "area"
                  ? `${themeColors[0]}33`
                  : selectedChart === "pie"
                    ? themeColors
                    : themeColors[0],
            fill: selectedChart === "area",
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: chartTitle || `${yAxis} vs ${xAxis}`,
          },
          legend: {
            display: showLegend,
          },
        },
        scales:
          selectedChart === "pie"
            ? {}
            : {
                x: {
                  title: {
                    display: true,
                    text: xAxis,
                  },
                  grid: {
                    display: showGrid,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: yAxis,
                  },
                  beginAtZero: true,
                  grid: {
                    display: showGrid,
                  },
                },
              },
      },
    }

    chartInstance.current = new Chart(ctx, config)
  }

  // Handle chart type selection (just update state, don't navigate)
  const handleChartTypeSelect = (chartType) => {
    setSelectedChart(chartType)
  }

  // Create chart and navigate to /chart route
  const handleCreateChart = () => {
    if (!xAxis || !yAxis) {
      alert("Please select both X and Y axes.")
      return
    }

    // Prepare chart data using the same logic as the original HTML
    const xData = fileData.map((row) => row[xAxis])
    const yData = fileData
      .map((row) => {
        const value = row[yAxis]
        if (isNumericValue(value)) {
          return Number.parseFloat(value.toString().replace(/[,$%\s]/g, ""))
        }
        return 0
      })
      .filter((val) => !isNaN(val))

    const chartConfig = {
      type: selectedChart,
      xAxis,
      yAxis,
      chartTitle: chartTitle || `${yAxis} vs ${xAxis}`,
      selectedTheme,
      showLegend,
      showGrid,
      xData,
      yData,
      fileName,
    }

    // Generate unique ID and store chart config
    const chartId = `chart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    try {
      localStorage.setItem(`chartConfig_${chartId}`, JSON.stringify(chartConfig))

      // Navigate to chart page
      navigate(`/chart/${chartId}`)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save chart config:", error)
      alert("Failed to create chart. Please try again.")
    }
  }

  const selectedChartType = chartTypes.find((chart) => chart.id === selectedChart)

  // Get available columns for Y-axis (numeric columns that aren't selected for X-axis)
  const availableYAxisColumns = columns.filter((col) => col.name !== xAxis)
  const numericYAxisColumns = availableYAxisColumns.filter((col) => col.type === "number")

  if (isProcessing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <FileSpreadsheet className="h-16 w-16 text-blue-500 animate-pulse mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processing Excel File</h3>
            <p className="text-sm text-gray-600 text-center">Reading and analyzing your data...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Create Chart from {fileName}
          </DialogTitle>
          <DialogDescription>Configure your chart settings and preview before creating</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="axes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="axes">Select Axes</TabsTrigger>
            <TabsTrigger value="chart">Chart Type</TabsTrigger>
            <TabsTrigger value="theme">Theme & Style</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Axes Selection Tab */}
          <TabsContent value="axes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Chart Axes</CardTitle>
                <CardDescription>Choose which columns from your Excel file to use for X and Y axes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="x-axis" className="text-base font-medium">
                      X-Axis (Categories)
                    </Label>
                    <Select value={xAxis} onValueChange={setXAxis}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select X-axis column" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns
                          .filter((column) => column.name !== yAxis) // Filter out Y-axis selection
                          .map((column) => (
                            <SelectItem key={column.name} value={column.name}>
                              <div className="flex items-center justify-between w-full">
                                <span>{column.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {column.type}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {xAxis && (
                      <p className="text-sm text-gray-600 mt-1">
                        Sample: {columns.find((c) => c.name === xAxis)?.sample}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="y-axis" className="text-base font-medium">
                      Y-Axis (Values)
                    </Label>
                    <Select value={yAxis} onValueChange={setYAxis}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select Y-axis column" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Show numeric columns first, then all available columns if no numeric found */}
                        {numericYAxisColumns.length > 0
                          ? numericYAxisColumns.map((column) => (
                              <SelectItem key={column.name} value={column.name}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{column.name}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {column.type}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))
                          : // Fallback: show all columns except X-axis if no numeric columns detected
                            availableYAxisColumns.map((column) => (
                              <SelectItem key={column.name} value={column.name}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{column.name}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {column.type}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    {yAxis && (
                      <p className="text-sm text-gray-600 mt-1">
                        Sample: {columns.find((c) => c.name === yAxis)?.sample}
                      </p>
                    )}
                    {numericYAxisColumns.length === 0 && availableYAxisColumns.length > 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        ⚠️ No numeric columns detected. All columns are shown, but charts work best with numeric Y-axis
                        data.
                      </p>
                    )}
                  </div>
                </div>

                {xAxis && yAxis && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-1">Chart Preview</h4>
                    <p className="text-sm text-green-700">
                      Your chart will show <strong>{yAxis}</strong> values across different <strong>{xAxis}</strong>{" "}
                      categories
                    </p>
                  </div>
                )}

                {/* Debug information */}
                {columns.length > 0 && (
                  <div className="p-3 bg-gray-50 border rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Column Analysis</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Total columns: {columns.length}</p>
                      <p>Numeric columns: {columns.filter((c) => c.type === "number").length}</p>
                      <p>Text columns: {columns.filter((c) => c.type === "text").length}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chart Type Tab */}
          <TabsContent value="chart" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Choose Chart Type</CardTitle>
                <CardDescription>Select the visualization that best represents your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chartTypes.map((chart) => (
                    <Card
                      key={chart.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedChart === chart.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => handleChartTypeSelect(chart.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <chart.icon
                          className={`h-8 w-8 mx-auto mb-2 ${
                            selectedChart === chart.id ? "text-blue-600" : "text-gray-600"
                          }`}
                        />
                        <h3 className="font-medium">{chart.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{chart.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {chart.best_for}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedChartType && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <selectedChartType.icon className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">{selectedChartType.name}</h4>
                    </div>
                    <p className="text-sm text-blue-800">{selectedChartType.description}</p>
                    <p className="text-xs text-blue-600 mt-1">Best for: {selectedChartType.best_for}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme & Style Tab */}
          <TabsContent value="theme" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chart Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="chart-title">Chart Title</Label>
                    <Input
                      id="chart-title"
                      value={chartTitle}
                      onChange={(e) => setChartTitle(e.target.value)}
                      placeholder={`${yAxis} vs ${xAxis}`}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="legend-toggle">Show Legend</Label>
                    <Switch id="legend-toggle" checked={showLegend} onCheckedChange={setShowLegend} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid-toggle">Show Grid Lines</Label>
                    <Switch id="grid-toggle" checked={showGrid} onCheckedChange={setShowGrid} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color Theme
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {colorThemes.map((theme) => (
                      <div
                        key={theme.name}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedTheme === theme.name ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedTheme(theme.name)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{theme.name}</span>
                          <div className="flex gap-1">
                            {theme.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border"
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
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Chart Preview
                </CardTitle>
                <CardDescription>Preview your chart before creating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Chart Type</p>
                      <p className="font-medium text-sm">{selectedChartType?.name || "Not selected"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">X-Axis</p>
                      <p className="font-medium text-sm">{xAxis || "Not selected"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Y-Axis</p>
                      <p className="font-medium text-sm">{yAxis || "Not selected"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Theme</p>
                      <p className="font-medium text-sm">{selectedTheme}</p>
                    </div>
                  </div>

                  <div className="h-96 bg-white rounded-lg flex items-center justify-center p-4 border">
                    {selectedChart && xAxis && yAxis && fileData.length > 0 ? (
                      <canvas ref={chartRef}></canvas>
                    ) : (
                      <div className="text-center text-gray-500">
                        <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                        <p>Complete the configuration to see the preview</p>
                        {!selectedChart && <p className="text-sm mt-1">Select a chart type</p>}
                        {(!xAxis || !yAxis) && <p className="text-sm mt-1">Select X and Y axes</p>}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateChart}
            disabled={!selectedChart || !xAxis || !yAxis}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Create Chart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
