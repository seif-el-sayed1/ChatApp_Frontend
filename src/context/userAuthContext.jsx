import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    loginUser, 
    registerUser, 
    verifyOtp, 
    resendOtp,
    uploadImageToBase64 
} from "../services/userAuthService";

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

    // Handle Login
    const handleLogin = async (email, password) => {
        setError("");
        setLoading(true);

        try {
            const data = await loginUser(email, password);

            if (data.success) {
                if (data.message === "Verification OTP is sent to your Email") {
                    setUserEmail(email);
                    setShowOtpModal(true);
                } else {
                    localStorage.setItem("token", data.data.token);
                    localStorage.setItem("user", JSON.stringify(data.data));
                    setToken(data.data.token);
                    setUser(data.data);
                    navigate("/chats");
                    window.location.reload();
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Handle Register
    const handleRegister = async (formData, profileImage) => {
        setError("");
        setLoading(true);

        try {
            const profilePicture = await uploadImageToBase64(profileImage);

            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth,
                profilePicture: profilePicture,
                loginType: "email"
            };

            const data = await registerUser(userData);

            if (data.success) {
                setUserEmail(formData.email);
                setShowOtpModal(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Handle Verify OTP
    const handleVerifyOtp = async (otp) => {
        setError("");
        setLoading(true);

        try {
            const data = await verifyOtp(userEmail, otp);

            if (data.success) {
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("user", JSON.stringify(data.data));
                setToken(data.data.token);
                setUser(data.data);
                setShowOtpModal(false);
                navigate("/chats");
                window.location.reload();
            }
        } catch (err) {
            setError(err.response?.data?.message || "OTP verification failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Handle Resend OTP
    const handleResendOtp = async () => {
        setLoading(true);
        setError("");
        
        try {
            await resendOtp(userEmail);
            alert("OTP sent successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend OTP");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Handle Logout ---
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        navigate("/");
    };

    const value = {
        user,
        token,
        loading,
        error,
        setError,
        showOtpModal,
        setShowOtpModal,
        userEmail,
        handleLogin,
        handleRegister,
        handleVerifyOtp,
        handleResendOtp,
        handleLogout
    };

    return (
        <UserAuthContext.Provider value={value}>
            {children}
        </UserAuthContext.Provider>
    );
};
