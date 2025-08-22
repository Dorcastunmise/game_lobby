import { useState, useEffect } from "react";
import { fetchTopPlayers } from "../services/api.js";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchTopPlayers()
      .then(data => {
        console.log("API leaderboard data:", data);
        setPlayers(data);
      })
      .catch(console.error);
  }, []);


  return (
        <div className="leaderboard-container">
      <h1>🏆 Game Board</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          {players.length === 0 ? (
            <tr>
              <td colSpan={2} className="no-players">
                No players yet
              </td>
            </tr>
          ) : (
            players.map(p => (
              <tr key={p.username}>
                <td>{p.username}</td>
                <td>{p.wins}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}