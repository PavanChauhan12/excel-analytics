import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function FileAnalysisInlineView({ file, onClose }) {
  if (!file) return null

  return (
    <Card className="border border-pink-500/20 bg-white/10 text-white">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Analysis for: {file.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-red-500"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p><strong>Size:</strong> {file.size}</p>
        <p><strong>Uploaded at:</strong> {file.uploadTime}</p>
        <p><strong>Charts Detected:</strong> {file.charts}</p>
        {/* Add analysis result content here */}
      </CardContent>
    </Card>
  )
}
