import React, { useState } from "react";
import Logo from "../Navbar/Logo";
import { useAuth } from "../../context/AuthContext";
import { X } from "@mynaui/icons-react";

const RegisterModal = ({ isOpen, onClose, setView, showMessage }) => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      if (showMessage) {
        showMessage("Account created successfully! Welcome to Nashwa.", "success");
      }
      setTimeout(() => {
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      setLocalError(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Join the Collective
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Connect with independent artisans, scholars, and feasting circles
          </p>
        </div>

        {/* Error Alert */}
        {localError && (
          <div className="mb-5 p-3.5 rounded-xl text-sm font-medium bg-red-50 text-red-800 border border-red-200">
            {localError}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] transition-all text-sm text-gray-900"
              placeholder="e.g. Layla Ahmed"
              autoFocus
            />
          </div>

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
              placeholder="layla@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] transition-all text-sm text-gray-900"
              placeholder="Min. 6 characters"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] transition-all text-sm text-gray-900"
              placeholder="Repeat password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 bg-[#BA5B55] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-md hover:bg-[#a34d47] active:scale-[0.99] flex justify-center items-center cursor-pointer ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => setView("login")}
              className="font-semibold text-[#BA5B55] hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
