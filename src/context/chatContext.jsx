import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getAllUsers, getMyChats, getOneChat, getChatMessages } from "../services/chatService";
import { sendMediaMessage } from "../services/chatService";
import { blockUser, unblockUser } from "../services/actionsService";
import { UseSocket } from "./socketContext";

const ChatContext = createContext();

export const UseChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used within ChatProvider");
    return ctx;
};

export const ChatProvider = ({ children }) => {
    const socket = UseSocket(); 

    // State variables
    const [chats, setChats] = useState([]);
    const [chatsPagination, setChatsPagination] = useState(null); 
    const [oneChat, setOneChat] = useState(null); 
    const [allUsers, setAllUsers] = useState([]); 
    const [messagesPagination, setMessagesPagination] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const [typingUsers, setTypingUsers] = useState({}); 
    const [blockActionLoading, setBlockActionLoading] = useState(false); 

    // Refs
    const activeChatIdRef = useRef(null);
    const myUserIdRef = useRef(null); 

   
};