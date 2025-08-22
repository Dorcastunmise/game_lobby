
# 🎮 Number Guessing Game Lobby

https://github.com/Dorcastunmise/game_lobby/public/Game_Lobby.mp4

A fun and interactive web-based game where users can join sessions, pick numbers, and compete to guess the winning number. Built with React.js frontend and Node.js/Express backend with MySQL database.  

---

## 🚀 Features

- User Authentication: Register and login with JWT-based secure authentication  
- Number Guessing Game: Join active sessions and pick a number between 1-9  
- Countdown Timer: 20-second countdown before results are revealed  
- Leaderboard: Track top players and their wins  
- Responsive UI: Styled with modern CSS  
- Strong Passwords: Enforces uppercase, lowercase, number, and special characters  
- Show/Hide Password: Toggle visibility of password fields  

---

## 🏗️ Tech Stack

Frontend: React.js, React Router v6, Axios, TailwindCSS / Custom CSS  
Backend: Node.js & Express.js, JWT Authentication, MySQL Database, RESTful API Design  

---

## 📂 File Structure

frontend/game_lobby/
├── src/
│   ├── assets/
│   │   └── logo.jpeg
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Button.jsx
│   │   ├── CountdownTimer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── GamePage.jsx
│   │   └── LeaderboardPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css

---

## ⚡ Installation & Setup

Backend:

<code class="language-bash">
git clone &lt;repo-url&gt;
cd backend
npm install
</code>

Create .env:

<code class="language-text">
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=game_lobby
JWT_SECRET=your_jwt_secret
</code>

Start server:

<code class="language-bash">
npm run dev
</code>

Frontend:

<code class="language-bash">
cd frontend/game_lobby
npm install
npm start
</code>

Open in browser: http://localhost:5173

---

## 🔑 Usage

1. Register a new account or login  
2. Pick a number between 1-9 in the game page  
3. Wait for the 20-second countdown to see the winning number  
4. Check the leaderboard for top players  

---

## 📝 API Endpoints

<code class="language-text">
POST /api/auth/register
POST /api/auth/login
POST /api/session/join
GET  /api/session/result?sessionId=&lt;id&gt;
GET  /api/leaderboard/top
</code>

---

## 📦 Dependencies

- React.js  
- React Router  
- Axios  
- Express.js  
- MySQL2  
- jsonwebtoken  
- bcryptjs  

---

## 📌 Contribution

<code class="language-bash">
# Fork the repository
# Create a new branch
git checkout -b feature/YourFeature

# Commit changes
git commit -m 'Add feature'

# Push branch
git push origin feature/YourFeature

# Open a Pull Request
</code>

---

## 📜 License

MIT License © 2025

---

Made with ❤️ by [Oluwatunmise]
