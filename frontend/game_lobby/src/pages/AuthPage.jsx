import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import { loginUser } from "../services/api.js";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return alert("Username and password required");
    }

    try {
      const response = await loginUser(trimmedUsername, trimmedPassword);
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.username);
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Failed to login. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ marginLeft: "0.5rem" }}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <Button onClick={handleLogin}>Login</Button>
      <p>
        Don't have an account?{" "}
        <Link to="/register" className="register-link">
          Register
        </Link>
      </p>
    </div>
  );
}
