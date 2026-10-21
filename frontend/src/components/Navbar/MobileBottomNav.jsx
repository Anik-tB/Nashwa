import React from "react";
import { Home, Compass, Heart, Cart, User } from "@mynaui/icons-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { triggerHaptic } from "../../lib/haptics";

const MobileBottomNav = ({
  activeTab,
  onNavigate,
  onOpenAuth,
  onOpenProfile
}) => {
  const { totalItems, openCart } = useCart();
  const { wishlist, openWishlist } = useWishlist();
  const { user } = useAuth();

  const handleTabClick = (tab) => {
    triggerHaptic("selection");
    onNavigate(tab);
  };

  const handleWishlistClick = () => {
    triggerHaptic("light");
    openWishlist();
  };

  const handleCartClick = () => {
    triggerHaptic("medium");
    openCart();
  };

  const handleAccountClick = () => {
    triggerHaptic("light");
    if (user) {
      if (onOpenProfile) onOpenProfile();
    } else {
      if (onOpenAuth) onOpenAuth("login");
    }
  };

  return (
    <aside
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/92 backdrop-blur-2xl border-t border-amber-900/10 shadow-[0_-8px_30px_rgba(30,24,13,0.06)] md:hidden pb-[max(env(safe-area-inset-bottom),10px)] pt-1.5 transition-all"
    >
      <div className="grid grid-cols-5 items-center px-2 max-w-md mx-auto">
        {/* Home */}
        <button
          type="button"
          onClick={() => handleTabClick("home")}
          className="relative flex flex-col items-center justify-center py-1.5 cursor-pointer touch-press no-select"
        >
          <div
            className={`flex items-center justify-center w-11 h-8 rounded-full transition-all duration-200 ${
              activeTab === "home"
                ? "bg-[#BA5B55]/12 text-[#BA5B55]"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Home
              size={21}
              className={`transition-transform duration-200 ${
                activeTab === "home" ? "scale-110 stroke-[2.5]" : ""
              }`}
            />
          </div>
          <span
            className={`text-[10px] font-bold tracking-tight transition-colors ${
              activeTab === "home" ? "text-[#BA5B55]" : "text-gray-500"
            }`}
          >
            Home
          </span>
          {activeTab === "home" && (
            <span className="w-1 h-1 rounded-full bg-[#BA5B55] mt-0.5 animate-in zoom-in-50"></span>
          )}
        </button>

        {/* Guilds / Explore */}
        <button
          type="button"
          onClick={() => handleTabClick("shops")}
          className="relative flex flex-col items-center justify-center py-1.5 cursor-pointer touch-press no-select"
        >
          <div
            className={`flex items-center justify-center w-11 h-8 rounded-full transition-all duration-200 ${
              activeTab === "shops"
                ? "bg-[#BA5B55]/12 text-[#BA5B55]"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Compass
              size={21}
              className={`transition-transform duration-200 ${
                activeTab === "shops" ? "scale-110 stroke-[2.5]" : ""
              }`}
            />
          </div>
          <span
            className={`text-[10px] font-bold tracking-tight transition-colors ${
              activeTab === "shops" ? "text-[#BA5B55]" : "text-gray-500"
            }`}
          >
            Guilds
          </span>
          {activeTab === "shops" && (
            <span className="w-1 h-1 rounded-full bg-[#BA5B55] mt-0.5 animate-in zoom-in-50"></span>
          )}
        </button>

        {/* Saved / Wishlist */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="relative flex flex-col items-center justify-center py-1.5 cursor-pointer touch-press no-select"
        >
          <div className="relative flex items-center justify-center w-11 h-8 rounded-full text-gray-500 hover:text-[#BA5B55] transition-colors">
            <Heart size={21} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#BA5B55] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale-pulse">
                {wishlist.length > 9 ? "9+" : wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight text-gray-500">
            Saved
          </span>
        </button>

        {/* Cart / Basket */}
        <button
          type="button"
          onClick={handleCartClick}
          className="relative flex flex-col items-center justify-center py-1.5 cursor-pointer touch-press no-select"
        >
          <div className="relative flex items-center justify-center w-11 h-8 rounded-full text-gray-500 hover:text-[#BA5B55] transition-colors">
            <Cart size={21} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#BA5B55] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale-pulse">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight text-gray-500">
            Basket
          </span>
        </button>

        {/* Patron Account */}
        <button
          type="button"
          onClick={handleAccountClick}
          className="relative flex flex-col items-center justify-center py-1.5 cursor-pointer touch-press no-select"
        >
          <div className="flex items-center justify-center w-11 h-8 rounded-full text-gray-500 hover:text-[#BA5B55] transition-colors">
            {user ? (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#BA5B55] to-[#803530] text-white font-black text-[10px] flex items-center justify-center shadow-xs ring-1 ring-amber-900/10">
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User size={21} />
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight text-gray-500">
            {user ? "Patron" : "Join"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default MobileBottomNav;
