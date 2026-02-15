import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ACTIONS_ROUTE = BASE_URL + "/actions";

const api = axios.create({
    baseURL: ACTIONS_ROUTE,
    headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = token;
    return config;
});