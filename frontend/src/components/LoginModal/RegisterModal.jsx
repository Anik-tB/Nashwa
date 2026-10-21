import React, { useState } from "react";
import Logo from "../Navbar/Logo";
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

const RegisterModal = ({ isOpen, onClose, setView, showMessage }) => {
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [localError, setLocalError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Email typo suggestion helper
  const getTypoSuggestion = (input) => {
    if (!input || !input.includes("@")) return null;
    const [, domain] = input.split("@");
    const typos = {
      "gmai.com": "gmail.com",
      "gmial.com": "gmail.com",
      "gamil.com": "gmail.com",
      "gmail.co": "gmail.com",
      "yaho.com": "yahoo.com"
    };
    if (domain && typos[domain.toLowerCase()]) {
      const prefix = input.split("@")[0];
      return `${prefix}@${typos[domain.toLowerCase()]}`;
    }
    return null;
  };

  const typoSuggestion = getTypoSuggestion(email);

  // Password strength calculator
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "Enter password", color: "bg-gray-200" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score === 2) return { score: 2, label: "Moderate", color: "bg-amber-500" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-blue-500" };
    return { score: 4, label: "Artisan Shield (Strong)", color: "bg-emerald-600" };
  };

  const strength = calculateStrength(password);

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!agreedTerms) {
      setLocalError("Please agree to the Slow Craft Patron pledge.");
      return;
    }

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
      const result = await register(name.trim(), email.trim(), password);

      // Check if email confirmation is required by Supabase
      if (result?.user && !result?.session) {
        setVerificationSent(true);
        if (showMessage) {
          showMessage(
            `Verification email sent to ${email.trim()}! Please confirm your inbox.`,
            "success"
          );
        }
      } else {
        if (showMessage) {
          showMessage("Welcome to Nashwa! Your Patron account is now active.", "success");
        }
        setTimeout(() => {
          if (onClose) onClose();
        }, 800);
      }
    } catch (err) {
      setLocalError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setLocalError("");
    try {
      await loginWithGoogle();
      if (showMessage) {
        showMessage("Connected with Google! Welcome to Nashwa.", "success");
      }
      setTimeout(() => {
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      setLocalError(err.message || "Google sign-up failed. Try registering with email.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

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
            Join the Collective
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Connect with independent guild artisans, master workshops, and heritage feasts
          </p>
        </div>

        {/* Real Email Verification Alert View */}
        {verificationSent ? (
          <div className="text-center py-4 animate-in fade-in duration-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle size={36} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Check Your Gmail Inbox</h2>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              We have dispatched a verification link to <b>{email}</b>. Please click the link in your email to activate your artisan patron account.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#BA5B55] text-white text-xs font-bold rounded-2xl hover:bg-[#a34d47] transition-colors shadow-sm"
              >
                Open Gmail ↗
              </a>
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-xs font-semibold text-gray-500 hover:text-gray-900 py-2 cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 1-Click Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded-2xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all duration-150 active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <GoogleIcon />
              <span>{isGoogleLoading ? "Connecting with Google..." : "Sign up with Google (Gmail)"}</span>
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                or register with email
              </span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Error Alert */}
            {localError && (
              <div className="mb-4 p-3.5 rounded-2xl text-xs font-medium bg-red-50 text-red-800 border border-red-200 flex items-start gap-2">
                <Lock size={15} className="text-red-500 shrink-0 mt-0.5" />
                <span>{localError}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] transition-all text-sm text-gray-900"
                  placeholder="e.g. Layla Al-Mansour"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                  Gmail / Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] transition-all text-sm text-gray-900"
                  placeholder="yourname@gmail.com"
                />
                {typoSuggestion && (
                  <button
                    type="button"
                    onClick={() => setEmail(typoSuggestion)}
                    className="text-left text-[11px] text-[#BA5B55] hover:underline cursor-pointer"
                  >
                    Did you mean <b>{typoSuggestion}</b>? Click to fix.
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                    Create Password
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">Min. 8 chars recommended</span>
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-1">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-gray-500">Security strength:</span>
                      <span className="font-bold text-gray-700">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 transition-all duration-200 ${
                            level <= strength.score ? strength.color : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] transition-all text-sm text-gray-900"
                  placeholder="Repeat password"
                />
              </div>

              <label className="flex items-start gap-2 pt-1 cursor-pointer text-xs text-gray-600 select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#BA5B55] focus:ring-[#BA5B55] border-gray-300"
                />
                <span>
                  I pledge to support ethical, slow-crafted artisan work and agree to the{" "}
                  <span className="text-[#BA5B55] font-semibold underline">Patron Charter</span>.
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-2 bg-[#BA5B55] text-white font-semibold py-3.5 rounded-2xl text-sm transition-all duration-200 shadow-md hover:bg-[#a34d47] active:scale-[0.99] flex justify-center items-center gap-2 cursor-pointer ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <ShieldCheck size={16} />
                <span>{isLoading ? "Enrolling Patron..." : "Create Patron Account"}</span>
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-xs text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => setView("login")}
                  className="font-bold text-[#BA5B55] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
