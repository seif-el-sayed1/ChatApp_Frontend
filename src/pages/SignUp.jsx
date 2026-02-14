import { useState } from "react";
import { UserAuth } from "../context/userAuthContext";

export const SignUp = () => {
    const {
        loading,
        error,
        setError,
        showOtpModal,
        userEmail,
        handleLogin,
        handleRegister,
        handleVerifyOtp,
        handleResendOtp
    } = UserAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otp, setOtp] = useState("");

    // Form data state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        profilePicture: null,
        password: "",
        confirmPassword: "",
        gender: "male",
        dateOfBirth: ""
    });


    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profilePicture: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Login Handler
    const onLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin(formData.email, formData.password);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
            
        }
    };

    // Register Handler
    const onRegisterSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.firstName || !formData.lastName) {
            setError("Please enter your first and last name");
            return;
        }

        if (!formData.email) {
            setError("Please enter your email");
            return;
        }

        if (!formData.dateOfBirth) {
            setError("Please enter your date of birth");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const data = new FormData();
            data.append("firstName", formData.firstName);
            data.append("lastName", formData.lastName);
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("gender", formData.gender);
            data.append("dateOfBirth", formData.dateOfBirth);
            if (formData.profilePicture) {
                data.append("profilePicture", formData.profilePicture);
            }
            await handleRegister(data);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    // Verify OTP Handler
    const onVerifyOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleVerifyOtp(otp);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center min-h-screen">
            {/*LEFT*/}
            <div className="hidden lg:flex flex-col min-h-screen w-1/2 justify-center items-center bg-[hsl(var(--secondary-color))] px-8">
                <div className="shadow-[0_4px_6px_-1px_hsl(var(--primary-color))] bg-[hsl(var(--primary-color))] flex items-center justify-center w-20 h-20 rounded-2xl mb-3 glow-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-10 h-10">
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                    </svg>
                </div>
                <h2 className="font-semibold text-5xl mb-4">Chat Me</h2>
                <p className="text-gray-700 text-center text-lg">
                    Join thousands of people chatting in real-time. Fast,<br /> secure, and beautiful.
                </p>
            </div>    
            
            {/*RIGHT*/}
            <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--background-color))] px-6 py-10">
                {/* Logo for mobile */}
                <div className="lg:hidden mb-8">
                    <div className="shadow-[0_4px_6px_-1px_hsl(var(--primary-color))] bg-[hsl(var(--primary-color))] flex items-center justify-center w-16 h-16 rounded-2xl mb-2 glow-primary mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-8 h-8">
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                        </svg>
                    </div>
                    <h2 className="font-semibold text-3xl text-center">Chat Me</h2>
                </div>

                <form 
                    onSubmit={isLogin ? onLoginSubmit : onRegisterSubmit}
                    className="w-full max-w-md flex flex-col gap-4"
                >
                    <div className="flex flex-col mb-2">
                        <h3 className="text-2xl mb-2 font-bold">
                            {isLogin ? "Welcome back" : "Create Your Account"}
                        </h3>
                        <p className="text-gray-500">
                            {isLogin ? "Sign in to continue your conversations" : "Start chatting in seconds"}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}
                    
                    {/* Profile Image Upload */}
                    {!isLogin && (
                        <div className="w-full flex flex-col items-center gap-3 mb-2">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-[hsl(var(--primary-color))]">
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-400">
                                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <label 
                                    htmlFor="profileImage" 
                                    className="absolute bottom-0 right-0 bg-[hsl(var(--primary-color))] text-white rounded-full p-2 cursor-pointer hover:opacity-90 transition-opacity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                        <circle cx="12" cy="13" r="4"></circle>
                                    </svg>
                                </label>
                                <input 
                                    type="file" 
                                    id="profileImage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-sm text-gray-500">Upload profile picture</p>
                        </div>
                    )}
                    
                    {!isLogin && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* first name */}
                            <div className="w-full flex flex-col gap-1">
                                <label htmlFor="firstName">First Name</label>
                                <div className="bg-gray-200 rounded-2xl border-3 border-transparent p-[2.25px] focus-within:border-[hsl(var(--primary-color))] c">
                                    <input 
                                        className="w-full py-3 px-4 placeholder:text-sm outline-none rounded-xl border border-transparent focus:border-[hsl(var(--primary-color))] transition-colors duration-200"  
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="First Name"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                            
                            {/* last name */}
                            <div className="w-full flex flex-col gap-1">
                                <label htmlFor="lastName">Last Name</label>
                                <div className="bg-gray-200 rounded-2xl border-3 border-transparent p-[2.25px] focus-within:border-[hsl(var(--primary-color))] transition-colors duration-200">
                                    <input 
                                        className="w-full py-3 px-4 placeholder:text-sm outline-none rounded-xl border border-transparent focus:border-[hsl(var(--primary-color))] transition-colors duration-200"  
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Last Name"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Date of Birth & Gender */}
                    {!isLogin && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Date of Birth */}
                            <div className="w-full flex flex-col gap-1">
                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                <div className="bg-gray-200 rounded-2xl border-3 border-transparent p-[2.25px] focus-within:border-[hsl(var(--primary-color))] transition-colors duration-200">
                                    <input 
                                        className="w-full py-3 px-4 placeholder:text-sm outline-none rounded-xl border border-transparent focus:border-[hsl(var(--primary-color))] transition-colors duration-200"  
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                            
                            {/* Gender */}
                            <div className="w-full flex flex-col gap-1">
                                <label htmlFor="gender">Gender</label>
                                <div className="bg-gray-200 rounded-2xl border-3 border-transparent p-[2.25px] focus-within:border-[hsl(var(--primary-color))] transition-colors duration-200">
                                    <select 
                                        className="w-full py-3 px-4 placeholder:text-sm outline-none rounded-xl border border-transparent focus:border-[hsl(var(--primary-color))] transition-colors duration-200 bg-white"  
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* email */}
                    <div className="w-full flex flex-col gap-1">
                        <label htmlFor="email">Email</label>
                        <div className="bg-gray-200 rounded-2xl border-3 border-transparent p-[2.25px] focus-within:border-[hsl(var(--primary-color))] transition-colors duration-200">
                            <input 
                                className="w-full py-3 px-4 placeholder:text-sm outline-none rounded-xl border border-transparent focus:border-[hsl(var(--primary-color))] transition-colors duration-200"  
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* password */}
                    <div className="w-full flex flex-col gap-1">
                        <label htmlFor="password">Password</label>
                        <div className="bg-gray-200 rounded-2xl border-3 border-transparent p-[2.25px] focus-within:border-[hsl(var(--primary-color))] transition-colors duration-200">
                            <div className="relative">
                                <input 
                                    className="w-full py-3 px-4 pr-12 placeholder:text-sm outline-none rounded-xl border border-transparent focus:border-[hsl(var(--primary-color))] transition-colors duration-200"  
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="********"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="2" y1="2" x2="22" y2="22"></line>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* confirm password */}
                    {!isLogin && (
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="bg-gray-200 rounded-2xl border-3 border-transparent p-[2.25px] focus-within:border-[hsl(var(--primary-color))] transition-colors duration-200">
                                <div className="relative">
                                    <input 
                                        className="w-full py-3 px-4 pr-12 placeholder:text-sm outline-none rounded-xl border border-transparent focus:border-[hsl(var(--primary-color))] transition-colors duration-200"  
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="********"
                                        required={!isLogin}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="2" y1="2" x2="22" y2="22"></line>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* forgot password */}
                    {isLogin && (
                        <p className="text-[hsl(var(--primary-color))] hover:underline cursor-pointer text-right text-sm">
                            Forgot Password?
                        </p>
                    )}
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        className="bg-[hsl(var(--primary-color))] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Loading..." : (isLogin ? "Sign In" : "Create Account")}
                    </button>
                    
                    <p className="text-gray-600 text-center text-sm">
                        {isLogin ? (
                            <>
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError("");
                                    }}
                                    className="font-semibold text-[hsl(var(--primary-color))] hover:underline cursor-pointer"
                                >
                                    Create Account
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError("");
                                    }}
                                    className="font-semibold text-[hsl(var(--primary-color))] hover:underline cursor-pointer"
                                >
                                    Sign In
                                </button>
                            </>
                        )}
                    </p>
                </form>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-4">Verify Your Email</h3>
                        <p className="text-gray-600 mb-6">
                            We've sent a verification code to <strong>{userEmail}</strong>
                        </p>
                        
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={onVerifyOtpSubmit}>
                            <div className="mb-6">
                                <label htmlFor="otp" className="block mb-2 font-medium">Enter OTP</label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength="6"
                                    className="w-full py-3 px-4 border-2 border-gray-300 rounded-xl focus:border-[hsl(var(--primary-color))] outline-none text-center text-2xl tracking-widest"
                                    required
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[hsl(var(--primary-color))] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mb-3"
                            >
                                {loading ? "Verifying..." : "Verify"}
                            </button>
                            
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={loading}
                                className="w-full text-[hsl(var(--primary-color))] py-2 rounded-xl font-semibold hover:underline"
                            >
                                Resend OTP
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};