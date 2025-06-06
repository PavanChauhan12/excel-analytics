import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../web/authpage/page";
import DashboardPage from "../web/dashboard/page";
import ChartPage from "@/web/chart/page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chart/:id" element={<ChartPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
