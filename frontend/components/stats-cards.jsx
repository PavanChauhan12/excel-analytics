"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, BarChart3, Brain, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Files",
    value: "24",
    change: "+12%",
    changeType: "positive",
    icon: FileSpreadsheet,
  },
  {
    title: "Charts Created",
    value: "156",
    change: "+23%",
    changeType: "positive",
    icon: BarChart3,
  },
  {
    title: "AI Insights",
    value: "42",
    change: "+8%",
    changeType: "positive",
    icon: Brain,
  },
  {
    title: "Data Processed",
    value: "2.4 GB",
    change: "+15%",
    changeType: "positive",
    icon: TrendingUp,
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
