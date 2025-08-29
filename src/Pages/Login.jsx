import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./Styles/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("si", username, password);
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage(true);
    } else {
      setMessage(false);
    }
  };

  useEffect(() => {
    if (message) {
      navigate("/menu");
    } else if (message === false) {
      alert("Error: Usuario o contraseña incorrectos.");
    }
  }, [message]);
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
            placeholder="Email"
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <a href="#!" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>

          <a
            onClick={() => {
              navigate("/signUp");
            }}
            className="forgot-password"
          >
            Crear una cuenta
          </a>
        </div>
      </div>
    </div>
  );
}
