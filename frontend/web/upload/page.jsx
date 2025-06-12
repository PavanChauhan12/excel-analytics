"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, FileSpreadsheet, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { UploadDialog } from "@/components/upload-dialog"
import { FileAnalysisInlineView } from "@/components/file-analysis"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [recentUploadedFile, setRecentUploadedFile] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false) // NEW

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

    const newFiles = excelFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      status: "pending",
      description: "",
    }))

    setSelectedFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (id) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const updateFileDescription = (id, description) => {
    setSelectedFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, description } : file))
    )
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
              }
              setUploadedFiles((prevUploaded) => [...prevUploaded, uploaded])
              setSelectedFiles((prevSelected) => prevSelected.filter((f) => f.id !== file.id))
              setRecentUploadedFile(uploaded)
              setShowAnalysis(true) // SHOW ANALYSIS AFTER UPLOAD
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
        variant: "default",
        className: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200",
        icon: CheckCircle,
      },
      processing: {
        variant: "secondary",
        className: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200",
        icon: Clock,
      },
      error: {
        variant: "destructive",
        className: "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border-rose-200",
        icon: AlertCircle,
      },
      pending: {
        variant: "outline",
        className: "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200",
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
    <div className="flex min-h-screen  bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex flex-col flex-1  ">
        <main className="flex-1 p-6 space-y-6 ">
          {/* Header */}
          
            <div className="space-y-1 items-center justify-center text-center mt-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                Upload Files
              </h1>
              <p className="text-slate-600">Transform your Excel data into beautiful visualizations</p>
            </div>
            
          

          {/* Dropzone */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm">
            <CardHeader className="rounded-t-lg">
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                Upload Excel Files
              </CardTitle>
              <CardDescription className="text-slate-600">
                Drag and drop your .xlsx or .xls files here, or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 scale-105"
                    : "border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50/30 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-blue-50/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-slate-800 mb-2">Drop your files here</p>
                    <p className="text-slate-500 mb-4">Supports .xlsx and .xls files up to 50MB each</p>
                  </div>
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
                    className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/50">
              <CardHeader className="rounded-t-lg">
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                  Selected Files ({selectedFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {selectedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border border-slate-200 bg-gradient-to-r from-white to-slate-50/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-lg flex items-center justify-center">
                            <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{file.name}</p>
                            <p className="text-sm text-slate-500">{file.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(file.status)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {uploadProgress[file.id] !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Uploading...</span>
                            <span className="text-blue-600 font-medium">{uploadProgress[file.id]}%</span>
                          </div>
                          <Progress value={uploadProgress[file.id]} className="h-2 bg-slate-200" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFiles([])}
                    className="border-slate-300 text-slate-600 hover:bg-slate-50"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={uploadFiles}
                    disabled={selectedFiles.length === 0}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? "s" : ""}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inline Analysis */}
          {recentUploadedFile && showAnalysis && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <FileAnalysisInlineView
                file={recentUploadedFile}
                onClose={() => setShowAnalysis(false)}
              />
            </div>
          )}
        </main>
      </div>

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
          }
          setUploadedFiles((prev) => [...prev, fileData])
          setRecentUploadedFile(fileData)
          setShowAnalysis(true)
        }}
      />
    </div>
  )
}
