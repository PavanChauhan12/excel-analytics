"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, BarChart3, Brain, Calendar } from "lucide-react"

export function WelcomeSection({name}) {

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
              {getGreeting()}, Welcome back {name} 👋
            </h1>
            <p className="text-blue-100 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate()}
            </p>
            <p className="text-blue-100 text-sm">
              Ready to analyze your data? You have 3 new insights waiting for you.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
