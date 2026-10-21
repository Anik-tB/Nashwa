import React, { useState, useEffect } from "react";
import Logo from "../Navbar/Logo";
import RegisterModal from "./RegisterModal";
import { useAuth } from "../../context/AuthContext";
import { X, Lock, CheckCircle, ShieldCheck } from "@mynaui/icons-react";

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const LoginModal = ({ isOpen, onClose, initialView = "login" }) => {
  const { login, loginWithGoogle, loginWithMagicLink, lockoutTime } = useAuth();
  const [view, setView] = useState(initialView);
  const [authMethod, setAuthMethod] = useState("password"); // 'password' | 'magic_link'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Email typo suggestion helper (detecting @gmai.com, @gmial.com, etc.)
  const getTypoSuggestion = (input) => {
    if (!input || !input.includes("@")) return null;
    const [, domain] = input.split("@");
    const typos = {
      "gmai.com": "gmail.com",
      "gmial.com": "gmail.com",
      "gamil.com": "gmail.com",
      "gmail.co": "gmail.com",
      "yaho.com": "yahoo.com",
      "hotmial.com": "hotmail.com"
    };
    if (domain && typos[domain.toLowerCase()]) {
      const prefix = input.split("@")[0];
      return `${prefix}@${typos[domain.toLowerCase()]}`;
    }
    return null;
  };

  const typoSuggestion = getTypoSuggestion(email);

  // Live Lockout Countdown timer
  useEffect(() => {
    if (!lockoutTime || lockoutTime <= Date.now()) {
      setLockoutRemaining(0);
      return;
    }
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000));
      setLockoutRemaining(remaining);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockoutTime]);

  if (!isOpen) return null;

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (lockoutRemaining > 0) {
      showMessage(`Security lock active. Please wait ${lockoutRemaining} seconds.`, "error");
      return;
    }

    if (!email.trim()) {
      showMessage("Please enter your email address.", "error");
      return;
    }

    if (authMethod === "magic_link") {
      setIsLoading(true);
      setMessage({ text: "", type: "" });
      try {
        await loginWithMagicLink(email.trim());
        showMessage(
          `Magic sign-in link dispatched to ${email.trim()}! Check your Gmail inbox or spam.`,
          "success"
        );
      } catch (err) {
        showMessage(err.message || "Failed to dispatch magic link. Please check your email.", "error");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!password.trim()) {
      showMessage("Please enter your password.", "error");
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await login(email.trim(), password);
      showMessage("Authenticated successfully! Welcome back to Nashwa.", "success");
      setTimeout(() => {
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      showMessage(err.message || "Failed to sign in. Verify your credentials.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await loginWithGoogle();
      showMessage("Signed in with Google! Welcome to the collective.", "success");
      setTimeout(() => {
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      showMessage(err.message || "Google authentication was interrupted. Try again.", "error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (view === "register") {
    return (
      <RegisterModal
        isOpen={isOpen}
        onClose={onClose}
        setView={setView}
        showMessage={showMessage}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[440px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/10 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="mb-5 flex justify-center">
          <Logo />
        </div>

        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold font-serif text-gray-900 tracking-tight">
            Patron Sign In
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Access your artisan orders, academy passes, and heritage wishlist
          </p>
        </div>

        {/* Security Lockout Banner */}
        {lockoutRemaining > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5 animate-pulse">
            <ShieldCheck size={18} className="text-[#BA5B55] shrink-0" />
            <span>
              Brute-force security lock active. Too many attempts. Try again in{" "}
              <b>{lockoutRemaining}s</b>.
            </span>
          </div>
        )}

        {/* Status Message */}
        {message.text && (
          <div
            className={`mb-4 p-3.5 rounded-2xl text-xs font-medium flex items-start gap-2.5 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Lock size={16} className="text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p>{message.text}</p>
              {message.type === "success" && authMethod === "magic_link" && (
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 font-bold underline text-emerald-700 hover:text-emerald-900"
                >
                  Open Gmail Inbox ↗
                </a>
              )}
            </div>
          </div>
        )}

        {/* 1-Click Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || lockoutRemaining > 0}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded-2xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all duration-150 active:scale-[0.99] cursor-pointer disabled:opacity-50"
        >
          <GoogleIcon />
          <span>{isGoogleLoading ? "Connecting with Google..." : "Continue with Google (Gmail)"}</span>
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            or sign in with email
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Method Toggle: Password vs Passwordless Magic Link */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-2xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("password");
              setMessage({ text: "", type: "" });
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authMethod === "password"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Password Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("magic_link");
              setMessage({ text: "", type: "" });
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authMethod === "magic_link"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Magic Link (Gmail OTP)
          </button>
        </div>

        <form onSubmit={handleSignIn} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] transition-all text-sm text-gray-900"
              placeholder="e.g. yourname@gmail.com"
              autoFocus
            />
            {/* Typo Correction Pill */}
            {typoSuggestion && (
              <button
                type="button"
                onClick={() => setEmail(typoSuggestion)}
                className="text-left text-[11px] text-[#BA5B55] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Did you mean <b className="font-semibold">{typoSuggestion}</b>? Click to fix.
              </button>
            )}
          </div>

          {authMethod === "password" && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("magic_link");
                    showMessage("Enter your email above and we will send a passwordless login link.", "info");
                  }}
                  className="text-[11px] font-semibold text-[#BA5B55] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] transition-all text-sm text-gray-900"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}

          {authMethod === "password" && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#BA5B55] focus:ring-[#BA5B55] border-gray-300"
                />
                <span>Keep me signed in</span>
              </label>

              {/* Quick Demo Helper */}
              <button
                type="button"
                onClick={() => {
                  setEmail("demo@nashwa.com");
                  setPassword("password123");
                }}
                className="text-[11px] font-semibold text-amber-800 hover:underline cursor-pointer"
              >
                Quick Demo Fill
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || lockoutRemaining > 0}
            className={`w-full mt-2 bg-[#BA5B55] text-white font-semibold py-3.5 rounded-2xl text-sm transition-all duration-200 shadow-md hover:bg-[#a34d47] active:scale-[0.99] flex justify-center items-center gap-2 cursor-pointer ${
              isLoading || lockoutRemaining > 0 ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <Lock size={16} />
            <span>
              {isLoading
                ? authMethod === "magic_link"
                  ? "Dispatching Magic Link..."
                  : "Securing Connection..."
                : authMethod === "magic_link"
                ? "Send Magic Sign-In Link"
                : "Sign in to Nashwa"}
            </span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Don't have an account yet?{" "}
            <button
              onClick={() => {
                setMessage({ text: "", type: "" });
                setView("register");
              }}
              className="font-bold text-[#BA5B55] hover:underline cursor-pointer"
            >
              Join the Collective
            </button>
          </p>
        </div>

        {/* Security badge footer */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] text-gray-400">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>256-Bit SSL Encrypted • Supabase Cloud Authentication</span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;