import axios from "axios";
import { BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";

const CHAT_ROUTE = BASE_URL + "/chats";

const api = axios.create({
    baseURL: CHAT_ROUTE,
    headers: {
        "Content-Type": "application/json"
    }
});

// interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = token;
    }
    return config;
});

// get users for chat
export const getAllUsers = async (page, limit, search) => {
    const response = await api.get(`/users?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
};

// get my chats
export const getMyChats = async (page, limit, search) => {
    const response = await api.get(`?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
};

// get one chat
export const getOneChat = async (id, noOfMessages) => {
    const response = await api.get(`/${id}?noOfMessages=${noOfMessages}`);
    return response.data;
};

// get chat messages
export const getChatMessages = async (id, page, limit = 20) => {
    const response = await api.get(`/${id}/messages?page=${page}&limit=${limit}`);
    return response.data;
};

// send media message
export const sendMediaMessage = async ({ media, receiverId, chatId }) => {
    const response = await api.post(`/`, media, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        params: { receiverId, chatId }
    });
    return response.data;
};

// clear
export const clearChat = async (id) => {
    const response = await api.patch(`/clear/${id}`);
    if (response.data.success) {
        toast.success(response.data.message);
    } else {
        toast.error(response.data.message);
    }
};
