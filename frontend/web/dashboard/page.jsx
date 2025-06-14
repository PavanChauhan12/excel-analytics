import { useEffect, useState } from "react";
import Aurora from "@/components/ui/aurora";
import Orb from "@/components/ui/orb";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { WelcomeSection } from "@/components/welcome-section";
import { FeatureCard } from "@/components/feature-card";
import { FileUp, BarChart3, BrainCog, MessageCircle } from "lucide-react";

const features = [
  {
    icon: <FileUp className="w-6 h-6 text-blue-500" />,
    title: "Upload Excel Files",
    description:
      "Upload .xlsx or .csv files and begin analyzing data instantly.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-green-500" />,
    title: "Data Visualizations",
    description: "Visualize your data as charts, heatmaps, or line graphs.",
  },
  {
    icon: <BrainCog className="w-6 h-6 text-purple-500" />,
    title: "AI Insights",
    description: "Get recommendations and detect patterns from your data.",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-yellow-500" />,
    title: "Ask the Chatbot",
    description: "Use natural language to query and explore your dataset.",
  },
];

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
    <div className="relative flex h-screen w-full bg-black overflow-y-auto">
      {/* Sidebar */}
      <div className="z-20 flex justify-between">
        <DashboardSidebar />
      </div>

      {/* Main content area with Aurora and Orb */}
      <div className="relative flex-1 h-full overflow-y-auto">
        {/* Aurora background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Aurora
            colorStops={["#0038ff", "#00d4ff", "#002233"]}
            amplitude={1.2}
            blend={0.4}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center ">
          <div className="relative flex items-center justify-center w-[700px] h-[700px]">
            <Orb />
            <div className="absolute z-20 w-[90%] max-w-md">
              <WelcomeSection name={user.name} />
            </div>
          </div>

          {features.map((feature, index) => {
            const positions = [
              "top-6 left-12 rotate-[-6deg]",
              "top-6 right-16 rotate-[6deg]",
              "bottom-6 left-16 rotate-[6deg]",
              "bottom-6 right-12 rotate-[-6deg]",
            ];

            return (
              <div key={index} className={`absolute ${positions[index]} m-4`}>
                <FeatureCard feature={feature} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute inset-0 z-0 scale-y-[-1] opacity-40">
        <Aurora
          colorStops={["#0038ff", "#00d4ff", "#002233"]}
          amplitude={1.2}
          blend={0.4}
        />
      </div>
    </div>
  );
}
