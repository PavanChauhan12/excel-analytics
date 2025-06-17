"use client"

import { Card, CardContent } from "@/components/ui/card"

export function AdminFeatureCard({ feature }) {
  return (
    <Card className="w-64 bg-black/40 backdrop-blur-md border border-red-500/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-red-400/40 hover:bg-black/60">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30">
            {feature.icon}
          </div>
          <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
        </div>
        <p className="text-red-200/80 text-sm leading-relaxed">{feature.description}</p>
      </CardContent>
    </Card>
  )
}
