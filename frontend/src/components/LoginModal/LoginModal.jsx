import React, { useState } from "react";
import Logo from "../Navbar/Logo";
import RegisterModal from "./RegisterModal";
import { useAuth } from "../../context/AuthContext";
import { X } from "@mynaui/icons-react";

const LoginModal = ({ isOpen, onClose, initialView = "login" }) => {
  const { login } = useAuth();
  const [view, setView] = useState(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showMessage("Please enter both email and password.", "error");
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await login(email, password);
      showMessage("Successfully signed in!", "success");
      setTimeout(() => {
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      showMessage(err.message || "Failed to sign in. Check your credentials.", "error");
    } finally {
      setIsLoading(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access your orders and artisan courses
          </p>
        </div>

        {/* Status Message */}
        {message.text && (
          <div
            className={`mb-5 p-3.5 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] transition-all text-sm text-gray-900"
              placeholder="demo@nashwa.com"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] transition-all text-sm text-gray-900"
              placeholder="••••••••"
            />
          </div>

          {/* Quick Demo Credentials helper */}
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-xs text-amber-800 flex justify-between items-center">
            <span>Demo: <b>demo@nashwa.com</b> / <b>password123</b></span>
            <button
              type="button"
              onClick={() => {
                setEmail("demo@nashwa.com");
                setPassword("password123");
              }}
              className="text-xs font-semibold text-[#BA5B55] underline hover:text-[#933934] cursor-pointer"
            >
              Fill
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 bg-[#BA5B55] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-md hover:bg-[#a34d47] active:scale-[0.99] flex justify-center items-center cursor-pointer ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in to Nashwa"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => {
                setMessage({ text: "", type: "" });
                setView("register");
              }}
              className="font-semibold text-[#BA5B55] hover:underline cursor-pointer"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;