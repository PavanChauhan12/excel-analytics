import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../web/authpage/page";
import DashboardPage from "../web/dashboard/page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
