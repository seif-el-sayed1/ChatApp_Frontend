import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    loginUser, 
    registerUser, 
    verifyOtp, 
    resendOtp,
    uploadImageToBase64 
} from "../services/userAuth";

const UserAuthContext = createContext();

export const UserAuth = () => {
    const context = useContext(UserAuthContext);
    if (!context) {
        throw new Error("useUserAuth must be used within UserAuthProvider");
    }
    return context;
};


