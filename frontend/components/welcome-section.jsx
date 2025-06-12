"use client"

import { Calendar } from "lucide-react"
import GlitchText from "./ui/glitchtext"

export function WelcomeSection({ name }) {
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
    <div className="text-white text-center space-y-4">
      <p
        className="text-3xl md:text-4xl font-bold z-10"
      >{`${getGreeting()}, ${name}!`}</p>

      <div className="flex justify-center items-center gap-2 text-gray-400 text-sm">
        <Calendar className="w-4 h-4" />
        <span>{formatDate()}</span>
      </div>

      <p className="text-gray-400 text-sm">
        Ready to analyze your data? You have 3 new insights waiting for you.
      </p>
    </div>
  )
}
