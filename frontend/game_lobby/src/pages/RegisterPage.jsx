import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { registerUser } from "../services/api.js";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleRegister = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return alert("Username and password are required");
    }

    if (!passwordRegex.test(trimmedPassword)) {
      return alert(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
    }

    try {
      const response = await registerUser(trimmedUsername, trimmedPassword);
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.username);
      navigate("/home");
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.message || "Failed to register. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
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
      <Button onClick={handleRegister}>Register</Button>
    </div>
  );
}
