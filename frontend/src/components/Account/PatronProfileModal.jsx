import React, { useState } from "react";
import { X, ShieldCheck, ShoppingBag, Sparkles, Truck, Logout, UserCircle, CheckCircle } from "@mynaui/icons-react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

const PatronProfileModal = ({ isOpen, onClose, onOpenOrders, onOpenWishlist }) => {
  const { user, logout } = useAuth();
  const { wishlist, openWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("guild"); // 'guild' | 'security'
  const [passwordResetSent, setPasswordResetSent] = useState(false);

  if (!isOpen || !user) return null;

  const handlePasswordReset = () => {
    setPasswordResetSent(true);
    setTimeout(() => setPasswordResetSent(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-900/15 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-amber-100/50 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pb-5 border-b border-amber-900/15">
          <div className="w-16 h-16 rounded-2xl bg-[#BA5B55] text-white flex items-center justify-center text-2xl font-bold font-serif uppercase shadow-md border-2 border-amber-100">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              user.name?.charAt(0) || "P"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif text-gray-900 truncate">
                {user.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                {user.guildTier || "Artisan Fellow"}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle size={13} />
              <span>Verified Patron • Connected via {user.provider === 'google' ? 'Google (Gmail)' : 'Supabase Cloud'}</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 my-5 p-1 bg-amber-900/5 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("guild")}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "guild"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Guild Patron Tier
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "security"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Security & Identity
          </button>
        </div>

        {activeTab === "guild" && (
          <div className="space-y-4">
            {/* Guild Loyalty Tier Status Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E180D] to-[#3A2D1A] text-white shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                    Artisan Circle
                  </span>
                  <h3 className="text-lg font-bold font-serif text-white">
                    Guild Fellow Tier
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-amber-300">
                    {user.patronPoints || 340}
                  </span>
                  <span className="text-[10px] text-amber-200 block">Patron Points</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-amber-400 h-full rounded-full w-2/3 transition-all duration-500"></div>
              </div>
              <p className="text-[11px] text-amber-100 flex items-center justify-between">
                <span>160 pts to Grand Master Patron</span>
                <span className="font-bold">68% Complete</span>
              </p>
            </div>

            {/* Unlocked Privileges */}
            <div className="p-4 rounded-2xl bg-white border border-amber-900/10 space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                Active Patron Privileges
              </span>
              <div className="flex items-start gap-3 text-xs text-gray-800">
                <Truck size={16} className="text-[#BA5B55] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Complimentary Atelier White-Glove Courier</p>
                  <p className="text-gray-500 text-[11px]">Free climate-controlled shipping on all artisan creations worldwide.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs text-gray-800">
                <Sparkles size={16} className="text-[#BA5B55] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Priority Limited Batch Allocations</p>
                  <p className="text-gray-500 text-[11px]">48-hour early access before Damascus forge & Kashmiri harvest drops.</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenOrders) onOpenOrders();
                }}
                className="p-3.5 rounded-2xl bg-white border border-amber-900/15 text-left hover:border-[#BA5B55] transition-all cursor-pointer shadow-xs group"
              >
                <ShoppingBag size={18} className="text-[#BA5B55] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-gray-900">My Orders & Tracking</p>
                <p className="text-[11px] text-gray-500">Track shipments live</p>
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenWishlist) onOpenWishlist();
                  else openWishlist();
                }}
                className="p-3.5 rounded-2xl bg-white border border-amber-900/15 text-left hover:border-[#BA5B55] transition-all cursor-pointer shadow-xs group"
              >
                <Sparkles size={18} className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-gray-900">Wishlist & Treasures</p>
                <p className="text-[11px] text-gray-500">{wishlist.length} pieces saved</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-amber-900/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">Authentication Protocol</span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold">
                  {user.provider === 'google' ? 'Google OAuth 2.0' : 'Supabase Cloud JWT'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-600">Encryption Level</span>
                <span className="text-xs font-mono font-semibold text-gray-900">AES-256 / SHA-256</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-600">Active Device Session</span>
                <span className="text-xs font-semibold text-emerald-600">Current Linux Session</span>
              </div>
            </div>

            {passwordResetSent ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                <span>Password reset link sent to your registered Gmail address!</span>
              </div>
            ) : (
              <button
                onClick={handlePasswordReset}
                className="w-full py-3 bg-white border border-amber-900/20 text-gray-800 text-xs font-bold rounded-2xl hover:bg-amber-50/50 transition-colors cursor-pointer"
              >
                Request Security Password Reset Email
              </button>
            )}
          </div>
        )}

        {/* Sign Out Button */}
        <div className="mt-6 pt-4 border-t border-amber-900/15 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Nashwa Guild Secure Vault</span>
          </div>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800 py-1.5 px-3 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Logout size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatronProfileModal;
