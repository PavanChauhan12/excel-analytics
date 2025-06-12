"use client";

import { useEffect, useState } from "react";
import Aurora from "@/components/ui/aurora";
import Orb from "@/components/ui/orb";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { WelcomeSection } from "@/components/welcome-section"; // Adjust path

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    if (name && email) {
      setUser({ name, email });
    }
  }, []);

  if (!user)
    return (
      <p className="p-6 text-sm text-gray-500 bg-black h-screen">Loading...</p>
    );

  return (
    <div className="relative flex h-screen w-full bg-black overflow-hidden">
      {/* Sidebar */}
      <div className="z-20 flex justify-between">
        <DashboardSidebar />
      </div>

      {/* Main content area with Aurora and Orb */}
      <div className="relative flex-1 h-full overflow-hidden">
        {/* Aurora background */}
        <div className="absolute inset-0 z-0 ">
          <Aurora
            colorStops={["#3A29FF", "#B026FF", "#ADD8E6"]}
            amplitude={1.2}
            blend={0.4}
          />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="relative flex items-center justify-center w-[800px] h-[800px]">
            <Orb />
            <div className="absolute z-20 w-[90%] max-w-md">
              <WelcomeSection name={user.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
