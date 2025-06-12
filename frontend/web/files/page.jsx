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
import Aurora from "@/components/ui/aurora";

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
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 opacity-40">
  <Aurora
    colorStops={["#FE88B1", "#FFA6C3", "#EEBFD9"]}
    amplitude={0.8 }
    blend={1}
  />
</div>
      <div className="absolute inset-0 z-0 scale-y-[-1] opacity-40">
  <Aurora
    colorStops={["#FE88B1", "#FFA6C3", "#EEBFD9"]}
    amplitude={0.8}
    blend={1}
  />
</div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 space-y-6 mt-16">
            <Card className="border border-pink-500/20 bg-white/10">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-[#fdfdff]">
                      File Library
                    </CardTitle>
                    <CardDescription className="text-[#aaaaaa]">
                      Complete history of all your uploaded files
                    </CardDescription>
                  </div>
                  <div className="relative ">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white " />
                    <Input
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-white/10 border border-pink-100 text-pink-200 placeholder:text-white/40 focus:border-pink-400 "
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-white/5 uppercase text-sm tracking-wide">
                        <TableHead className="pl-6 text-white">File</TableHead>
                        <TableHead className="text-white">Filesize</TableHead>
                        <TableHead className="text-white">Rows</TableHead>
                        <TableHead className="text-white">Columns</TableHead>
                        <TableHead className="text-white">
                          Uploaded At
                        </TableHead>
                        <TableHead className="pr-6 text-right text-white">
                          Action
                        </TableHead>
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
                          <TableRow
                            key={file?.id}
                            className="hover:bg-white/10 transition-all duration-200"
                          >
                            <TableCell className="pl-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#00ffcc]/20 rounded-lg">
                                  <FileSpreadsheet className="h-5 w-5 text-[#00ffcc]" />
                                </div>
                                <p className="font-semibold text-white">
                                  {file?.filename}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-white/80">
                              {file?.filesize || "-"}
                            </TableCell>
                            <TableCell className="text-white/80">
                              {file?.rows ?? "-"}
                            </TableCell>
                            <TableCell className="text-white/80">
                              {file?.columns ?? "-"}
                            </TableCell>
                            <TableCell className="text-white/80">
                              {uploadedAtFormatted}
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewFile(file)}
                                className="text-[#ff00d4] hover:bg-[#ff00d4]/10"
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
            <FileAnalysisInlineView
              open={analysisModalOpen}
              onOpenChange={setAnalysisModalOpen}
              file={selectedFile}
            />
          </main>
        </div>
      </div>

      {/* Dialogs */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
}
