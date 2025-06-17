import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AuthPage from "../web/authpage/page"
import DashboardPage from "../web/user/dashboard/page"
import ChartPage from "@/web/user/chart/page"
import UploadPage from "@/web/user/upload/page"
import FilesPage from "@/web/user/files/page"
import ChartsHistoryPage from "@/web/user/charthistory/page"
import AIInsightsPage from "@/web/user/aiinsights/page"

// Admin imports
import AdminDashboardPage from "@/web/admin/dashboard/page"
import AdminUsersPage from "@/web/admin/users/page"
import UserSettings from "@/web/user/settings/page"
import AdminSettings from "@/web/admin/settings/page"



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
        <Route path="/dashboard/settings" element={<UserSettings/>}/>

       
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/settings" element={<AdminSettings/>}/>
      </Routes>
    </Router>
  )
}

export default App
