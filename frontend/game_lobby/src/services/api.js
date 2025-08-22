import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (username, password) => api.post("/auth/register", { username, password }).then(res => res.data);
export const loginUser = (username, password) => api.post("/auth/login", { username, password }).then(res => res.data);
export const joinGame = (chosenNumber) => api.post("/session/join", { chosenNumber }).then(res => res.data);
export const getGameResult = (sessionId) => api.get(`/session/result?sessionId=${sessionId}`).then(res => res.data);
export const fetchTopPlayers = () => api.get("/leaderboard").then(res => res.data);
export const leaveSession = async (sessionId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");

  const res = await api.post(
    "/session/leave",
    { sessionId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("sessionId");

  return res.data;
};

export default api;
