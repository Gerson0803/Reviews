import { Link } from 'react-router-dom';

function Signup() {
  return (
    <div>
      <h1>Aquí va el Signup</h1>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}

export default Signup;
