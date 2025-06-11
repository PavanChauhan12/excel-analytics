"use client"

import { useState } from "react"
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
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useNavigate, useLocation } from "react-router-dom"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Files", href: "/dashboard/files", icon: FileSpreadsheet, count: 12 },
  { name: "Upload", href: "/dashboard/upload", icon: Upload },
  { name: "Charts", href: "/dashboard/charts", icon: BarChart3, count: 24 },
  { name: "AI Insights", href: "/dashboard/insights", icon: Brain, count: 8 },
  { name: "Users", href: "/admin", icon: Users, admin: true },
  { name: "Data Usage", href: "/admin/usage", icon: Database, admin: true },
]

const secondaryNavigation = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
]

export function DashboardSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleNavigation = (href) => {
    navigate(href)
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="relative flex">
      <div
        className={cn(
          "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("/dashboard")}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ExcelAI</span>
            </div>
          )}

          {isCollapsed && (
            <div
              className="flex items-center justify-center w-full cursor-pointer"
              onClick={() => handleNavigation("/dashboard")}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <div key={item.name} className="relative group">
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full gap-3 transition-all duration-200",
                    isCollapsed ? "justify-center px-2" : "justify-start",
                    isActive && "bg-blue-600 text-white hover:bg-blue-700",
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
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
                    </>
                  )}
                </Button>

                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                    {item.count && ` (${item.count})`}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-200 space-y-1">
          {secondaryNavigation.map((item) => (
            <div key={item.name} className="relative group">
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3 transition-all duration-200",
                  isCollapsed ? "justify-center px-2" : "justify-start",
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && item.name}
              </Button>

              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </div>
          ))}

          <div className="relative group">
            <Button
              variant="ghost"
              className={cn(
                "w-full gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200",
                isCollapsed ? "justify-center px-2" : "justify-start",
              )}
              onClick={() => {
                console.log("Logging out...")
                navigate("/")
              }}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && "Sign Out"}
            </Button>

            
            {isCollapsed && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Sign Out
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className={cn(
          "absolute top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-200",
          "flex items-center justify-center p-0 z-10",
          isCollapsed ? "-right-4" : "-right-4",
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </Button>
    </div>
  )
}
