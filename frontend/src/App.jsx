import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../components/authpage";
import DashboardPage from "@/components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage/>} />
      </Routes>
    </Router>
  );
}

export default App;