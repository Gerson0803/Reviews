import React, { useState } from "react";
import "./Styles/SignUp.css";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function SignUp() {
  const [openBook, setOpenBook] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleGoogleSuccess = (credentialResponse) => {
    // Aquí puedes enviar el token a tu backend o manejar el login
    alert("Inicio de sesión con Google exitoso");
    // console.log(credentialResponse);
  };

  const handleGoogleError = () => {
    alert("Error al iniciar sesión con Google");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    if (!response.ok) {
      throw new Error("Error en el registro");
    }

    const data = await response.json();
    alert(`Usuario ${data.name} registrado con éxito.`);
    console.log("Respuesta del backend:", data);

    // Si quieres redirigir al login después de registrarse
    // window.location.href = "/login";

  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al registrar el usuario.");
  }
};


  return (
    <div className="signup-container">
      <div className={`book ${openBook ? "open" : ""}`}>

        <div className={`page left ${openBook ? "moved" : ""}`}>
          {!openBook ? (
            <>
              <h1 className="welcome-title">¡Bienvenido a MyReviews!</h1>
              <p className="welcome-text">
                Únete a nuestra comunidad y comparte tu opinión sobre productos.
              </p>
              <button className="open-btn" onClick={() => setOpenBook(true)}>
                Registrarse
              </button>
            </>
          ) : (
            <div className="lefty">
              <h2>Comparte tu opinión</h2>
              <p>
                Nuestra aplicación te permite expresar lo que piensas sobre
                diferentes productos y ayudar a otros a tomar mejores decisiones.
              </p>

              <p className="login-prompt">
                Ya tienes una cuenta?{" "}
                <span
                  className="login-link"
                  onClick={() => (window.location.href = "/login")}
                >
                  Iniciar sesión
                </span>
              </p>

            </div>
          )}
        </div>


          <div className={`page right ${openBook ? "show" : ""}`}>

            <h2>Crea tu cuenta</h2>
            <form onSubmit={handleSubmit} className="signup-form">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Correo"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Verificar contraseña"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="submit">Registrar</button>
            </form>
            <div className="google-btn">
            <GoogleOAuthProvider clientId="TU_CLIENT_ID_DE_GOOGLE">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                width="200"
                text="signup_with"
                shape="pill"
                theme="filled_blue"
              />
            </GoogleOAuthProvider>
          </div>
          </div>
        
      </div>
    </div>
  );
}
