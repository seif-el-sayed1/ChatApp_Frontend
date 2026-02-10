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

export const UserAuthProvider = ({ children }) => {
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);           
    const [token, setToken] = useState(null);         
    const [loading, setLoading] = useState(false);    
    const [error, setError] = useState("");           
    const [showOtpModal, setShowOtpModal] = useState(false); 
    const [userEmail, setUserEmail] = useState("");   

    // Load user from localStorage 
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

 

    const value = {
        user,
        token,
        loading,
        error,
        setError,
        showOtpModal,
        setShowOtpModal,
        userEmail,
    };

    return (
        <UserAuthContext.Provider value={value}>
            {children}
        </UserAuthContext.Provider>
    );
};
