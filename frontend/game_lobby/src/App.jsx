import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1e293b" }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/game" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </div>
  );
}
