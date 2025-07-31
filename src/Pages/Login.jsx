import { Link } from 'react-router-dom';

function Login() {
  return (
    <div>
      <h1>Aquí va el Login</h1>
      <p>
        ¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link>
      </p>
    </div>
  );
}

export default Login;
