"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, FileSpreadsheet, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { UploadDialog } from "@/components/upload-dialog"
import { FileAnalysisInlineView } from "@/components/file-analysis"
import Iridescence from "@/components/ui/iridescence"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [recentUploadedFile, setRecentUploadedFile] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [originalFiles, setOriginalFiles] = useState({}) // Store original file objects

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = (files) => {
    const excelFiles = files.filter(
      (file) =>
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls"),
    )

    const newFiles = excelFiles.map((file, index) => {
      const id = Date.now() + index

      // Store the original file object
      setOriginalFiles((prev) => ({
        ...prev,
        [id]: file,
      }))

      return {
        id,
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        status: "pending",
      }
    })

    setSelectedFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (id) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id))

    // Also remove from originalFiles
    setOriginalFiles((prev) => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
  }

  const uploadFiles = async () => {
    for (const file of selectedFiles) {
      if (file.status === "pending") {
        setUploadProgress((prev) => ({ ...prev, [file.id]: 0 }))
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const currentProgress = prev[file.id] || 0
            if (currentProgress >= 100) {
              clearInterval(interval)
              const uploaded = {
                id: file.id,
                name: file.name,
                size: file.size,
                status: "completed",
                uploadTime: new Date().toLocaleString(),
                charts: 0,
                originalFile: originalFiles[file.id], // Include reference to original file
              }
              setUploadedFiles((prevUploaded) => [...prevUploaded, uploaded])
              setSelectedFiles((prevSelected) => prevSelected.filter((f) => f.id !== file.id))
              setRecentUploadedFile(uploaded)
              setShowAnalysis(true)
              return { ...prev, [file.id]: 100 }
            }
            return { ...prev, [file.id]: currentProgress + 10 }
          })
        }, 200)
      }
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        className: "bg-emerald-900 text-emerald-300 border-emerald-600",
        icon: CheckCircle,
      },
      processing: {
        className: "bg-yellow-900 text-yellow-300 border-yellow-600",
        icon: Clock,
      },
      error: {
        className: "bg-red-900 text-red-300 border-red-600",
        icon: AlertCircle,
      },
      pending: {
        className: "bg-slate-800 text-slate-300 border-slate-600",
        icon: Clock,
      },
    }

    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0a0f1c] overflow-hidden text-white relative">
      <div className="absolute inset-0 z-0 opacity-20 h-full">
        <Iridescence />
      </div>
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 relative z-10">
        <main className="flex-1 p-6 space-y-6">
          <div className="text-center mt-8 space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent">
              Upload Files
            </h1>
            <p className="text-slate-400">Transform your Excel data into beautiful visualizations</p>
          </div>

          {/* Dropzone */}
          <Card className="bg-transparent border border-blue-900/50 shadow-xl backdrop-blur-3xl">
            <CardHeader>
              <CardTitle className="text-blue-100 flex gap-2 items-center text-xl">
                <FileSpreadsheet className="w-5 h-5" />
                Upload Excel Files
              </CardTitle>
              <CardDescription className="text-slate-400">
                Drag and drop your .xlsx or .xls files here, or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-400 bg-blue-900/20 scale-105"
                    : "border-slate-600 bg-slate-800 hover:border-blue-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-blue-300" />
                  </div>
                  <p className="text-xl font-semibold text-white">Drop your files here</p>
                  <p className="text-sm text-slate-400">Supports .xlsx and .xls files up to 50MB each</p>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xls,.xlsx"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    className="border-blue-400 text-blue-300 hover:bg-blue-900 hover:text-blue-100"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <Card className="bg-[#1c2a44] border border-blue-900/40 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-blue-300 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  Selected Files ({selectedFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedFiles.map((file) => (
                  <div key={file.id} className="bg-slate-800/60 border border-slate-600 p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-teal-800 rounded-lg flex items-center justify-center">
                          <FileSpreadsheet className="h-6 w-6 text-blue-300" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{file.name}</p>
                          <p className="text-sm text-slate-400">{file.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(file.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-red-400 hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {uploadProgress[file.id] !== undefined && (
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Uploading...</span>
                          <span className="text-blue-400">{uploadProgress[file.id]}%</span>
                        </div>
                        <Progress value={uploadProgress[file.id]} className="h-2 bg-slate-700" />
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFiles([])
                      setOriginalFiles({})
                    }}
                    className="border-slate-600 text-slate-300"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={uploadFiles}
                    disabled={selectedFiles.length === 0}
                    className="bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:from-blue-600 hover:to-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? "s" : ""}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {recentUploadedFile && showAnalysis && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <FileAnalysisInlineView file={recentUploadedFile} onClose={() => setShowAnalysis(false)} />
            </div>
          )}
        </main>
      </div>

      {/* Upload Dialog Component */}
      <UploadDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        onUploadSuccess={(file) => {
          const fileData = {
            id: Date.now(),
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            status: "completed",
            uploadTime: new Date().toLocaleString(),
            charts: 0,
            originalFile: file, // Include the original file
          }
          setUploadedFiles((prev) => [...prev, fileData])
          setRecentUploadedFile(fileData)
          setShowAnalysis(true)
        }}
      />
    </div>
  )
}
