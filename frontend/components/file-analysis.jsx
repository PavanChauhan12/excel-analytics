import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function FileAnalysisInlineView({ file, onClose }) {
  if (!file) return null;

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
    <Card className="border border-pink-500/20 bg-white/10 text-white mt-4">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Analysis for: {file.filename}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-red-500"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Size:</strong> {file.filesize}</p>
        <p><strong>Uploaded at:</strong> {uploadedAtFormatted}</p>
        <p><strong>Rows:</strong> {file.rows ?? "-"}</p>
        <p><strong>Columns:</strong> {file.columns ?? "-"}</p>
        <p><strong>Charts Detected:</strong> {file.charts ?? "N/A"}</p>
      </CardContent>
    </Card>
  );
}
