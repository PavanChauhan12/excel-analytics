// components/file-analysis-inline.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FileAnalysisInlineView({ file }) {
  if (!file) return null

  return (
    <Card className="border-blue-200 shadow-sm">
      <CardHeader>
        <CardTitle>Analysis for: {file.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Size:</strong> {file.size}</p>
        <p><strong>Uploaded at:</strong> {file.uploadTime}</p>
        <p><strong>Charts Detected:</strong> {file.charts}</p>
        {/* Add actual analysis here */}
      </CardContent>
    </Card>
  )
}
