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
export const registerUser = async (userData) => {
    const response = await api.post("/register", userData);
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

// Upload image to base64
export const uploadImageToBase64 = async (file) => {
    if (!file) return null;
    
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(file);
    });
};