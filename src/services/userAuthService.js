import axios from "axios";
import { BASE_URL } from "../utils/constants";

const USER_AUTH_ROUTE = BASE_URL + "/users/auth"

const api = axios.create({
    baseURL: USER_AUTH_ROUTE, 
    headers: {
        "Content-Type": "application/json"
    }
});

// Login API
export const loginUser = async (email, password) => {
    const response = await api.post("/login", {
        email,
        password,
    }); 
    return response.data;
};

// Register API
// Register API
export const registerUser = async (userData) => {
    const response = await axios.post(USER_AUTH_ROUTE + "/register", userData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

// Verify OTP API
export const verifyOtp = async (email, code) => {
    const response = await api.post("/verify-account", {
        email,
        code
    });
    return response.data;
};

// Resend OTP API
export const resendOtp = async (email) => {
    const response = await api.post("/send-otp", {
        email
    });
    return response.data;
};