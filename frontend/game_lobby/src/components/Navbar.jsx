import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { leaveSession } from "../services/api.js";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) await leaveSession(sessionId); // close session in DB
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
    navigate("/auth");
  };

  // Show auth links properly
  let authLinks = (
    <>
      {location.pathname !== "/auth" && <Link to="/auth">Login</Link>}
      {location.pathname !== "/register" && <Link to="/register">Register</Link>}
    </>
  );

  return (
    <nav>
      <h1 className="navbar-logo">
        <img src={logo} alt="Game Lobby Logo" />
        Game Lobby
      </h1>

      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <div className={`nav-links ${open ? "open" : ""}`}>
        {username ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/game">Game</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          authLinks
        )}
      </div>
    </nav>
  );
}
