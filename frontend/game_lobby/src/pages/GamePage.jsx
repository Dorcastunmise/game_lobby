import { useState, useEffect } from "react";
import Button from "../components/Button.jsx";
import { joinGame, getGameResult } from "../services/api.js";

export default function GamePage() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [result, setResult] = useState("");
  const [timeLeft, setTimeLeft] = useState(20);
  const [sessionId, setSessionId] = useState(null);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0 && selectedNumber && sessionId && !result) {
      getGameResult(sessionId)
        .then((data) => {
          setResult(
            data.winners.includes(localStorage.getItem("username"))
              ? `You Won! Winning number: ${data.winning_number}`
              : `You Lost! Winning number: ${data.winning_number}`
          );
        })
        .catch((err) => {
          console.error("Error fetching result:", err);
          alert("Failed to fetch game result");
        });
      return;
    }

    if (timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, selectedNumber, sessionId, result]);

  const handleSelect = async (num) => {
    setSelectedNumber(num);
    try {
      const data = await joinGame(num); // token automatically included
      setSessionId(data.sessionId);
    } catch (err) {
      console.error("Error joining game:", err);
      alert(err.response?.data?.message || "Failed to join game. Make sure you are logged in.");
    }
  };

  return (
    <div className="game-container">
      <h1>🎲 <br />Choose your lucky number (1-9)! <br /> One shot only!</h1>
      <div className="countdown">Time Left: {timeLeft}s</div>
      <div className="number-grid">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <Button key={n} onClick={() => handleSelect(n)} disabled={!!result}>
            {n}
          </Button>
        ))}
      </div>
      {selectedNumber && !result && <p>You selected: {selectedNumber}</p>}
      {result && <h2>{result}</h2>}
    </div>
  );
}
