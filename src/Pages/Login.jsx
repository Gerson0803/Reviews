
import { Link } from 'react-router-dom';
import React, { useState } from "react";
import "./Styles/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      setMessage("✅ Inicio de sesión exitoso.");
    } else {
      setMessage("❌ Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        {/* Logo */}
        <div className="logo-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="logo-icon"
            viewBox="0 0 24 24"
          >
            <path d="M4 19V5a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>

        <h1 className="app-title">MyReviews</h1>
        <p className="subtitle">Tu opinión, tu voz.</p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Iniciar sesión</button>
        </form>

        <a href="#!" className="forgot-password">
          ¿Olvidaste tu contraseña?
        </a>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}
