// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { ROUTES } from './types';

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return children;
}