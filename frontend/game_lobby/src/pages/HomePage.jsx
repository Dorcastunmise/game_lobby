import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleJoinGame = () => {
    navigate("/game");
  };

  return (
    <div className="home-container">
      <h1>Welcome, {username}</h1>
      <p>Join a game session and pick your lucky number!</p>
      <Button onClick={handleJoinGame}>Join Game</Button>
    </div>
  );
}
