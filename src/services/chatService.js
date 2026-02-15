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
