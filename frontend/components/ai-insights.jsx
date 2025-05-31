"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, RefreshCw } from "lucide-react"

const insights = [
  {
    type: "trend",
    title: "Sales Growth Acceleration",
    description:
      "Your Q4 sales data shows a 23% acceleration in growth rate compared to Q3, particularly in the technology sector.",
    confidence: "High",
    file: "Sales_Data_Q4.xlsx",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    type: "anomaly",
    title: "Unusual Customer Behavior",
    description:
      "Detected a 15% drop in customer retention in the Northeast region. This may require immediate attention.",
    confidence: "Medium",
    file: "Customer_Analytics.xls",
    icon: AlertTriangle,
    color: "text-orange-600",
  },
  {
    type: "recommendation",
    title: "Optimization Opportunity",
    description:
      "Consider reallocating marketing budget from low-performing channels to digital platforms for better ROI.",
    confidence: "High",
    file: "Financial_Report.xlsx",
    icon: Lightbulb,
    color: "text-blue-600",
  },
]

export function AIInsights() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Insights
          </CardTitle>
          <CardDescription>Smart analysis and recommendations from your data</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <insight.icon className={`h-5 w-5 ${insight.color}`} />
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                </div>
              </div>
              <Badge variant={insight.confidence === "High" ? "default" : "secondary"}>{insight.confidence}</Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>From {insight.file}</span>
              <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
