# 💬 Real-Time Chat App
This repository contains a **real-time chat frontend** built with **React**, **Socket.IO Client**, and **Tailwind CSS**.  
It supports **1-on-1 chats**, **media messages**, **typing indicators**, **message delivery/read receipts**, **user blocking**, and **OTP-based email verification**.

---

## ✨ Features

### 🔐 User Authentication
- JWT-based authentication stored in `localStorage`.
- Login & Registration with full form validation.
- **OTP Email Verification** — triggered on signup and first login.
- Resend OTP support.
- Profile picture upload on registration.
- Toggle password visibility.

### ⚡ Real-Time Messaging (Socket.IO)
- Instant message delivery via persistent WebSocket connection.
- **Typing indicators** — animated bubble shown when the other user is typing.
- **Online presence** — green dot displayed on active users.
- **Message status ticks:**
  - ✓ Sent (single check)
  - ✓✓ Delivered (double check, grey)
  - ✓✓ Read (double check, blue)
- **Optimistic UI** — messages appear instantly before server confirmation, then reconciled with real server data.

### 📨 Chat & Messaging
- Start a new conversation with any registered user.
- Send text messages or **multiple images** in a single request.
- Image preview before sending, with per-image removal.
- Auto-scroll to latest message.
- **Paginated messages** — load older messages on demand.
- **Paginated chat list** — lazy-load more conversations.

### 🏗️ Chat Management
- Join / leave chat rooms in real-time.
- Sidebar chat list sorted by latest message time.
- Unread message count badge per conversation.
- Search across all registered users to start new chats.

### 🚫 Block System
- Users can block or unblock each other.
- Blocked users **cannot send messages** to each other.
- `blockedByMe` and `blockedByOtherUser` statuses are tracked.
- Blocked state is reflected **in real-time** for both parties.
- Block / unblock events appear as **inline system badges** in the chat window.
- Message input is replaced with a block notice when a user is blocked.

### 🖼️ Media Messages
- Send multiple images in one request.
- Optimistic preview shown immediately (with loading opacity) while upload is in progress.
- Temporary previews are replaced seamlessly with real server messages on success.
- Failed uploads are removed automatically.

---

## 🛠️ Tech Stack

- **React 18**
- **Tailwind CSS** (HSL CSS variable theming)
- **Socket.IO Client** (real-time messaging)
- **React Router v6** (routing)
- **Axios** (HTTP requests)
- **React Context + Hooks** (state management)
- **JWT** (authentication via `localStorage`)

---

## 🌐 Socket.IO Usage

- Connect using JWT token in the `Authorization` header.
- Each user automatically joins a personal room on connection.
- `online-users` event emits the list of currently online user IDs.
- Socket re-initializes automatically whenever the token changes.
- Chat room state is tracked so users leave rooms on disconnect.

### 📡 Socket Events

**Client → Server:**

| Event | Payload | Description |
|---|---|---|
| `join-chat` | `{ chatId }` | Join a chat room |
| `leave-chat` | `{ chatId }` | Leave a chat room |
| `new-message` | `{ chatId, content, type }` | Send a message |
| `typing` | `{ chatId }` | Notify typing started |
| `stop-typing` | `{ chatId }` | Notify typing stopped |
| `message-delivered` | `{ messageId }` | Acknowledge message delivery |

**Server → Client:**

| Event | Description |
|---|---|
| `message` | New message object |
| `new-chat` | Newly created chat object |
| `online-users` | Array of currently online user IDs |
| `message-delivered` | `{ messageId, deliveredAt }` |
| `message-seen` | `{ chatId, seenAt }` |
| `typing` | `{ chatId, userId }` |
| `stop-typing` | `{ chatId, userId }` |

## 📚 Developer Guide
[Download Developer Guide](https://drive.google.com/file/d/1x9BX4ciKlzzUWzInMJmV_xMuiYD0Aj8k/view?usp=sharing)
