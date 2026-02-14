// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './types';
import { ProtectedRoute } from './protectedRoutes';

// Pages
import { SignUp } from '../pages/SignUp';
import { Chats } from '../pages/Chats';


export function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path={ROUTES.LOGIN} element={<SignUp />} />
      
      {/* Protected Route */}
      <Route 
        path={ROUTES.CHATS} 
        element={
          <ProtectedRoute>
            <Chats />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}