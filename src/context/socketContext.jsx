import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../utils/constants";

const SocketContext = createContext();

export const UseSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
};

export const SocketProvider = ({ children, token }) => {
  const socketRef = useRef(null);        
  const [isConnected, setIsConnected] = useState(false);  
  const [onlineUsers, setOnlineUsers] = useState([]);     

  // useEffect to initialize the socket connection whenever the token changes
  useEffect(() => {
    if (!token) return; 

    // Clean up previous socket if it exists
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.removeAllListeners();
    }

    // Create a new socket
    const s = io(BACKEND_URL, {
      extraHeaders: { Authorization: token },
    });

    socketRef.current = s;

    // Listen for socket events
    s.on("connect", () => { 
      setIsConnected(true);
    });
    s.on("disconnect", () => { 
      console.log("❌ Socket disconnected"); 
      setIsConnected(false); 
    });
    // log errors
    s.on("error", (err) => { 
      console.error("🔴 Socket error:", err); 
    });
    // get online users
    s.on("online-users", (ids => { 
      setOnlineUsers(ids);
    }));

    // Cleanup function when component unmounts or token changes
    return () => {
      s.disconnect();
      s.removeAllListeners();
    };
  }, [token]);


};
