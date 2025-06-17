import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AuthPage from "../web/authpage/page"
import DashboardPage from "../web/dashboard/page"
import ChartPage from "@/web/chart/page"
import UploadPage from "@/web/upload/page"
import FilesPage from "@/web/files/page"
import ChartsHistoryPage from "@/web/charthistory/page"
import AIInsightsPage from "@/web/aiinsights/page"

// Admin imports
import AdminDashboardPage from "@/web/admin/dashboard/page"
import AdminUsersPage from "@/web/admin/users/page"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chart/:id" element={<ChartPage />} />
        <Route path="/dashboard/upload" element={<UploadPage />} />
        <Route path="/dashboard/files" element={<FilesPage />} />
        <Route path="/dashboard/charts" element={<ChartsHistoryPage />} />
        <Route path="/dashboard/insights" element={<AIInsightsPage />} />

       
        <Route path="/admin" element={<AdminDashboardPage />} />
        {/* <Route path="admin/users" element={<AdminUsersPage />} /> */}
        
      </Routes>
    </Router>
  )
}

export default App
