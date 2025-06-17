"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Aurora from "@/components/ui/aurora"
import Orb from "@/components/ui/orb"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminWelcomeSection } from "@/components/admin-welcome-section"
import { AdminFeatureCard } from "@/components/admin-feature-card"
import { FileUp, BarChart3, Users, Shield } from "lucide-react"

const adminFeatures = [
  {
    icon: <Users className="w-6 h-6 text-red-500" />,
    title: "User Management",
    description: "Manage users, roles, and account permissions across the platform.",
  },
  {
    icon: <FileUp className="w-6 h-6 text-orange-500" />,
    title: "File Administration",
    description: "Upload and manage Excel files with administrative privileges.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-pink-500" />,
    title: "Analytics Dashboard",
    description: "Create charts and visualizations with full admin access.",
  },
  {
    icon: <Shield className="w-6 h-6 text-red-600" />,
    title: "System Security",
    description: "Monitor system activity and manage security settings.",
  },
]

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem("role")
    const name = localStorage.getItem("username")
    const email = localStorage.getItem("email")

    // Check if user is admin
    if (role !== "admin") {
      navigate("/dashboard")
      return
    }

    if (name && email) {
      setAdmin({ name, email, role })
    }
  }, [navigate])

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen w-full bg-black overflow-y-auto">
      {/* Admin Sidebar */}
      <div className="z-20 flex justify-between">
        <AdminSidebar />
      </div>

      {/* Main content area with Aurora and Orb */}
      <div className="relative flex-1 h-full overflow-y-auto">
        {/* Aurora background with red theme */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Aurora colorStops={["#ff0038", "#ff4d00", "#330022"]} amplitude={1.2} blend={0.4} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-[700px] h-[700px]">
            
            <div className="absolute z-20 w-[90%] max-w-md">
              <AdminWelcomeSection name={admin.name} />
            </div>
          </div>

          {adminFeatures.map((feature, index) => {
            const positions = [
              "top-6 left-12 rotate-[-6deg]",
              "top-6 right-16 rotate-[6deg]",
              "bottom-6 left-16 rotate-[6deg]",
              "bottom-6 right-12 rotate-[-6deg]",
            ]

            return (
              <div key={index} className={`absolute ${positions[index]} m-4`}>
                <AdminFeatureCard feature={feature} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Inverted Aurora for depth */}
      <div className="absolute inset-0 z-0 scale-y-[-1] opacity-40">
        <Aurora colorStops={["#ff0038", "#ff4d00", "#330022"]} amplitude={1.2} blend={0.4} />
      </div>
    </div>
  )
}
