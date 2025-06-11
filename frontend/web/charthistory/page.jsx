"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Download,
  Eye,
  CuboidIcon as Cube,
  Search,
  ArrowLeft,
  Filter,
  Sparkles,
} from "lucide-react";
import { UploadDialog } from "@/components/upload-dialog";
import { DashboardSidebar } from "@/components/dashboard-sidebar"; // Ensure the path is correct

export default function ChartsHistoryPage() {
  const navigate = useNavigate();
  const [charts, setCharts] = useState([]);
  const [filteredCharts, setFilteredCharts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const loadCharts = () => {
      try {
        const storedCharts = JSON.parse(
          localStorage.getItem("userCharts") || "[]"
        );
        setCharts(storedCharts);
        setFilteredCharts(storedCharts);
      } catch (error) {
        console.error("Error loading charts:", error);
        setCharts([]);
        setFilteredCharts([]);
      }
    };

    loadCharts();
    const handleStorageChange = () => loadCharts();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const filtered = charts.filter((chart) => {
      const matchesSearch = chart.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" ||
        chart.type.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created) - new Date(a.created);
        case "oldest":
          return new Date(a.created) - new Date(b.created);
        case "most-viewed":
          return (b.views || 0) - (a.views || 0);
        case "most-downloaded":
          return (b.downloads || 0) - (a.downloads || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredCharts(filtered);
  }, [charts, searchTerm, filterType, sortBy]);

  const handleViewChart = (chartId) => {
    try {
      const updatedCharts = charts.map((chart) =>
        chart.id === chartId
          ? { ...chart, views: (chart.views || 0) + 1 }
          : chart
      );
      localStorage.setItem("userCharts", JSON.stringify(updatedCharts));
      setCharts(updatedCharts);
    } catch (error) {
      console.error("Error updating view count:", error);
    }

    navigate(`/chart/${chartId}`);
  };

  const handleDownloadChart = (chartId) => {
    try {
      const updatedCharts = charts.map((chart) =>
        chart.id === chartId
          ? { ...chart, downloads: (chart.downloads || 0) + 1 }
          : chart
      );
      localStorage.setItem("userCharts", JSON.stringify(updatedCharts));
      setCharts(updatedCharts);
    } catch (error) {
      console.error("Error updating download count:", error);
    }

    console.log("Downloading chart:", chartId);
  };

  const getUniqueChartTypes = () => {
    const types = [...new Set(charts.map((chart) => chart.type))];
    return types;
  };

  const handleChartCreated = () => {
    const event = new Event("storage");
    window.dispatchEvent(event);
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <DashboardSidebar />

      <div className="flex-1">
        <div className="bg-white border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-blue-800">
                    Charts History
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {filteredCharts.length} of {charts.length} charts
                </div>
                <UploadDialog onChartCreated={handleChartCreated} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                <Input
                  placeholder="Search charts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 bg-white"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40 border-blue-200 bg-white">
                    <Filter className="h-4 w-4 mr-2 text-blue-500" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-200">
                    <SelectItem value="all">All Types</SelectItem>
                    {getUniqueChartTypes().map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-blue-200 bg-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-200">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="most-viewed">Most Viewed</SelectItem>
                    <SelectItem value="most-downloaded">
                      Most Downloaded
                    </SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          {filteredCharts.length === 0 ? (
            <div className="text-center py-1 flex flex-wrap">
              <div className="p-4 bg-blue-200 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <BarChart3 className="h-10 w-10 text-blue-700" />
              </div>
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                {charts.length === 0
                  ? "No charts created yet"
                  : "No charts match your search"}
              </h3>
              <p className="text-blue-600 mb-6">
                {charts.length === 0
                  ? "Upload an Excel file and create your first chart!"
                  : "Try adjusting your search terms or filters"}
              </p>
              {charts.length === 0 ? (
                <UploadDialog onChartCreated={handleChartCreated} />
              ) : null}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCharts.map((chart) => (
                <div
                  key={chart.id}
                  className="bg-white border border-blue-200 rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow h-full"
                >
                  {/* Header: Type & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Cube className="h-4 w-4" />
                      <span className="capitalize">{chart.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(chart.created).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold text-blue-800 mb-3 break-words">
                    {chart.title}
                  </h2>

                  {/* Stats */}
                  <div className="flex items-center gap-2 flex-wrap text-xs text-blue-500 mb-4">
                    <Badge variant="outline" className="px-2 py-1">
                      Views: {chart.views || 0}
                    </Badge>
                    <Badge variant="outline" className="px-2 py-1">
                      Downloads: {chart.downloads || 0}
                    </Badge>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-auto pt-2 ">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-700 border-blue-300 whitespace-nowrap"
                      onClick={() => handleDownloadChart(chart.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                      onClick={() => handleViewChart(chart.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
