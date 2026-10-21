import React from "react";
import { Home, Compass, Heart, Cart, User, UserCircle } from "@mynaui/icons-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const MobileBottomNav = ({
  activeTab,
  onNavigate,
  onOpenAuth,
  onOpenProfile
}) => {
  const { totalItems, openCart } = useCart();
  const { wishlist, openWishlist } = useWishlist();
  const { user } = useAuth();

  const handleAccountClick = () => {
    if (user) {
      if (onOpenProfile) onOpenProfile();
    } else {
      if (onOpenAuth) onOpenAuth("login");
    }
  };

  return (
    <aside
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-amber-900/10 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden pb-[max(env(safe-area-inset-bottom),10px)] pt-2"
    >
      <div className="grid grid-cols-5 items-center px-2">
        {/* Home */}
        <button
          onClick={() => onNavigate("home")}
          className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === "home"
              ? "text-[#BA5B55]"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Home size={22} className={activeTab === "home" ? "stroke-[2.5]" : ""} />
          <span className="text-[10px] font-bold mt-1 tracking-tight">Home</span>
        </button>

        {/* Guilds / Explore */}
        <button
          onClick={() => onNavigate("shops")}
          className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === "shops"
              ? "text-[#BA5B55]"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Compass size={22} className={activeTab === "shops" ? "stroke-[2.5]" : ""} />
          <span className="text-[10px] font-bold mt-1 tracking-tight">Guilds</span>
        </button>

        {/* Saved / Wishlist */}
        <button
          onClick={openWishlist}
          className="relative flex flex-col items-center justify-center py-1 text-gray-500 hover:text-[#BA5B55] transition-all active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#BA5B55] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length > 9 ? "9+" : wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 tracking-tight">Saved</span>
        </button>

        {/* Cart / Bag */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center justify-center py-1 text-gray-500 hover:text-[#BA5B55] transition-all active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <Cart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#BA5B55] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 tracking-tight">Basket</span>
        </button>

        {/* Patron Account */}
        <button
          onClick={handleAccountClick}
          className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-[#BA5B55] transition-all active:scale-95 cursor-pointer"
        >
          {user ? (
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#BA5B55] to-[#803530] text-white font-black text-[9px] flex items-center justify-center shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User size={22} />
          )}
          <span className="text-[10px] font-bold mt-1 tracking-tight">
            {user ? "Patron" : "Join"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default MobileBottomNav;
