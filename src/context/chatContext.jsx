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

    // Utility function to normalize IDs as strings
    const norm = (id) => id?.toString?.() ?? String(id ?? "");

    // Check if a message belongs to the current user
    const isMine = (msg) => {
        if (typeof msg.isMyMsg === "boolean") return msg.isMyMsg;
        if (myUserIdRef.current && msg.sender?._id)
            return norm(msg.sender._id) === norm(myUserIdRef.current);
        return false;
    };

    // Detect current user's ID from messages
    const detectMyId = (messages = []) => {
        if (myUserIdRef.current) return; // Already detected
        const mine = messages.find((m) => m.isMyMsg === true); // Find first message from me
        if (mine?.sender?._id) myUserIdRef.current = norm(mine.sender._id); // Store normalized ID in ref
    };

    // Sort messages in ascending order by creation time
    const sortAsc = (msgs = []) =>
        [...msgs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Replace temporary messages (with temp_ ID) with real messages from server
    const replaceTempMsg = (messages = [], realMsg) => {
        const realTime = new Date(realMsg.createdAt).getTime(); // Convert real message time to timestamp
        const filtered = messages.filter((m) => {
            if (!norm(m._id).startsWith("temp_")) return true; // Keep non-temp messages
            const tempTime = new Date(m.createdAt).getTime(); // Convert temp message time
            const timeDiff = Math.abs(tempTime - realTime); // Calculate time difference
            if (timeDiff < 10000) { // If temp message is within 10s of real message
                if (realMsg.type === "image" && m.type === "image") return false; // Remove temp image if real image exists
                if (realMsg.type === "text" && m.content === realMsg.content) return false; // Remove temp text if content matches
            }
            return true; // Keep other messages
        });
        // Avoid duplicate: if real message already exists, return filtered
        if (filtered.some((m) => norm(m._id) === norm(realMsg._id))) return filtered;
        return [...filtered, realMsg]; // Otherwise, append real message
    };

    // Mark messages as delivered or seen up to a certain time
    const markUpTo = (messages = [], time, { delivered = false, seen = false }) =>
        messages.map((m) => {
            if (!isMine(m)) return m;
            if (seen && m.isRead) return m;
            if (delivered && !seen && m.isDelivered) return m;
            const msgTime  = m.createdAt ? new Date(m.createdAt).getTime() : 0;
            const markTime = time ? new Date(time).getTime() : Infinity;
            if (msgTime > markTime) return m;
            return { 
                ...m, 
                ...(delivered ? { isDelivered: true } : {}),
                ...(seen ? { isDelivered: true, isRead: true } : {})
            };
    });

    // Socket event handlers
    useEffect(() => {
        if (!socket) return;
        
        socket.on("message", (msg) => {
            const chatId = norm(msg.chat);

            if (msg.isMyMsg && !msg.isDelivered && msg.type !== "label") {
                const receiverId = msg.receiver?._id;
                if (receiverId && socket.isUserOnline(receiverId)) {
                    msg.isDelivered = true;
                }
            }

            // Mark as delivered if incoming
            if (!msg.isMyMsg && !msg.isDelivered && msg.type !== "label") {
                socket.emit("message-delivered", { messageId: msg._id });
            }

            const nowBlocked = msg.content === "blocked";
            const blockedBy  = msg.isMyMsg ? "me" : "them";

            const applyBlock = (obj) => ({
                ...obj,
                isBlocked: nowBlocked,
                blockedBy: nowBlocked ? blockedBy : null,
            });

            const isTargetChat = (c) =>
                norm(c._id) === chatId ||
                norm(c._id) === norm(msg.chat?._id ?? msg.chat) ||
                norm(c.to?._id) === norm(msg.sender?._id ?? msg.sender);

            // Update chats list for block status
            setChats((prev) =>
                prev.map((c) => isTargetChat(c) ? applyBlock(c) : c)
            );

            // Update currently open chat for block
            setOneChat((prev) => {
                if (!prev) return prev;
                const matchById = norm(prev._id) === chatId ||
                                norm(prev._id) === norm(msg.chat?._id ?? msg.chat);
                const matchByUser = norm(prev.to?._id) === norm(msg.sender?._id ?? msg.sender);
                if (!matchById && !matchByUser) return prev;
                return applyBlock(prev);
            });

            // Update chats list with new message
            setChats((prev) => {
                const idx = prev.findIndex((c) => norm(c._id) === chatId);
                if (idx === -1) {
                    return [{
                        _id: msg.chat,
                        to: msg.sender,
                        messages: [msg],
                        lastMessageCreatedAt: msg.createdAt,
                        unreadMessagesCount: msg.isMyMsg ? 0 : 1,
                    }, ...prev];
                }

                const arr  = [...prev];
                const chat = { ...arr[idx] };

                // Add new message, remove duplicates/temp messages
                chat.messages = [msg, ...(chat.messages || []).filter(
                    (m) => norm(m._id) !== norm(msg._id) && !norm(m._id).startsWith("temp_")
                )];

                chat.lastMessageCreatedAt = msg.createdAt;
                chat.unreadMessagesCount  = isMine(msg) || norm(chatId) === norm(activeChatIdRef.current)
                    ? 0
                    : (chat.unreadMessagesCount || 0) + 1;

                arr.splice(idx, 1);
                return [chat, ...arr];
            });

            // Replace temp message in the currently open chat
            setOneChat((prev) => {
                if (!prev || norm(prev._id) !== chatId) return prev;
                return { ...prev, messages: replaceTempMsg(prev.messages || [], msg) };
            });
        });


        socket.on("messages-seen", ({ chatId, seenTime }) => {
            const cid = norm(chatId);
            const upd = (msgs) => markUpTo(msgs, seenTime, { seen: true });
            setChats((p) => p.map((c) => norm(c._id) === cid ? { ...c, messages: upd(c.messages) } : c));
            setOneChat((p) => p && norm(p._id) === cid ? { ...p, messages: upd(p.messages) } : p);
        });

        socket.on("typing", ({ chatId, userId, userName }) =>
            setTypingUsers((p) => ({ ...p, [norm(chatId)]: { userId, userName } }))
        );
        socket.on("stop-typing", ({ chatId }) =>
            setTypingUsers((p) => { const n = { ...p }; delete n[norm(chatId)]; return n; })
        );

        return () => {
            ["message","new-chat","message-delivered","messages-seen","typing","stop-typing"]
                .forEach((e) => socket.off(e));
        };
    }, [socket]);

    // APIs 
    const handleGetAllUsers = async (page = 1, limit = 10, search = "") => {
        setLoading(true);
        try {
            const res = await getAllUsers(page, limit, search);
            if (res?.success)
                setAllUsers(page === 1 ? res.data : (p) => [...p, ...res.data]);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleGetMyChats = async (page = 1, limit = 10, search = "") => {
        setLoading(true);
        try {
            const res = await getMyChats(page, limit, search);
            if (res?.success) {
                if (res.pagination) setChatsPagination(res.pagination);
                const data = res.data;
                if (page === 1) setChats(data);
                else setChats((prev) => {
                    const ids = new Set(prev.map((c) => c._id));
                    return [...prev, ...data.filter((c) => !ids.has(c._id))];
                });
                for (const chat of data) detectMyId(chat.messages || []);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleGetOneChat = async (id, noOfMessages) => {
        setLoading(true);
        try {
            const res = await getOneChat(id, noOfMessages);
            if (res?.success) {
                const raw = res.data;
                // Backend returns: blocked, blockedByMe, blockedByOtherUser
                // We map them to our standard: isBlocked, blockedBy
                const blockState = {
                    isBlocked: raw.blocked ?? false,
                    blockedBy: raw.blockedByMe ? "me" : raw.blockedByOtherUser ? "them" : null,
                };
                const data = {
                    ...raw,
                    messages: sortAsc(raw.messages || []),
                    ...blockState,
                };
                detectMyId(data.messages);
                setOneChat(data);
                setMessagesPagination(null);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleGetChatMessages = async (id, page = 1, limit = 20) => {
        setLoading(true);
        try {
            const res = await getChatMessages(id, page, limit);
            if (res?.success) {
                if (res.pagination) setMessagesPagination(res.pagination);
                const newMsgs = sortAsc(res.data || []);
                detectMyId(newMsgs);

                setOneChat((prev) => {
                    const base = prev || { _id: id };
                    if (page === 1) return { ...base, messages: newMsgs };
                    const existingIds = new Set((base.messages || []).map((m) => norm(m._id)));
                    const uniqueNew   = newMsgs.filter((m) => !existingIds.has(norm(m._id)));
                    return { ...base, messages: sortAsc([...uniqueNew, ...(base.messages || [])]) };
                });
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };


    const addOptimisticMessage = (tempMsg) => {
        setOneChat((prev) => {
            if (!prev) return prev;
            return { ...prev, messages: [...(prev.messages || []), tempMsg] };
        });
    };

    const markMessagesAsRead = (chatId) => {
        activeChatIdRef.current = chatId;
        setChats((prev) =>
            prev.map((c) => norm(c._id) === norm(chatId) ? { ...c, unreadMessagesCount: 0 } : c)
        );
    };

    const resetOneChat = () => {
        activeChatIdRef.current = null;
        setOneChat(null);
        setMessagesPagination(null);
    };

    const clearActiveChat = () => {
        activeChatIdRef.current = null;
    };

    //  block / unblock
    const handleBlock = async (userId) => {
        setBlockActionLoading(true);
        try {
            const res = await blockUser(userId);
            if (res?.success) {
                setChats((prev) =>
                    prev.map((c) =>
                        norm(c.to?._id) === norm(userId)
                            ? { ...c, isBlocked: true, blockedBy: "me" }
                            : c
                    )
                );
                setOneChat((prev) =>
                    prev && norm(prev.to?._id) === norm(userId)
                        ? { ...prev, isBlocked: true, blockedBy: "me" }
                        : prev
                );
            }
            return res;
        } catch (e) {
            console.error("blockUser error:", e);
            throw e;
        } finally {
            setBlockActionLoading(false);
        }
    };

    const handleUnblock = async (userId) => {
        setBlockActionLoading(true);
        try {
            const res = await unblockUser(userId);
            if (res?.success) {
                setChats((prev) =>
                    prev.map((c) =>
                        norm(c.to?._id) === norm(userId)
                            ? { ...c, isBlocked: false, blockedBy: null }
                            : c
                    )
                );
                setOneChat((prev) =>
                    prev && norm(prev.to?._id) === norm(userId)
                        ? { ...prev, isBlocked: false, blockedBy: null }
                        : prev
                );
            }
            return res;
        } catch (e) {
            console.error("unblockUser error:", e);
            throw e;
        } finally {
            setBlockActionLoading(false);
        }
    };

    const value = {
        loading, chats, chatsPagination, oneChat,
        allUsers, messagesPagination, typingUsers,
        blockActionLoading,
        handleGetAllUsers, handleGetMyChats,
        handleGetOneChat, handleGetChatMessages,
        handleSendMedia, addOptimisticMessage,
        markMessagesAsRead, resetOneChat, clearActiveChat,
        handleBlock, handleUnblock
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};