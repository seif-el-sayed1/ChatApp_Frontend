import { useState } from "react";

export const SignUp = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex justify-center min-h-screen">
            {/*LEFT*/}
            <div className="hidden lg:flex flex-col min-h-screen w-1/2 justify-center items-center bg-[hsl(var(--secondary-color))] px-8">
                {/* logo */}
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

                <form className="w-full max-w-md flex flex-col gap-4">
                    <div className="flex flex-col mb-2">
                        <h3 className="text-2xl mb-2 font-bold">
                            {isLogin ? "Welcome back" : "Create Your Account"}
                        </h3>
                        <p className="text-gray-500">
                            {isLogin ? "Sign in to continue your conversations" : "Start chatting in seconds"}
                        </p>
                    </div>
                    
                    {/* Profile image */}
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
                                <div className="bg-gray-200 rounded-2xl border-3 border-transparent p-[2.25px] focus-within:border-[hsl(var(--primary-color))] transition-colors duration-200">
                                    <input 
                                        className="w-full py-3 px-4 placeholder:text-sm outline-none rounded-xl border border-transparent focus:border-[hsl(var(--primary-color))] transition-colors duration-200"  
                                        type="text"
                                        id="firstName" 
                                        placeholder="First Name"
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
                                        placeholder="Last Name"
                                    />
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
                                placeholder="you@example.com"
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
                                    placeholder="********"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? (
                                        // Eye Off Icon
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="2" y1="2" x2="22" y2="22"></line>
                                        </svg>
                                    ) : (
                                        // Eye Icon
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
                                        placeholder="********"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            // Eye Off Icon
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="2" y1="2" x2="22" y2="22"></line>
                                            </svg>
                                        ) : (
                                            // Eye Icon
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
                        className="bg-[hsl(var(--primary-color))] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity mt-2"
                    >
                        {isLogin ? "Sign In" : "Create Account"}
                    </button>
                    
                    <p className="text-gray-600 text-center text-sm">
                        {isLogin ? (
                            <>
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
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
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="font-semibold text-[hsl(var(--primary-color))] hover:underline cursor-pointer"
                                >
                                    Sign In
                                </button>
                            </>
                        )}
                    </p>
                </form>
            </div>            
        </div>
    )
}