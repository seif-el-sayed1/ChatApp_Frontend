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

  // Emit a socket event safely (only if connected)
  const emit = (event, data) => {
    const s = socketRef.current;
    if (s?.connected) {
      s.emit(event, data);
    } else {
      console.warn(`⚠️ Socket not connected — cannot emit "${event}"`);
    }
  };

  // Helper functions for subscribing/unsubscribing events
  const on  = (event, cb) => socketRef.current?.on(event, cb);
  const off = (event, cb) => socketRef.current?.off(event, cb);
  
  // Custom socket actions for chat
  const joinChat = (chatId) => emit("join-chat", { chatId });
  const leaveChat = (chatId) => emit("leave-chat", { chatId });
  const sendMessage = (payload) => emit("new-message", payload);
  const startTyping = (chatId) => emit("typing", { chatId });
  const stopTyping = (chatId) => emit("stop-typing", { chatId });
  const markMsgDelivered = (messageId) => emit("message-delivered", { messageId });

  // Check if a user is online
  const isUserOnline = (userId) => !!userId && onlineUsers.includes(userId.toString());

  const value = {
      isConnected,
      onlineUsers,
      isUserOnline,
      on,
      off,
      emit,      
      joinChat,
      leaveChat,
      sendMessage,      
      startTyping,
      stopTyping,
      markMsgDelivered
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
