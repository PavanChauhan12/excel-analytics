"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Users,
  FileSpreadsheet,
  BarChart3,
  Brain,
  Settings,
  HelpCircle,
  LogOut,
  Upload,
  ChevronLeft,
  ChevronRight,
  Activity,
  UserCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useNavigate, useLocation } from "react-router-dom"
import { handleSignOut } from "@/services/api"

const adminNavigation = [
  { name: "Admin Dashboard", href: "/admin", icon: Shield },
  { name: "User Management", href: "/admin/users", icon: Users},
]

const adminSecondaryNavigation = [
  { name: "Admin Settings", href: "/admin/settings", icon: Settings },
  { name: "Switch to User", href: "/dashboard", icon: UserCheck },
  { name: "Help", href: "/admin/help", icon: HelpCircle },
]

export function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const [isCollapsed, setIsCollapsed] = useState(true)

  const handleNavigation = (href) => {
    navigate(href)
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="relative flex z-10">
      <div
        className={cn(
          "flex flex-col backdrop-blur-2xl bg-[#0b0c10]/60 shadow-[0_0_10px_#dc2626] transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex items-center h-16 px-6 border-b border-[#1f1f1f]/60">
          {!isCollapsed ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleNavigation("/admin")}
            >
              <div className="w-8 h-8 bg-red-500/30 border border-red-500 p-2 flex items-center justify-center shadow-[0_0_8px_#dc2626]">
                <Shield className="h-4 w-4 text-red-500" />
              </div>
              <span className="text-xl font-bold text-[#f4b8b8]">Admin Panel</span>
            </div>
          ) : (
            <div
              className="flex items-center justify-center w-full cursor-pointer"
              onClick={() => handleNavigation("/admin")}
            >
              <div className="w-8 h-8 bg-red-500/30 border border-red-500 p-2 flex items-center justify-center shadow-[0_0_8px_#dc2626]">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <div key={item.name} className="relative group">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full gap-3 text-white hover:bg-red-500/10 hover:text-red-300 transition-all duration-200",
                    isCollapsed ? "justify-center px-2" : "justify-start",
                    isActive && "bg-red-500/10 text-red-300 shadow-[0_0_5px_#dc2626]",
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      
                    </>
                  )}
                </Button>

                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[#1a1a2e] text-red-300 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow border border-red-500/30">
                    {item.name}
                    
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-[#1f1f1f]/60 space-y-1">
          {adminSecondaryNavigation.map((item) => (
            <div key={item.name} className="relative group">
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3 text-white hover:text-red-400 hover:bg-red-500/10 transition-all duration-200",
                  isCollapsed ? "justify-center px-2" : "justify-start",
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && item.name}
              </Button>

              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[#1a1a2e] text-red-400 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow border border-red-500/30">
                  {item.name}
                </div>
              )}
            </div>
          ))}

          <div className="relative group">
            <Button
              variant="ghost"
              className={cn(
                "w-full gap-3 text-red-500 hover:text-red-400 hover:bg-red-900/30 transition-all duration-200",
                isCollapsed ? "justify-center px-2" : "justify-start",
              )}
              onClick={() => handleSignOut(navigate)}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && "Sign Out"}
            </Button>

            {isCollapsed && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[#1a1a2e] text-red-400 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow border border-red-500/30">
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
          "absolute top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full border border-red-400 bg-[#0b0c10]/70 hover:bg-red-500/10 shadow-[0_0_10px_#dc2626] transition-all duration-200",
          "flex items-center justify-center p-0 z-10",
          isCollapsed ? "-right-4" : "-right-4",
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-red-300" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-red-300" />
        )}
      </Button>
    </div>
  )
}
