import React, { useState } from "react";
import Logo from "../Navbar/Logo";

const RegisterModal = ({ setView, showMessage }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }
        if (!name.trim() || !email.trim() || !password.trim()) {
            showMessage("Please fill in all fields.", "error");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log("Registering with:", { name, email, password });
            showMessage("Account created successfully! Please sign in.", "success");
            setView("login");
        }, 800);
    };

    return (
        <div className="min-h-screen w-full bg-white sm:bg-gray-50 flex flex-col items-center pt-8 sm:pt-16 font-sans">
            {/* Brand Header */}
            <div className="mb-6 sm:mb-8 flex justify-center w-full max-w-[400px]">
                <Logo className="w-[100px] sm:w-[120px] h-auto object-contain" />
            </div>

            {/* Main Register Card */}
            <div className="w-full max-w-[400px] px-4 sm:px-0">
                <div className="bg-white sm:rounded-2xl py-6 sm:p-8 sm:shadow-sm sm:border sm:border-gray-100 mb-6 w-full">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                            Create account
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Enter your details to create an account.
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Your name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 sm:py-2.5 bg-white sm:bg-gray-50 border border-gray-300 sm:border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e77600]/20 focus:border-[#e77600] transition-all duration-200 text-sm text-gray-900"
                                placeholder="First and last name"
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Email or mobile number
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 sm:py-2.5 bg-white sm:bg-gray-50 border border-gray-300 sm:border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e77600]/20 focus:border-[#e77600] transition-all duration-200 text-sm text-gray-900"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 sm:py-2.5 bg-white sm:bg-gray-50 border border-gray-300 sm:border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e77600]/20 focus:border-[#e77600] transition-all duration-200 text-sm text-gray-900 pr-10"
                                    placeholder="At least 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Re-enter password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 sm:py-2.5 bg-white sm:bg-gray-50 border border-gray-300 sm:border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e77600]/20 focus:border-[#e77600] transition-all duration-200 text-sm text-gray-900 pr-10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#f0c14b] text-gray-900 font-medium py-3 sm:py-2.5 rounded-xl text-sm transition-colors duration-200 shadow-sm mt-2 flex justify-center items-center active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#f4d078]'}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Creating account...
                                </>
                            ) : 'Create account'}
                        </button>

                        <div className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
                            By creating an account, you agree to Nashwa's{" "}
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); showMessage("Opening Conditions of Use..."); }}
                                className="text-[#0066c0] hover:text-[#c45500] hover:underline font-medium transition-colors bg-transparent border-none p-0 cursor-pointer inline"
                            >
                                Conditions of Use
                            </button>
                            {" "}and{" "}
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); showMessage("Opening Privacy Notice..."); }}
                                className="text-[#0066c0] hover:text-[#c45500] hover:underline font-medium transition-colors bg-transparent border-none p-0 cursor-pointer inline"
                            >
                                Privacy Notice
                            </button>.
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setView('login'); }}
                                    className="text-[#0066c0] hover:text-[#c45500] hover:underline font-medium transition-colors bg-transparent border-none p-0 cursor-pointer"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer Area */}
            <div className="mt-auto w-full py-8 text-center flex flex-col items-center">
                <div className="flex gap-6 mb-3 text-xs">
                    <button type="button" onClick={(e) => { e.preventDefault(); showMessage("Opening Conditions of Use..."); }} className="text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none p-0 cursor-pointer">Conditions of Use</button>
                    <button type="button" onClick={(e) => { e.preventDefault(); showMessage("Opening Privacy Notice..."); }} className="text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none p-0 cursor-pointer">Privacy Notice</button>
                    <button type="button" onClick={(e) => { e.preventDefault(); showMessage("Opening Help Center..."); }} className="text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none p-0 cursor-pointer">Help</button>
                </div>
                <div className="text-xs text-gray-400">
                    © {new Date().getFullYear()} Nashwa, Inc. or its affiliates
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;
