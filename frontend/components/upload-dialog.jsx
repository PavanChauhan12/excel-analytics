"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { UploadButton } from "@/components/uploadbutton";

export function UploadDialog({ open, onOpenChange, onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    console.log("Selected file:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });

    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const isValidType =
      validTypes.includes(file.type) ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".xlsx");

    if (!isValidType) {
      setUploadError("Please upload a valid Excel file (.xls or .xlsx)");
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setUploadError("File size must be less than 50MB");
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
  };

  const handleUploadSuccess = (file, result) => {
    console.log("Upload success in dialog:", result);
    setUploadComplete(true);
    setUploadError(null);
    onUploadSuccess?.(file, result);

    // Auto-close dialog after 3 seconds
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleUploadError = (error) => {
    console.error("Upload error in dialog:", error);
    setUploadError(error.message);
    setUploadComplete(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setSelectedFile(null);
      setUploadComplete(false);
      setUploadError(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Excel File</DialogTitle>
          <DialogDescription>
            {uploadComplete
              ? "File uploaded successfully!"
              : selectedFile
              ? "Review your file and upload to server"
              : "Select or drop a .xls or .xlsx file to continue"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {uploadError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{uploadError}</span>
            </div>
          )}

          {uploadComplete ? (
            // Upload Success State
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload Complete!
              </h3>
              <p className="text-sm text-gray-500">
                Your file "{selectedFile?.name}" has been uploaded and processed
                successfully.
              </p>
            </div>
          ) : !selectedFile ? (
            // File Selection State
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your Excel file here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files (Max 50MB)
              </p>

              <div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xls,.xlsx"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  Choose File
                </Button>
              </div>
            </div>
          ) : (
            // File Selected State
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-green-700">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                    {selectedFile.type.includes("sheet")
                      ? "Excel 2007+"
                      : "Excel 97-2003"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadError(null);
                  }}
                  className="text-green-600 hover:text-green-700 hover:bg-green-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {!uploadComplete && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  {selectedFile && !uploadError && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadError(null);
                      }}
                    >
                      Choose Different File
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          {!uploadComplete && (
            <div className="flex justify-between items-center">
              <UploadButton
                file={selectedFile}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                className="h-10 px-4 flex items-center"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload & Process File
              </UploadButton>

              <Button
                variant="outline"
                onClick={handleClose}
                className="h-10 px-4"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
