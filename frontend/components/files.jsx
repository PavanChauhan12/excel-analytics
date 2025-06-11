"use client";

import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Eye, BarChart3 } from "lucide-react";

export function Files({ files }) {
  // Remove duplicates and empty/incomplete entries
  const uniqueFiles = Array.from(
    new Map(
      files
        .filter(file => file && file.filename && file.filename.trim() !== "")
        .map(file => [file.filename, file])
    ).values()
  );

  return (
    <CardContent className="space-y-4">
      {uniqueFiles.length === 0 ? (
        <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
      ) : (
        uniqueFiles.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-medium text-sm">{file.filename}</h4>
                <p className="text-xs text-gray-500">{file.filesize}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={file.status === "processed" ? "default" : "secondary"}
              >
                {file.status || "processing"}
              </Badge>
              {file.charts > 0 && (
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </CardContent>
  );
}
