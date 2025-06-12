"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { UploadDialog } from "@/components/upload-dialog";
import { FileAnalysisInlineView } from "@/components/file-analysis";
import axios from "axios";
import { Search, FileSpreadsheet, Eye } from "lucide-react";

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const filteredFiles = uploadedFiles.filter((file) =>
    file?.filename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewFile = (file) => {
    setSelectedFile(file);
    setAnalysisModalOpen(true);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUploadedFiles(res.data?.records || []);
      })
      .catch((err) => console.error("Failed to fetch dashboard data:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 space-y-6">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-800">
                    File Library
                  </CardTitle>
                  <CardDescription>
                    Complete history of all your uploaded files
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 border-gray-200 focus:border-blue-400"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="pl-6">File</TableHead>
                      <TableHead>Filesize</TableHead>
                      <TableHead>Rows</TableHead>
                      <TableHead>Columns</TableHead>
                      <TableHead>Uploaded At</TableHead>
                      <TableHead className="pr-6 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => {
                      const uploadedAtFormatted = file?.uploadedAt
                        ? new Date(file.uploadedAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "-";
                      return (
                        <TableRow key={file?.id}>
                          <TableCell className="pl-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {file?.filename}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{file?.filesize || "-"}</TableCell>
                          <TableCell>{file?.rows ?? "-"}</TableCell>
                          <TableCell>{file?.columns ?? "-"}</TableCell>
                          <TableCell>{uploadedAtFormatted}</TableCell>
                          <TableCell className="pr-6 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewFile(file)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
      <FileAnalysisInlineView
        open={analysisModalOpen}
        onOpenChange={setAnalysisModalOpen}
        file={selectedFile}
      />
    </div>
  );
}
