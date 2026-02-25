import React, { useState } from "react";
import Logo from "../Navbar/Logo";
import RegisterModal from "./RegisterModal";

const LoginModal = () => {
  const [step, setStep] = useState(1);
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
        setMessage({ text: "", type: "" });
      }, 500);
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (password.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        console.log("Signing in with:", { email, password });
        showMessage("Successfully signed in!", "success");
        // auth here
      }, 800);
    }
  };

  if (view === 'register') {
    return <RegisterModal setView={setView} showMessage={showMessage} />;
  }

  return (
    <div className="min-h-screen w-full bg-white sm:bg-gray-50 flex flex-col items-center pt-8 sm:pt-16 font-sans">
      {/* Brand Header */}
      <div className="mb-6 sm:mb-8 flex justify-center w-full max-w-[400px]">
        <Logo className="w-[100px] sm:w-[120px] h-auto object-contain" />
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[400px] px-4 sm:px-0">
        {message.text && (
          <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
            {message.text}
          </div>
        )}
        <div className="bg-white sm:rounded-2xl py-6 sm:p-8 sm:shadow-sm sm:border sm:border-gray-100 mb-6 w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {step === 1 ? 'Welcome back' : 'Sign in'}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {step === 1 ? 'Please enter your details to sign in.' : 'Enter your password to continue.'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleContinue} className="flex flex-col gap-5">
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
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#f0c14b] text-gray-900 font-medium py-3 sm:py-2.5 rounded-xl text-sm transition-colors duration-200 shadow-sm flex justify-center items-center active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#f4d078]'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Please wait...
                  </>
                ) : 'Continue'}
              </button>

              <div className="relative flex items-center py-2">
                <div className="grow border-t border-gray-200"></div>
                <span className="px-3 text-xs text-gray-400 bg-white">Or continue with</span>
                <div className="grow border-t border-gray-200"></div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => showMessage("Connecting to Google...")}
                  className="w-full flex items-center justify-center bg-white border border-gray-300 sm:border-gray-200 hover:bg-gray-50 hover:border-gray-400 sm:hover:border-gray-300 text-gray-700 py-3 sm:py-2.5 rounded-xl transition-all duration-200 sm:shadow-sm active:scale-[0.98]"
                  aria-label="Continue with Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => showMessage("Connecting to Facebook...")}
                  className="w-full flex items-center justify-center bg-white border border-gray-300 sm:border-gray-200 hover:bg-gray-50 hover:border-gray-400 sm:hover:border-gray-300 text-[#1877F2] py-3 sm:py-2.5 rounded-xl transition-all duration-200 sm:shadow-sm active:scale-[0.98]"
                  aria-label="Continue with Facebook"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>

              <div className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
                By continuing, you agree to Nashwa's{" "}
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
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="flex flex-col gap-5">
              <div className="flex items-center justify-between p-3.5 sm:p-3 bg-white sm:bg-gray-50 rounded-xl border border-gray-300 sm:border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-0.5">Signed in as</span>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-[#0066c0] hover:text-[#c45500] hover:underline transition-colors px-2 py-1"
                >
                  Change
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); showMessage("Password reset instructions sent.", "success"); }}
                    className="text-xs font-medium text-[#0066c0] hover:text-[#c45500] hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 sm:py-2.5 bg-white sm:bg-gray-50 border border-gray-300 sm:border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e77600]/20 focus:border-[#e77600] transition-all duration-200 text-sm text-gray-900 pr-10"
                    placeholder="••••••••"
                    autoFocus
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="keep-signed-in"
                  className="w-4 h-4 accent-[#e77600] cursor-pointer transition-colors"
                />
                <label htmlFor="keep-signed-in" className="text-sm text-gray-600 cursor-pointer select-none">
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#f0c14b] text-gray-900 font-medium py-3 sm:py-2.5 rounded-xl text-sm transition-colors duration-200 shadow-sm mt-1 flex justify-center items-center active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#f4d078]'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </form>
          )}
        </div>

        {/* Separator / New Account Section */}
        {view === 'login' && step === 1 && (
          <div className="flex flex-col items-center mt-8">
            <div className="w-full relative flex items-center mb-6">
              <div className="grow border-t border-gray-200"></div>
              <span className="px-4 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                New to Nashwa?
              </span>
              <div className="grow border-t border-gray-200"></div>
            </div>

            <button
              onClick={() => { setView('register'); setMessage({ text: "", type: "" }); }}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 sm:border-gray-200 font-medium py-3 sm:py-2.5 rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
            >
              Create your Nashwa account
            </button>

            <div className="mt-8 mb-2">
              <button
                onClick={(e) => { e.preventDefault(); showMessage("Redirecting to Nashwa Business..."); }}
                className="text-sm font-medium text-[#0066c0] hover:text-[#c45500] hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
              >
                Shop on Nashwa Business
              </button>
            </div>
          </div>
        )}
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

export default LoginModal;