import React, { useState, useRef, useEffect } from "react";
import { UserCircle, Logout, ShoppingBag } from "@mynaui/icons-react";
import { useAuth } from "../../context/AuthContext";

const ProfileButton = ({ onOpenAuth, onOpenOrders }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User Account"
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 text-[#1E180D] hover:text-[#BA5B55] transition-colors cursor-pointer"
      >
        {isAuthenticated && user ? (
          <div className="w-8 h-8 rounded-full bg-[#BA5B55] text-white flex items-center justify-center font-bold text-sm uppercase shadow-sm">
            {user.name.charAt(0)}
          </div>
        ) : (
          <UserCircle size={24} />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {isAuthenticated && user ? (
            <div>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Signed in as</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenOrders) onOpenOrders();
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <ShoppingBag size={18} className="text-gray-400" />
                My Orders
              </button>

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Logout size={18} className="text-red-500" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="p-2 flex flex-col gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth("login");
                }}
                className="w-full text-center py-2.5 px-3 bg-[#BA5B55] text-white rounded-xl text-sm font-medium hover:bg-[#a34d47] transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth("register");
                }}
                className="w-full text-center py-2 px-3 text-sm text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
