"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Crown, Shield } from "lucide-react"

export function AdminWelcomeSection({ name }) {
  return (
    <Card className="bg-black/60 backdrop-blur-md border border-red-500/30 shadow-2xl">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-lg">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {name}</h1>
          <div className="flex items-center justify-center gap-2 text-red-400">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">System Administrator</span>
          </div>
        </div>

        <div className="space-y-3 text-red-200">
          <p className="text-lg">You have full administrative access to the platform</p>
          <p className="text-sm opacity-80">Manage users, oversee file uploads, and monitor system analytics</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="rounded-lg bg-red-950/30 p-3 border border-red-800/30">
            <div className="text-2xl font-bold text-red-400">∞</div>
            <div className="text-xs text-red-300">Admin Privileges</div>
          </div>
          <div className="rounded-lg bg-red-950/30 p-3 border border-red-800/30">
            <div className="text-2xl font-bold text-red-400">24/7</div>
            <div className="text-xs text-red-300">System Access</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
