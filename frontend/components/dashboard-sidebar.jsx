"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileSpreadsheet,
  BarChart3,
  Brain,
  Settings,
  Users,
  Database,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, current: true },
  { name: "Files", href: "/dashboard/files", icon: FileSpreadsheet, count: 12 },
  { name: "Charts", href: "/dashboard/charts", icon: BarChart3, count: 24 },
  { name: "AI Insights", href: "/dashboard/insights", icon: Brain, count: 8 },
  { name: "Users", href: "/dashboard/users", icon: Users, admin: true },
  { name: "Data Usage", href: "/dashboard/usage", icon: Database, admin: true },
]

const secondaryNavigation = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
]

export function DashboardSidebar() {
  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">ExcelAI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <Button
            key={item.name}
            variant={item.current ? "default" : "ghost"}
            className={cn("w-full justify-start gap-3", item.current && "bg-blue-600 text-white hover:bg-blue-700")}
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1 text-left">{item.name}</span>
            {item.count && (
              <Badge variant="secondary" className="ml-auto">
                {item.count}
              </Badge>
            )}
            {item.admin && (
              <Badge variant="outline" className="ml-auto text-xs">
                Admin
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-4 py-4 border-t border-gray-200 space-y-1">
        {secondaryNavigation.map((item) => (
          <Button key={item.name} variant="ghost" className="w-full justify-start gap-3">
            <item.icon className="h-4 w-4" />
            {item.name}
          </Button>
        ))}
        <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
