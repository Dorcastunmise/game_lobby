import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://game-lobby-2whu.onrender.com/api",
});




// Automatically attach JWT token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------- Auth APIs --------
export const registerUser = async (username, password) => {
  const res = await api.post("/auth/register", { username, password });
  return res.data;
};

export const loginUser = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  return res.data;
};

// -------- Game APIs --------
export const joinGame = async (chosenNumber) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");

  const res = await api.post(
    "/session/join",
    { chosenNumber },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log("Join response:", res.data);
  return res.data;
};

export const getGameResult = async (sessionId) => {
  const res = await api.get(`/session/result?sessionId=${sessionId}`);
  return res.data;
};

// -------- Leaderboard --------
export const fetchTopPlayers = async () => {
  const res = await api.get("/leaderboard/");
  return res.data;
};

// -------- Leave session --------
export const leaveSession = async (sessionId) => {
  const res = await api.post("/session/leave", { sessionId });
  return res.data;
};

export default api;
