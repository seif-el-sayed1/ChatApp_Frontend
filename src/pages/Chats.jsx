import { useEffect, useRef, useState, useCallback } from "react";
import { UseChat } from "../context/chatContext";
import { UseSocket } from "../context/socketContext";
import { UserAuth } from "../context/userAuthContext"; 
import profilePic from "../assets/profilePicture.jpg";

// Normalize any ID to a plain string for safe comparison
const norm = (id) => id?.toString?.() ?? String(id ?? "");

// for last message time in chat list
const fmtTime = (iso) => {
  if (!iso) return "";
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (diff < 1)    return "now";
  if (diff < 60)   return `${diff}m`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h`;
  return new Date(iso).toLocaleDateString("en-US");
};

// for message time
const fmtMsgTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

// icons 
const Ico = ({ d, size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {[].concat(d).map((path, i) => <path key={i} d={path} />)}
  </svg>
);
const CheckOne = (p) => <Ico {...p} d="M20 6 9 17l-5-5" />;
const CheckTwo = (p) => <Ico {...p} d={["M18 6 7 17l-5-5","m22 10-7.5 7.5L13 16"]} />;
const SendIco  = ()  => <Ico d={["m22 2-7 20-4-9-9-4Z","M22 2 11 13"]} />;
const ImgIco   = ()  => <Ico d={["M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21","M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"]} />;
const BackIco  = ()  => <Ico d="m15 18-6-6 6-6" />;
const CloseIco = ()  => <Ico d={["M18 6 6 18","m6 6 12 12"]} />;
const MoreIco  = ()  => <Ico d={["M12 5h.01","M12 12h.01","M12 19h.01"]} strokeWidth={3} />;
const BlockIco = ({ className = "" }) => (
  <Ico 
    d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM4.93 4.93l14.14 14.14" 
    className={className}
  />
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const BubbleIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const UnblockIco = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
  </svg>
);

const LogoutIco = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const Avatar = ({ src, size = "w-12 h-12", online = false }) => (
  <div className="relative shrink-0">
    <img src={src || profilePic} className={`${size} rounded-full object-cover`} alt="" />
    {online && <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
  </div>
);

// Shows delivery/read status ticks — only visible on sent messages
// temp_ prefix means the message is still optimistic (not yet confirmed by server)
const MsgStatus = ({ msg }) => {
  if (!msg.isMyMsg) return null;
  if (norm(msg._id).startsWith("temp_")) return <CheckOne className="text-white/40" />;
  if (msg.isRead) return <CheckTwo className="text-blue-600" />;
  if (msg.isDelivered) return <CheckTwo className="text-white/60" />;
  return <CheckOne className="text-white/60" />;
};

const TypingBubble = ({ avatar }) => (
  <div className="flex gap-2 items-end">
    <Avatar src={avatar} size="w-8 h-8" />
    <div className="bg-white rounded-2xl rounded-tl-none shadow-sm px-4 py-3 flex gap-1.5 items-center">
      {[0, 150, 300].map((d) => (
        <span key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${d}ms` }} />
      ))}
    </div>
  </div>
);

// Logout Confirm Modal 
const LogoutModal = ({ onConfirm, onCancel, loading }) => (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    onClick={(e) => e.target === e.currentTarget && onCancel()}
  >
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 flex flex-col items-center gap-4 animate-[fadeScaleIn_0.18s_ease]">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <LogoutIco />
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-800 text-base">Log out?</p>
        <p className="text-gray-400 text-sm mt-1">Are you sure you want to sign out of your account?</p>
      </div>
      <div className="flex gap-3 w-full mt-1">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600
            hover:bg-gray-50 active:scale-95 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold
            active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading
            ? <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            : <>
                <LogoutIco />
                Log out
              </>
          }
        </button>
      </div>
    </div>
  </div>
);

