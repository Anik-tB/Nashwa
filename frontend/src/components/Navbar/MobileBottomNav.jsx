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

  const isHomeActive = activeTab === "home";
  const isGuildsActive = activeTab === "shops" || activeTab === "categories" || activeTab === "university" || activeTab === "events";

  return (
    <aside
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-amber-900/10 shadow-[0_-4px_25px_rgba(30,24,13,0.08)] md:hidden pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 select-none"
    >
      <div className="grid grid-cols-5 items-center px-2 max-w-md mx-auto">
        {/* 1. Home Tab */}
        <button
          type="button"
          onClick={() => handleTabClick("home")}
          className="flex flex-col items-center justify-center py-1 cursor-pointer touch-press group"
        >
          <div
            className={`flex items-center justify-center w-11 h-7 rounded-full transition-all duration-200 ${
              isHomeActive
                ? "bg-[#BA5B55]/12 text-[#BA5B55]"
                : "text-stone-500 group-hover:text-stone-900"
            }`}
          >
            <Home
              size={20}
              className={`transition-transform duration-200 ${
                isHomeActive ? "scale-105 stroke-[2.5]" : ""
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
              isHomeActive ? "text-[#BA5B55] font-extrabold" : "text-stone-500 font-semibold"
            }`}
          >
            Home
          </span>
        </button>

        {/* 2. Guilds / Explore Tab */}
        <button
          type="button"
          onClick={() => handleTabClick("shops")}
          className="flex flex-col items-center justify-center py-1 cursor-pointer touch-press group"
        >
          <div
            className={`flex items-center justify-center w-11 h-7 rounded-full transition-all duration-200 ${
              isGuildsActive
                ? "bg-[#BA5B55]/12 text-[#BA5B55]"
                : "text-stone-500 group-hover:text-stone-900"
            }`}
          >
            <Compass
              size={20}
              className={`transition-transform duration-200 ${
                isGuildsActive ? "scale-105 stroke-[2.5]" : ""
              }`}
            />
          </div>
          <span
            className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
              isGuildsActive ? "text-[#BA5B55] font-extrabold" : "text-stone-500 font-semibold"
            }`}
          >
            Guilds
          </span>
        </button>

        {/* 3. Saved / Wishlist Tab */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="flex flex-col items-center justify-center py-1 cursor-pointer touch-press group"
        >
          <div className="relative flex items-center justify-center w-11 h-7 rounded-full text-stone-500 group-hover:text-[#BA5B55] transition-colors">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#BA5B55] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale-pulse">
                {wishlist.length > 9 ? "9+" : wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight text-stone-500 mt-0.5">
            Saved
          </span>
        </button>

        {/* 4. Cart / Basket Tab */}
        <button
          type="button"
          onClick={handleCartClick}
          className="flex flex-col items-center justify-center py-1 cursor-pointer touch-press group"
        >
          <div className="relative flex items-center justify-center w-11 h-7 rounded-full text-stone-500 group-hover:text-[#BA5B55] transition-colors">
            <Cart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#BA5B55] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale-pulse">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight text-stone-500 mt-0.5">
            Basket
          </span>
        </button>

        {/* 5. Patron Account Tab */}
        <button
          type="button"
          onClick={handleAccountClick}
          className="flex flex-col items-center justify-center py-1 cursor-pointer touch-press group"
        >
          <div className="flex items-center justify-center w-11 h-7 rounded-full text-stone-500 group-hover:text-[#BA5B55] transition-colors">
            {user ? (
              <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-br from-[#BA5B55] to-[#803530] text-white font-black text-[9px] flex items-center justify-center shadow-xs ring-1 ring-amber-900/10">
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User size={20} />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight text-stone-500 mt-0.5 truncate max-w-[50px]">
            {user ? "Patron" : "Join"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default MobileBottomNav;
