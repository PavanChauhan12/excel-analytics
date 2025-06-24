"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { uploadExcelFile } from "@/services/api"

export function UploadButton({ onUploadSuccess, onUploadError, children, file, disabled }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)

  const handleClick = () => {
    if (file) {
      handleFileUpload(file)
    } else {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    await handleFileUpload(selectedFile)
  }

  const handleFileUpload = async (fileToUpload) => {
    console.log("Starting upload for:", fileToUpload.name)

    const validTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]

    const isValidType =
      validTypes.includes(fileToUpload.type) ||
      fileToUpload.name.endsWith(".xls") ||
      fileToUpload.name.endsWith(".xlsx")

    if (!isValidType) {
      const errorMsg = "Please upload a valid Excel file (.xls or .xlsx)"
      setError(errorMsg)
      onUploadError?.(new Error(errorMsg))
      return
    }

    const maxSize = 50 * 1024 * 1024 // 50MB
    if (fileToUpload.size > maxSize) {
      const errorMsg = "File size must be less than 50MB"
      setError(errorMsg)
      onUploadError?.(new Error(errorMsg))
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const result = await uploadExcelFile(fileToUpload, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percent)
        }
      })

      console.log("Upload successful, server response:", result)
      onUploadSuccess?.(fileToUpload, result)
      toast.success("Upload completed!")
    } catch (error) {
      console.error("Upload failed:", error)
      const errorMsg = error.response?.data?.message || error.message || "Upload failed"
      setError(errorMsg)
      onUploadError?.(error)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="space-y-2 border rounded-md border-cyan-500 text-cyan-500">
      {!file && (
        <input type="file" accept=".xls,.xlsx" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      )}

      <Button onClick={handleClick} disabled={uploading || disabled}>
        {uploading ? (
          <>
            <Upload className="mr-2 h-4 w-4 animate-spin" />
            Uploading... {uploadProgress}%
          </>
        ) : (
          children || (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {file ? "Upload to Server" : "Upload Excel"}
            </>
          )
        )}
      </Button>

      {uploading && (
        <div className="space-y-1">
          <Progress value={uploadProgress} />
          <p className="text-xs text-cyan-500text-center ">{uploadProgress}% uploaded</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}
