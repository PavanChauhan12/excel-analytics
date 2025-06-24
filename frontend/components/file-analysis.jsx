"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, BarChart3, AlertCircle } from "lucide-react";
import { ChartCreationDialog } from "@/components/chart-creation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function FileAnalysisInlineView({ file, onClose }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actualFile, setActualFile] = useState(null);
  const [error, setError] = useState(null);

  // When the component mounts or file changes, try to retrieve the actual file
  useEffect(() => {
  console.log("file received:", file);

  if (file && file.originalFile) {
    console.log("Using originalFile:", file.originalFile);
    setActualFile(file.originalFile);
  } else if (file && file.path) {
    console.log("Fetching from path:", file.path);
    fetchFileFromStorage(file.path)
      .then((fileBlob) => {
        console.log("Fetched fileBlob:", fileBlob);
        setActualFile(fileBlob);
      })
      .catch((err) => {
        console.error("Failed to retrieve file:", err);
        setError("Could not retrieve the original file for chart creation.");
      });
  } else {
    setError("File data is not available for chart creation.");
  }
}, [file]);


  // Function to fetch file from storage if needed
  const fetchFileFromStorage = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Failed to fetch file from server");
  const blob = await response.blob();
  return new File([blob], file.name, { type: blob.type });
};


  if (!file) return null;

  return (
    <>
      <Card className="border border-pink-500/20 bg-white/10 text-white">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Analysis for: {file.filename || file.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-red-500"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p>
              <strong>Size:</strong>{" "}
              {file.filesize || file.size || "Unknown"}
            </p>
            <p>
              <strong>Uploaded at:</strong>{" "}
              {file.uploadedAt
              ? new Date(file.uploadedAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              : "-"}
            </p>

            <p>
              <strong>Charts Detected:</strong> {file.charts ?? 0}
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
              className="bg-[--neon-dark] text-white border border-[--neon-blue] shadow-[0_0_10px_rgba(0,191,255,0.6)] 
             hover:bg-gradient-to-r hover:from-[--neon-blue] hover:to-[--neon-cyan] 
             hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] transition duration-300"
              disabled={!actualFile}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Create Chart
            </Button>
          )}
        </CardContent>
      </Card>

      <ChartCreationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedFile={actualFile}
      />
    </>
  );
}
