import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

const handleLogout = async () => {
  const sessionId = localStorage.getItem("sessionId");
  if (sessionId) await leaveSession(sessionId); // closes session in DB
  navigate("/login");
};


  // Determine which link to show when not logged in
  let authLink = null;
  if (!username) {
    if (location.pathname === "/auth") authLink = <Link to="/register">Register</Link>;
    else if (location.pathname === "/register") authLink = <Link to="/auth">Login</Link>;
  }

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
          authLink
        )}
      </div>
    </nav>
  );
}
