"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, BarChart3, AlertCircle } from "lucide-react"
import { ChartCreationDialog } from "@/components/chart-creation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function FileAnalysisInlineView({ file, onClose }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actualFile, setActualFile] = useState(null)
  const [error, setError] = useState(null)

  // When the component mounts or file changes, try to retrieve the actual file
  useEffect(() => {
    if (file && file.originalFile) {
      // If the file object already has the original file reference
      setActualFile(file.originalFile)
    } else if (file && file.path) {
      // If we need to fetch the file from storage
      fetchFileFromStorage(file.path)
        .then((fileBlob) => {
          setActualFile(fileBlob)
        })
        .catch((err) => {
          console.error("Failed to retrieve file:", err)
          setError("Could not retrieve the original file for chart creation.")
        })
    } else {
      // If we don't have a way to get the actual file
      setError("File data is not available for chart creation.")
    }
  }, [file])

  // Function to fetch file from storage if needed
  const fetchFileFromStorage = async (path) => {
    // This is a placeholder - in a real app, you would implement
    // logic to fetch the file from your storage system
    // For now, we'll create a mock file for demonstration
    return new File(
      [new ArrayBuffer(1024)], // Mock file content
      file.name,
      { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    )
  }

  if (!file) return null

  return (
    <>
      <Card className="border border-pink-500/20 bg-white/10 text-white">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Analysis for: {file.name}</CardTitle>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p>
              <strong>Size:</strong> {file.size}
            </p>
            <p>
              <strong>Uploaded at:</strong> {file.uploadTime}
            </p>
            <p>
              <strong>Charts Detected:</strong> {file.charts}
            </p>
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-gradient-to-r from-pink-600 to-purple-700 text-white hover:from-pink-500 hover:to-purple-600"
              disabled={!actualFile}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Create Chart
            </Button>
          )}
        </CardContent>
      </Card>

      <ChartCreationDialog open={dialogOpen} onOpenChange={setDialogOpen} selectedFile={actualFile} />
    </>
  )
}
