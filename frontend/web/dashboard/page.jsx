"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileSpreadsheet,
  BarChart3,
  Download,
  Eye,
  Trash2,
  Plus,
  Brain,
  X,
} from "lucide-react";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { WelcomeSection } from "@/components/welcome-section";
import { UploadDialog } from "@/components/upload-dialog";
import { ChartPreview } from "@/components/chart-preview";
import { AIInsights } from "@/components/ai-insights";
import { RecentUploads } from "@/components/recent-uploads";
import { ChartGallery } from "@/components/chart-gallery";
import { StatsCards } from "@/components/stats-cards";
import { ChartCreationDialog } from "@/components/chart-creation";
import { Files } from "@/components/files";

export default function DashboardPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // updated name
  const [user, setUser] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    if (name && email) {
      setUser({ name, email });
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:5050/api/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUploadedFiles(data.records || []);
      })
      .catch((err) =>
        console.error("Failed to fetch dashboard data:", err)
      );
  }, []);

  const handleFileUpload = (file) => {
    setUploadedFiles((prev) => [...prev, file]);
    setSelectedFile(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  if (!user)
    return <p className="p-6 text-sm text-gray-500">Loading dashboard...</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader name={user.name} email={user.email} />

        <main className="flex-1 p-6 space-y-6">
          <WelcomeSection name={user.name} />
          <StatsCards files={uploadedFiles} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Start analyzing your data with these quick actions
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-4 items-center">
              <div className="flex flex-col gap-4">
                {selectedFile ? (
                  <div className="flex items-center justify-between p-3 border border-green-500 rounded-lg w-72">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="text-green-600" />
                      <p className="font-medium text-sm truncate">
                        {selectedFile.name}
                      </p>
                    </div>
                    <button onClick={handleFileRemove}>
                      <X className="h-4 w-4 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setUploadDialogOpen(true)}
                    className="flex items-center gap-2 w-fit"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Excel File
                  </Button>
                )}
              </div>

              {selectedFile && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-black text-white hover:bg-green-600 hover:text-white"
                  onClick={() => setDialogOpen(true)}
                >
                  <BarChart3 className="h-4 w-4" />
                  Create Chart
                </Button>
              )}

              <Button variant="outline" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Analysis
              </Button>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentUploads files={uploadedFiles} />
                <ChartGallery />
              </div>
              <AIInsights />
            </TabsContent>

            <TabsContent value="files" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Files</CardTitle>
                    <CardDescription>
                      Manage your uploaded Excel files and their analysis
                    </CardDescription>
                  </div>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New File
                  </Button>
                </CardHeader>
                <Files files={uploadedFiles} />
              </Card>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <ChartGallery />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <AIInsights />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Dialogs */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadSuccess={handleFileUpload}
      />

      <ChartCreationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedFile={selectedFile}
      />
    </div>
  );
}
