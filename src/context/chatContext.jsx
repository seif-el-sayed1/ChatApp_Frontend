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