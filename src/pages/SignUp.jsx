import { useState } from "react";

export const SignUp = () => {
    const [isLogin, setIsLogin] = useState(true);

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
                            <input 
                                className="w-full py-3 px-4 placeholder:text-sm outline-none rounded-xl border border-transparent focus:border-[hsl(var(--primary-color))] transition-colors duration-200"  
                                type="password"
                                id="password" 
                                placeholder="********"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* confirm password */}
                    {!isLogin && (
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="bg-gray-200 rounded-2xl border-3 border-transparent p-[2.25px] focus-within:border-[hsl(var(--primary-color))] transition-colors duration-200">
                                <input 
                                    className="w-full py-3 px-4 placeholder:text-sm outline-none rounded-xl border border-transparent focus:border-[hsl(var(--primary-color))] transition-colors duration-200"  
                                    type="password"
                                    id="confirmPassword" 
                                    placeholder="********"
                                    required
                                />
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