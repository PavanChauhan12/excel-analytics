import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../web/authpage/page";
import DashboardPage from "../web/dashboard/page";
import ChartPage from "@/web/chart/page";
import UploadPage from "@/web/upload/page";
import FilesPage from "@/web/files/page";
import ChartsHistoryPage from "@/web/charthistory/page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chart/:id" element={<ChartPage/>}/>
        <Route path="/dashboard/upload" element={<UploadPage/>}/>
        <Route path="/dashboard/files" element={<FilesPage/>}/>
        <Route path="/dashboard/charts" element={<ChartsHistoryPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
