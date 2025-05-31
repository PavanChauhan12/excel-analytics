"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, BarChart3, Brain, Calendar } from "lucide-react"

export function WelcomeSection() {
  // In a real app, this would come from authentication context or props
  const userName = "John Doe"
  const currentTime = new Date()
  const hour = currentTime.getHours()

  const getGreeting = () => {
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-gradient-to-r from-blue-700 to-blue-400 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {getGreeting()}, Welcome back {userName}! 👋
            </h1>
            <p className="text-blue-100 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate()}
            </p>
            <p className="text-blue-100 text-sm">
              Ready to analyze your data? You have 3 new insights waiting for you.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-xs text-blue-100">Upload</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <BarChart3 className="h-6 w-6" />
              </div>
              <p className="text-xs text-blue-100">Analyze</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <Brain className="h-6 w-6" />
              </div>
              <p className="text-xs text-blue-100">Insights</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            View Tutorial
          </Button>
          <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            What's New
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
