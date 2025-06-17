"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Send,
  Sparkles,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  Bot,
  X,
  Shield,
} from "lucide-react"
import * as XLSX from "xlsx"
import { AdminSidebar } from "@/components/admin-sidebar"
import Aurora from "@/components/ui/aurora"

export default function AdminAIInsightsPage() {
  const navigate = useNavigate()
  const chartRef = useRef(null)
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [fileData, setFileData] = useState(null)
  const [parsedData, setParsedData] = useState([])
  const [dataSample, setDataSample] = useState([])
  const [dataAnalysis, setDataAnalysis] = useState(null)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello Administrator! Upload an Excel file, and I'll provide advanced AI analysis and insights with full admin privileges.",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [showDataPreview, setShowDataPreview] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [useAI, setUseAI] = useState(true)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "admin") {
      navigate("/dashboard")
      return
    }
  }, [navigate])

  // Sample admin insights
  const sampleAdminInsights = [
    {
      title: "System-wide Data Trends",
      description:
        "Across all users, Excel uploads have increased 45% this month, with financial data being the most common category.",
      chartType: "line",
      confidence: 0.95,
    },
    {
      title: "User Engagement Analytics",
      description:
        "Power users create 3x more charts than average users, with bar charts being the preferred visualization type (68%).",
      chartType: "bar",
      confidence: 0.92,
    },
    {
      title: "Platform Performance Insights",
      description: "Peak usage occurs between 9-11 AM and 2-4 PM. Consider scaling resources during these periods.",
      chartType: "area",
      confidence: 0.88,
    },
  ]

  useEffect(() => {
    setInsights(sampleAdminInsights)
  }, [])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: "array" })

          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]

          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          if (jsonData.length < 2) {
            resolve({ data: [], headers: [] })
            return
          }

          const headers = jsonData[0]
          const rows = jsonData.slice(1)

          const formattedData = rows.map((row) => {
            const obj = {}
            headers.forEach((header, index) => {
              obj[header] = row[index]
            })
            return obj
          })

          resolve({
            data: formattedData,
            headers,
            sheetNames: workbook.SheetNames,
            activeSheet: firstSheetName,
          })
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  }

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setAnalyzing(true)

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `[ADMIN] I've uploaded ${selectedFile.name} for advanced analysis.`,
      },
    ])

    try {
      const { data, headers, sheetNames, activeSheet } = await parseExcelFile(selectedFile)

      setParsedData(data)
      setDataSample(data.slice(0, 5))

      const fileInfo = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: new Date(selectedFile.lastModified).toLocaleString(),
        rowCount: data.length,
        columnCount: headers.length,
        headers,
        sheetNames,
        activeSheet,
      }
      setFileData(fileInfo)

      // Admin-specific analysis
      const adminAnalysis = {
        recommendation: "multi-dimensional",
        reason:
          "As an administrator, you have access to advanced analytics including cross-user comparisons, system performance metrics, and predictive insights.",
        analysis: {
          rowCount: data.length,
          columnCount: headers.length,
          headers,
          adminPrivileges: true,
          systemWideAccess: true,
        },
      }

      setDataAnalysis(adminAnalysis)

      const responseMessage = `[ADMIN ANALYSIS] I've analyzed "${selectedFile.name}" with administrative privileges.\n\n**File Details:**\n- ${data.length} rows, ${headers.length} columns\n- Admin access level: FULL\n- System integration: ENABLED\n\n**Advanced Capabilities Available:**\n- Cross-user data comparison\n- System performance correlation\n- Predictive analytics\n- Security audit trails\n\nAs an administrator, you can access enhanced AI features and system-wide insights.`

      setAnalyzing(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responseMessage,
        },
      ])
    } catch (error) {
      console.error("Error processing Excel file:", error)
      setAnalyzing(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I encountered an error while processing ${selectedFile.name}. As an admin, please check the file format and try again.`,
        },
      ])
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = { role: "user", content: `[ADMIN] ${inputMessage}` }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    setAnalyzing(true)

    // Admin-specific responses
    let aiResponse = ""
    const userMessageLower = inputMessage.toLowerCase()

    if (userMessageLower.includes("system") || userMessageLower.includes("admin")) {
      aiResponse =
        "As an administrator, you have access to system-wide analytics, user management insights, and advanced security features. I can help you analyze platform usage patterns, identify power users, and optimize system performance."
    } else if (userMessageLower.includes("users") || userMessageLower.includes("analytics")) {
      aiResponse =
        "I can provide insights on user behavior patterns, file upload trends, chart creation statistics, and platform engagement metrics. Would you like me to analyze specific user segments or overall platform performance?"
    } else if (userMessageLower.includes("security") || userMessageLower.includes("audit")) {
      aiResponse =
        "I can help with security audits, access pattern analysis, and identifying unusual activity. As an admin, you can request detailed logs and compliance reports."
    } else {
      aiResponse =
        "As your AI assistant with admin privileges, I can provide advanced analytics, system insights, and administrative recommendations. How can I help you manage the platform more effectively?"
    }

    setAnalyzing(false)
    setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
  }

  const generateNewInsights = async () => {
    setLoading(true)

    // Simulate admin-level insight generation
    setTimeout(() => {
      const newAdminInsights = [
        {
          title: "Cross-Platform Data Integration",
          description: "Detected opportunities to integrate with 3 external data sources used by your top users.",
          chartType: "network",
          confidence: 0.91,
        },
        {
          title: "Resource Optimization",
          description:
            "Server load can be reduced by 23% by implementing smart caching for frequently accessed charts.",
          chartType: "gauge",
          confidence: 0.87,
        },
        {
          title: "User Retention Patterns",
          description: "Users who create charts within 48 hours of signup have 4x higher retention rates.",
          chartType: "funnel",
          confidence: 0.94,
        },
      ]

      setInsights(newAdminInsights)
      setLoading(false)
    }, 2000)
  }

  const getChartIcon = (chartType) => {
    switch (chartType) {
      case "bar":
        return <BarChart3 className="h-5 w-5" />
      case "line":
        return <LineChart className="h-5 w-5" />
      case "pie":
        return <PieChart className="h-5 w-5" />
      case "area":
      case "network":
      case "gauge":
      case "funnel":
        return <TrendingUp className="h-5 w-5" />
      default:
        return <TrendingUp className="h-5 w-5" />
    }
  }

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh" }} className="flex">
      <AdminSidebar />
      <div className="absolute inset-0 z-0 opacity-40">
        <Aurora colorStops={["#ff0038", "#ff4d00", "#330022"]} amplitude={0.8} blend={1} />
      </div>
      <div className="absolute inset-0 z-0 opacity-40 scale-y-[-1]">
        <Aurora colorStops={["#ff0038", "#ff4d00", "#330022"]} amplitude={0.8} blend={1} />
      </div>
      <div className="container mx-auto py-10 px-4 z-10">
        <Tabs defaultValue="assistant" className="w-full">
          <TabsList
            className="grid w-full grid-cols-2 gap-4"
            style={{ backgroundColor: "transparent", borderColor: "#ff4d00" }}
          >
            <TabsTrigger
              value="assistant"
              className="data-[state=active]:bg-transparent text-red-400 border border-transparent data-[state=active]:border-red-500"
            >
              <Bot className="h-4 w-4 mr-2" />
              Admin AI Assistant
            </TabsTrigger>

            <TabsTrigger
              value="insights"
              className="data-[state=active]:bg-transparent text-red-400 border border-transparent data-[state=active]:border-red-500"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              System Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <Card
              style={{
                backgroundColor: "transparent",
                borderColor: "#ff4d00",
                boxShadow: "0 0 10px rgba(255, 77, 0, 0.3)",
              }}
            >
              <CardHeader>
                <CardTitle
                  style={{
                    color: "#ff4444",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Shield className="h-5 w-5" />
                  Administrative Insights & Analytics
                </CardTitle>
                <CardDescription style={{ color: "rgba(255, 77, 0, 0.7)" }}>
                  {fileData
                    ? `Admin analysis of "${fileData.name}" with system-wide context`
                    : "Advanced AI-powered insights with administrative privileges"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fileData && dataSample.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 style={{ color: "#ff4444" }}>Data Preview (Admin View)</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDataPreview(!showDataPreview)}
                        style={{ borderColor: "#ff4d00", color: "#ff4444" }}
                      >
                        {showDataPreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                    </div>

                    {showDataPreview && (
                      <div
                        className="overflow-x-auto"
                        style={{
                          backgroundColor: "rgba(26, 26, 26, 0.8)",
                          border: "1px solid rgba(255, 77, 0, 0.3)",
                          borderRadius: "0.5rem",
                          padding: "0.5rem",
                        }}
                      >
                        <table className="w-full">
                          <thead>
                            <tr>
                              {fileData.headers.map((header, index) => (
                                <th
                                  key={index}
                                  className="px-2 py-1 text-left text-xs"
                                  style={{
                                    color: "#ff4444",
                                    borderBottom: "1px solid rgba(255, 77, 0, 0.3)",
                                  }}
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataSample.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {fileData.headers.map((header, colIndex) => (
                                  <td
                                    key={colIndex}
                                    className="px-2 py-1 text-xs"
                                    style={{
                                      color: "#ffffff",
                                      borderBottom: "1px solid rgba(26, 26, 26, 0.5)",
                                    }}
                                  >
                                    {row[header] !== undefined ? String(row[header]) : ""}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-4">
                  {loading ? (
                    <div className="flex justify-center items-center py-10">
                      <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2"
                        style={{ borderColor: "#ff4444" }}
                      ></div>
                    </div>
                  ) : (
                    insights.map((insight, index) => (
                      <Card
                        key={index}
                        style={{
                          backgroundColor: "rgba(26, 26, 26, 0.8)",
                          borderColor: "#ff4d00",
                          transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        className="hover:shadow-lg hover:-translate-y-1"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#ff4444" }}>
                            {getChartIcon(insight.chartType)}
                            {insight.title}
                          </CardTitle>
                          <CardDescription style={{ color: "rgba(255, 77, 0, 0.7)" }}>
                            Admin insight: <span style={{ color: "#ff4444" }}>{insight.chartType} analysis</span>
                            <span
                              className="ml-2 px-2 py-0.5 rounded text-xs"
                              style={{
                                backgroundColor: "rgba(255, 68, 68, 0.2)",
                                color: "#ff4444",
                                border: "1px solid rgba(255, 68, 68, 0.3)",
                              }}
                            >
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p style={{ color: "#ffffff" }}>{insight.description}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={generateNewInsights}
                  disabled={loading}
                  style={{
                    backgroundColor: "#ff4d00",
                    color: "#000000",
                    boxShadow: "0 0 10px rgba(255, 77, 0, 0.5)",
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Admin Insights
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="assistant">
            <Card
              style={{
                backgroundColor: "transparent",
                borderColor: "#ff4d00",
                boxShadow: "0 0 10px rgba(255, 77, 0, 0.3)",
              }}
            >
              <CardHeader>
                <CardTitle
                  style={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  className="text-xl"
                >
                  <Shield className="h-5 w-5" />
                  Admin AI Assistant
                </CardTitle>
                <CardDescription style={{ color: "rgba(255, 77, 0, 0.7)" }} className="text-md">
                  Advanced AI assistant with administrative privileges and system-wide access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="flex flex-col h-[400px] overflow-hidden"
                  style={{
                    border: "1px solid rgba(255, 77, 0, 0.3)",
                    borderRadius: "0.5rem",
                    backgroundColor: "transparent",
                  }}
                >
                  <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === "assistant" ? "rounded-tl-none" : "rounded-tr-none"
                          }`}
                          style={{
                            backgroundColor:
                              message.role === "assistant" ? "rgba(255, 77, 0, 0.2)" : "rgba(255, 68, 68, 0.2)",
                            borderColor: message.role === "assistant" ? "#ff4d00" : "#ff4444",
                            borderWidth: "1px",
                            color: message.role === "assistant" ? "#ff4d00" : "#ff4444",
                          }}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {analyzing && (
                      <div className="mb-4 flex justify-start">
                        <div
                          className="max-w-[80%] rounded-lg rounded-tl-none px-4 py-2"
                          style={{
                            backgroundColor: "rgba(255, 77, 0, 0.2)",
                            borderColor: "#ff4d00",
                            borderWidth: "1px",
                            color: "#ff4d00",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="animate-pulse">Analyzing with admin privileges</div>
                            <div className="flex space-x-1">
                              <div
                                className="h-2 w-2 rounded-full bg-current animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="h-2 w-2 rounded-full bg-current animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></div>
                              <div
                                className="h-2 w-2 rounded-full bg-current animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-3 border-t" style={{ borderColor: "rgba(255, 77, 0, 0.3)" }}>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          borderColor: "#ff4d00",
                          color: "#ff4444",
                          backgroundColor: "black",
                        }}
                      >
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Upload admin file</span>
                      </Button>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <Input
                        placeholder="Ask about system analytics, user management, or data insights..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        style={{
                          backgroundColor: "rgba(26, 26, 26, 0.8)",
                          borderColor: "#ff4d00",
                        }}
                        className="text-red-200"
                      />
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() && !analyzing}
                        style={{
                          backgroundColor: "#ff4d00",
                          color: "#000000",
                        }}
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div style={{ color: "rgba(255, 77, 0, 0.7)" }}>
                  {file && (
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>[ADMIN] {file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => {
                          setFile(null)
                          setParsedData([])
                          setDataSample([])
                          setFileData(null)
                        }}
                        style={{ color: "#ff4444" }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
