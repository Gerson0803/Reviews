import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Pages/Login';
import Signup from '../Pages/SignUp';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default AppRoutes;
