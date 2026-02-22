import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { UserAuthProvider } from './context/userAuthContext.jsx'
import { ChatProvider } from './context/chatContext.jsx'
import { SocketProvider } from './context/socketContext';

const token = localStorage.getItem("token");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserAuthProvider>
        <SocketProvider token={token}>
          <ChatProvider>
            <App />
          </ChatProvider>
        </SocketProvider>
      </UserAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
