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

export default function DashboardPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const number = localStorage.getItem("number");
    if (name && email) {
      setUser({ name, email ,number});
    }
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
          <StatsCards number={user.number}/>

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
                <Button variant="outline" className="flex items-center gap-2 bg-black text-white hover:bg-green-600 hover:text-white">
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
                <RecentUploads />
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
                <CardContent>
                  <div className="space-y-4">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="h-8 w-8 text-green-600" />
                          <div>
                            <h4 className="font-medium">{file.name}</h4>
                            <p className="text-sm text-gray-500">
                              {((file.size || 0) / 1024 / 1024).toFixed(2)} MB •
                              just now • 0 charts
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default">processed</Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
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

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadSuccess={handleFileUpload}
      />
    </div>
  );
}