// main 
export const Chats = () => {
  const {
    loading, chats, chatsPagination, oneChat,
    allUsers, messagesPagination, typingUsers,
    blockActionLoading,
    handleGetAllUsers, handleGetMyChats,
    handleGetOneChat, handleGetChatMessages,
    handleSendMedia, addOptimisticMessage,
    markMessagesAsRead, resetOneChat, clearActiveChat,
    handleBlock, handleUnblock
  } = UseChat();

  const {
    isConnected, isUserOnline,
    on, off,
    joinChat, leaveChat,
    sendMessage, startTyping, stopTyping
  } = UseSocket();

  const { handleLogout } = UserAuth();

  // states
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [chatsPage, setChatsPage] = useState(1);
  const [msgInput, setMsgInput] = useState("");
  const [isTypingLocal, setIsTypingLocal] = useState(false);
  const [imgFiles, setImgFiles] = useState([]);
  const [sendingMedia, setSendingMedia] = useState(false);
  const [msgsPage, setMsgsPage] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const typingTimer = useRef(null);
  const prevChatId = useRef(null);
  const prevMsgCount = useRef(0);
  const isFirstLoad = useRef(true);
  const menuRef = useRef(null);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const isNearBottom = () => {
    const a = messagesAreaRef.current;
    return !a || a.scrollHeight - a.scrollTop - a.clientHeight < 150;
  };

  useEffect(() => {
    handleGetMyChats(1, 10, searchQuery);
    setChatsPage(1);
  }, [searchQuery]);

  // When a chat is selected: leave the previous chat room, join the new one,
  // and fetch messages only if they aren't already loaded
  useEffect(() => {
    if (!selectedChatId) return;

    const alreadyLoaded = oneChat?._id && norm(oneChat._id) === norm(selectedChatId);

    if (prevChatId.current && prevChatId.current !== selectedChatId) {
      leaveChat(prevChatId.current);
      clearActiveChat();
    }
    prevChatId.current = selectedChatId;

    if (alreadyLoaded) {
      joinChat(selectedChatId);
      markMessagesAsRead(selectedChatId);
      return () => { stopTyping(selectedChatId); };
    }

    resetOneChat();
    handleGetOneChat(selectedChatId, 10).then(() => {
        handleGetChatMessages(selectedChatId, 1, 20);
    });
    joinChat(selectedChatId);
    markMessagesAsRead(selectedChatId);
    prevMsgCount.current = 0;
    return () => { stopTyping(selectedChatId); };
  }, [selectedChatId]);

  useEffect(() => {
    if (!selectedChatId) return;
    const handler = (msg) => {
      if (!msg.isMyMsg && norm(msg.chat) === norm(selectedChatId)) {
        markMessagesAsRead(selectedChatId);
      }
    };
    on("message", handler);
    return () => off("message", handler);
  }, [selectedChatId]);

  // Scroll to bottom on first load (instant) or when a new message arrives and user is near the bottom
  useEffect(() => {
    const count = oneChat?.messages?.length ?? 0;
    if (count === 0) return;

    if (isFirstLoad.current) {
      scrollToBottom("instant");
      isFirstLoad.current = false;
    } else if (count > prevMsgCount.current && isNearBottom()) {
      scrollToBottom("smooth");
    }

    prevMsgCount.current = count;
  }, [oneChat?.messages?.length]);

  useEffect(() => {
    const cid = norm(selectedChatId ?? "");
    const isTyping = !!typingUsers[cid];
    if (isTyping && isNearBottom()) scrollToBottom();
  }, [typingUsers]);

  // After sending the first message to a new user, the server creates a chat —
  // this effect detects the new chat ID and switches to it automatically
  useEffect(() => {
    if (oneChat?._id && !selectedChatId && selectedUser) {
      const newChatId = norm(oneChat._id);
      if (prevChatId.current && prevChatId.current === newChatId) return;
      setSelectedChatId(newChatId);
      setSelectedUser(null);
      joinChat(newChatId);
    }
  }, [oneChat?._id]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // handlers
  const handleSelectChat = (chatId) => {
    isFirstLoad.current = true;
    setSelectedChatId(chatId);
    setSelectedUser(null);
    setShowChat(true);
    setMsgsPage(1);
  };

  const handleBack = () => {
    if (selectedChatId) { leaveChat(selectedChatId); stopTyping(selectedChatId); }
    clearActiveChat();
    setSelectedChatId(null);
    setSelectedUser(null);
    setShowChat(false);
    setMsgInput("");
    setImgFiles([]);
    clearTimeout(typingTimer.current);
  };

  const handleChatsScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const hasMore = chatsPagination && chatsPagination.page < chatsPagination.totalPages;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !loading && hasMore) {
      const next = chatsPage + 1;
      setChatsPage(next);
      handleGetMyChats(next, 10, searchQuery);
    }
  };

  // When user scrolls to the top, load older messages while preserving the current scroll position
  const handleMessagesScroll = (e) => {
    const { scrollTop } = e.target;
    const hasMore = messagesPagination &&
      messagesPagination.currentPage < messagesPagination.totalPages;
    if (scrollTop === 0 && !loading && hasMore && selectedChatId) {
      const prevH = messagesAreaRef.current.scrollHeight;
      const nextPage = msgsPage + 1;
      setMsgsPage(nextPage);
      handleGetChatMessages(selectedChatId, nextPage, 20)
        .then(() => setTimeout(() => {
          if (messagesAreaRef.current)
            messagesAreaRef.current.scrollTop =
              messagesAreaRef.current.scrollHeight - prevH;
        }, 80));
    }
  };

  // Emit typing events to the server; debounce the stop-typing signal by 2s
  const handleInputChange = (e) => {
    setMsgInput(e.target.value);
    if (!selectedChatId) return;
    if (!isTypingLocal) { setIsTypingLocal(true); startTyping(selectedChatId); }
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setIsTypingLocal(false);
      stopTyping(selectedChatId);
    }, 2000);
  };

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImgFiles(files.map((f) => ({ file: f, url: URL.createObjectURL(f) })));
    e.target.value = "";
  };

  const cancelImages = () => {
    imgFiles.forEach((f) => URL.revokeObjectURL(f.url));
    setImgFiles([]);
  };

  // Handles both image uploads and text messages.
  // For text: adds an optimistic message immediately so the UI feels instant,
  // then sends via socket. For images: uploads via API then cancels preview.
  const handleSend = async () => {
    if (!isConnected) return;

    if (imgFiles.length > 0) {
      setSendingMedia(true);
      try {
        const mediaReceiverId = oneChat?.to?._id || selectedUser?._id;
        await handleSendMedia({
          files: imgFiles.map((f) => f.file),
          chatId: selectedChatId || undefined,
          receiverId: (!selectedChatId && selectedUser) ? selectedUser._id : undefined,
          isReceiverOnline: mediaReceiverId ? isUserOnline(mediaReceiverId) : false, 
        });
        cancelImages();
      } finally {
        setSendingMedia(false);
      }
      return;
    }

    const trimmed = msgInput.trim();
    if (!trimmed) return;

    if (!selectedChatId && selectedUser) {
      sendMessage({ content: trimmed, otherUserId: selectedUser._id, type: "text" });
      setMsgInput("");
      return;
    }
    if (!selectedChatId) return;

    const receiverId = oneChat?.to?._id;
    const isReceiverOnline = receiverId && isUserOnline(receiverId);

    addOptimisticMessage({
      _id: `temp_${Date.now()}`,
      chat: selectedChatId,
      content: trimmed,
      type: "text",
      isMyMsg: true,
      isDelivered: isReceiverOnline,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    sendMessage({ content: trimmed, chatId: selectedChatId, type: "text" });
    setMsgInput("");
    setIsTypingLocal(false);
    stopTyping(selectedChatId);
    clearTimeout(typingTimer.current);
    setTimeout(scrollToBottom, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleBlockToggle = async () => {
    if (!activeUserId || blockActionLoading) return;
    setShowMenu(false);
    try {
      if (blockedByMe) {
        await handleUnblock(activeUserId);
      } else {
        await handleBlock(activeUserId);
      }
    } catch (e) {
      console.error("block/unblock failed:", e);
    }
  };

  const confirmLogout = () => {
    handleLogout();
  };

  // Derived values from the active chat — works for both existing chats and new (selectedUser) flows
  const activeUserId = oneChat?.to?._id || selectedUser?._id;
  const activeName = oneChat?.to?.fullName || selectedUser?.firstName + " " + selectedUser?.lastName;
  const activeAvatar = oneChat?.to?.profilePicture || selectedUser?.profilePicture;
  const currentTyping = typingUsers[norm(selectedChatId ?? "")];
  const onlineChats = chats.filter((c) => isUserOnline(c.to?._id)).slice(0, 8);
  const isBlocked = !!oneChat?.isBlocked;
  const blockedByMe = oneChat?.blockedBy === "me";
  const blockedByThem = oneChat?.blockedBy === "them";
  const canSend = isConnected && !sendingMedia && !isBlocked && (!!msgInput.trim() || imgFiles.length > 0);
  const showChatPanel = (selectedChatId && oneChat) || selectedUser; // show panel for existing or brand-new chats

  const chatLastMsg = (chat) => {
    const m = chat.messages?.[0];
    if (!m) return { text: "", isMe: false };
    const isMe = m.isMyMsg;
    const text = m.type === "image" ? "📷 Photo" : (m.content || "");
    return { text, isMe };
  };

  return (
    <div className="flex h-screen relative overflow-hidden">

      {showLogoutModal && (
        <LogoutModal
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
          loading={logoutLoading}
        />
      )}

      {showAllUsers && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end lg:items-center lg:justify-end"
          onClick={(e) => e.target === e.currentTarget && setShowAllUsers(false)}>
          <div className="bg-white w-full max-w-sm h-[85vh] lg:h-[90vh] rounded-t-3xl lg:rounded-2xl lg:m-4 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="font-semibold">New Chat</p>
              <button onClick={() => setShowAllUsers(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <CloseIco />
              </button>
            </div>
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                <SearchIcon /><input className="flex-1 bg-transparent outline-none text-sm"
                  placeholder="Search people…"
                  onChange={(e) => handleGetAllUsers(1, 10, e.target.value)} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {loading && !allUsers.length ? (
                <div className="flex justify-center p-10">
                  <div className="w-7 h-7 rounded-full border-2 border-t-[hsl(var(--primary-color))] animate-spin" />
                </div>
              ) : !allUsers.length ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <UsersIcon /><p className="text-sm">No users found</p>
                </div>
              ) : allUsers.map((user) => (
                <div key={user._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => {
                    // If a chat with this user already exists, open it; otherwise start a new one
                    const existing = chats.find((c) => norm(c.to?._id) === norm(user._id));
                    if (existing) handleSelectChat(existing._id);
                    else { setSelectedUser(user); setSelectedChatId(null); setShowChat(true); }
                    setShowAllUsers(false);
                  }}>
                  <Avatar src={user.profilePicture} size="w-11 h-11" online={isUserOnline(user._id)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user.firstName + " " + user.lastName}</p>
                    <p className="text-gray-400 text-xs truncate">{user.email}</p>
                  </div>
                  {isUserOnline(user._id) && <span className="text-xs text-green-500 shrink-0">Online</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`${showChat ? "hidden lg:flex" : "flex"} flex-col flex-[4] w-full lg:w-auto border-r border-gray-200`}>

        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[hsl(var(--primary-color))] flex items-center justify-center shadow-[0_4px_12px_hsl(var(--primary-color)/0.35)]">
              <BubbleIcon size={22} />
            </div>
            <p className="font-bold text-lg">Chats</p>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => { setShowAllUsers(true); handleGetAllUsers(1, 10, ""); }}
              className="p-2 hover:bg-gray-100 rounded-xl transition">
              <UsersIcon />
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              title="Log out"
              className="p-2 hover:bg-red-50 rounded-xl transition text-gray-400 hover:text-red-500 active:scale-95"
            >
              <LogoutIco />
            </button>
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2.5
            border-2 border-transparent focus-within:border-[hsl(var(--primary-color))] transition-colors">
            <SearchIcon />
            <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Search…"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {onlineChats.length > 0 && (
          <div className="px-4 pb-3">
            <p className="text-gray-400 text-xs font-medium mb-2">Online</p>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {onlineChats.map((c) => (
                <button key={c._id} onClick={() => handleSelectChat(c._id)}
                  className="flex flex-col items-center gap-1 min-w-fit cursor-pointer">
                  <Avatar src={c.to?.profilePicture} size="w-11 h-11" online />
                  <p className="text-xs text-gray-500 w-14 truncate text-center">{c.to?.fullName}</p>
                </button>
              ))}
            </div>
            <hr className="mt-3 border-gray-100" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto" onScroll={handleChatsScroll}>
          {loading && !chats.length ? (
            <div className="flex justify-center p-10">
              <div className="w-8 h-8 rounded-full border-2 border-t-[hsl(var(--primary-color))] animate-spin" />
            </div>
          ) : !chats.length ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 py-16">
              <BubbleIcon /><p>No conversations yet</p>
            </div>
          ) : chats.map((chat) => {
            const { text: lastText, isMe } = chatLastMsg(chat);
            const isSelected = selectedChatId === chat._id;
            const isTypingInList = !!typingUsers[norm(chat._id)];
            return (
              <div key={chat._id} onClick={() => handleSelectChat(chat._id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition
                  ${isSelected ? "bg-[hsl(var(--primary-color)/0.08)] border-r-2 border-[hsl(var(--primary-color))]" : "hover:bg-gray-50"}`}>
                <Avatar src={chat.to?.profilePicture} size="w-14 h-14" online={isUserOnline(chat.to?._id)} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{chat.to?.fullName || "Unknown"}</p>
                  <p className="text-gray-400 text-xs truncate mt-0.5">
                    {isTypingInList
                      ? <span className="text-[hsl(var(--primary-color))]">typing…</span>
                      : <>{isMe && "You: "}{lastText}</>
                    }
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <p className="text-xs text-gray-400">{fmtTime(chat.lastMessageCreatedAt)}</p>
                  {chat.unreadMessagesCount > 0 && !isSelected && (
                    <span className="bg-[hsl(var(--primary-color))] text-white text-xs
                      rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-medium">
                      {chat.unreadMessagesCount > 99 ? "99+" : chat.unreadMessagesCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {loading && chats.length > 0 && (
            <div className="flex justify-center p-4">
              <div className="w-5 h-5 rounded-full border-2 border-t-[hsl(var(--primary-color))] animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className={`${showChat ? "flex" : "hidden lg:flex"} flex-col flex-[6] w-full lg:w-auto`}>
        {showChatPanel ? (
          <>
            <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="lg:hidden p-1 hover:bg-gray-100 rounded-lg">
                  <BackIco />
                </button>
                <Avatar src={activeAvatar} size="w-11 h-11" online={isUserOnline(activeUserId)} />
                <div>
                  <p className="font-semibold text-sm leading-tight">{activeName}</p>
                  {currentTyping ? (
                    <p className="text-xs text-[hsl(var(--primary-color))] animate-pulse">typing…</p>
                  ) : (
                    <p className={`text-xs ${isUserOnline(activeUserId) ? "text-green-500" : "text-gray-400"}`}>
                      {isUserOnline(activeUserId) ? "Online" : "Offline"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
                  title={isConnected ? "Connected" : "Disconnected"} />
                {selectedChatId && (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowMenu((v) => !v)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500">
                      <MoreIco />
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
                        {blockedByThem ? (
                          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                              <BlockIco className="text-gray-400" size={15} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500">Blocked</p>
                              <p className="text-[10px] text-gray-400">This user blocked you</p>
                            </div>
                          </div>
                        ) : blockedByMe ? (
                          <button
                            onClick={handleBlockToggle}
                            disabled={blockActionLoading}
                            className="w-full flex items-center gap-3 px-4 py-3 transition bg-green-50 hover:bg-green-100 active:bg-green-200 disabled:opacity-50 group">
                            <div className="w-8 h-8 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center shrink-0 transition">
                              {blockActionLoading
                                ? <div className="w-4 h-4 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
                                : <UnblockIco />
                              }
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-green-700">Unblock User</p>
                              <p className="text-[10px] text-green-500">Allow messages again</p>
                            </div>
                          </button>
                        ) : (
                          <button
                            onClick={handleBlockToggle}
                            disabled={blockActionLoading}
                            className="w-full flex items-center gap-3 px-4 py-3 transition hover:bg-red-50 active:bg-red-100 disabled:opacity-50 group">
                            <div className="w-8 h-8 rounded-full bg-red-100 group-hover:bg-red-200 flex items-center justify-center shrink-0 transition">
                              {blockActionLoading
                                ? <div className="w-4 h-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                                : <BlockIco className="text-red-500" size={15} />
                              }
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-red-600">Block User</p>
                              <p className="text-[10px] text-red-400">Stop receiving messages</p>
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div ref={messagesAreaRef} onScroll={handleMessagesScroll}
              className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-2.5">

              {messagesPagination && messagesPagination.currentPage < messagesPagination.totalPages && (
                <button disabled={loading}
                  onClick={() => {
                    const nextPage = msgsPage + 1;
                    setMsgsPage(nextPage);
                    handleGetChatMessages(selectedChatId, nextPage, 20);
                  }}
                  className="self-center text-xs text-gray-400 hover:text-gray-600 py-1 px-3 rounded-full hover:bg-gray-200 transition mb-1">
                  {loading 
                    ? <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-500 animate-spin" />
                    : "↑ older messages"
                  }
                </button>
              )}

              {loading && !oneChat?.messages?.length ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-t-[hsl(var(--primary-color))] animate-spin" />
                </div>
              ) : !oneChat?.messages?.length ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <BubbleIcon /><p className="text-sm">No messages yet — say hi! 👋</p>
                </div>
              ) : oneChat.messages.map((msg) => {
                // System messages for block/unblock events — rendered as a centered badge instead of a bubble
                if (msg.content === "blocked" || msg.content === "unblocked") {
                  const isUnblock = msg.content?.toLowerCase().includes("unblock");
                  return (
                    <div key={msg._id} className="flex items-center justify-center gap-2.5 my-2">
                      <div className="h-px flex-1 bg-gray-200" />
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold select-none
                        ${isUnblock
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : "bg-red-50 text-red-500 border border-red-200"
                        }`}>
                        {isUnblock
                          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                          : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM4.93 4.93l14.14 14.14"/></svg>
                        }
                        {msg.content}
                      </div>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  );
                }
                return (
                  <div key={msg._id}
                    className={`flex gap-2 items-end ${msg.isMyMsg ? "justify-end" : "justify-start"}`}>
                    {!msg.isMyMsg && <Avatar src={activeAvatar} size="w-7 h-7" />}
                    <div className={`max-w-[72%] ${msg.isMyMsg
                      ? "bg-[hsl(var(--primary-color))] text-white rounded-2xl rounded-br-sm"
                      : "bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm"
                    } px-3 py-2`}>
                      {msg.type === "image" ? (
                        <img src={msg.content} alt=""
                          className={`rounded-xl max-w-full max-h-64 object-cover ${msg._isBlob ? "opacity-60" : ""}`} />
                      ) : (
                        <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                      )}
                      <div className={`flex items-center gap-1 mt-0.5 ${msg.isMyMsg ? "justify-end" : "justify-start"}`}>
                        <span className={`text-[10px] ${msg.isMyMsg ? "text-white/55" : "text-gray-400"}`}>
                          {fmtMsgTime(msg.createdAt)}
                        </span>
                        <MsgStatus msg={msg} />
                      </div>
                    </div>
                  </div>
                );
              })}

              {currentTyping && <TypingBubble avatar={activeAvatar} />}
              <div ref={messagesEndRef} />
            </div>

            {imgFiles.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 flex items-center gap-3 flex-wrap">
                {imgFiles.map((f, i) => (
                  <div key={i} className="relative">
                    <img src={f.url} className="w-16 h-16 rounded-xl object-cover border border-gray-200" alt="" />
                    <button onClick={() => {
                      URL.revokeObjectURL(f.url);
                      setImgFiles((prev) => prev.filter((_, j) => j !== i));
                    }} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs leading-none">
                      ×
                    </button>
                  </div>
                ))}
                <button onClick={cancelImages} className="text-xs text-gray-400 hover:text-gray-600 ml-auto">
                  Clear all
                </button>
              </div>
            )}

            <div className="border-t border-gray-100 p-3">
              {isBlocked ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <BlockIco className="text-red-500" size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-600 leading-tight">
                      {blockedByMe ? "You blocked this user" : "You can't send messages"}
                    </p>
                    <p className="text-[11px] text-red-400 mt-0.5">
                      {blockedByMe ? "Unblock them to start chatting again" : "This user is no longer available"}
                    </p>
                  </div>
                  {blockedByMe && (
                    <button
                      onClick={handleBlockToggle}
                      disabled={blockActionLoading}
                      className="shrink-0 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition px-3 py-1.5 rounded-xl disabled:opacity-50">
                      {blockActionLoading
                        ? <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        : "Unblock"
                      }
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-xl transition shrink-0 text-gray-500 hover:text-[hsl(var(--primary-color))]">
                    <ImgIco />
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagePick} />
                  </label>
                  <input value={msgInput} onChange={handleInputChange} onKeyDown={handleKeyDown}
                    disabled={!isConnected || imgFiles.length > 0}
                    placeholder={imgFiles.length > 0 ? `${imgFiles.length} image(s) ready` : "Message…"}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-100 text-sm outline-none
                      focus:ring-2 focus:ring-[hsl(var(--primary-color))] transition disabled:opacity-50" />
                  <button onClick={handleSend} disabled={!canSend}
                    className="bg-[hsl(var(--primary-color))] text-white p-2.5 rounded-2xl
                      hover:opacity-90 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
                    {sendingMedia
                      ? <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      : <SendIco />}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex-col items-center justify-center text-gray-400 gap-3 hidden lg:flex">
            <BubbleIcon size={96} />
            <p className="text-lg font-light">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};