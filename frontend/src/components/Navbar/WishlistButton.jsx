import React from "react";
import { Heart } from "@mynaui/icons-react";
import { useWishlist } from "../../context/WishlistContext";

const WishlistButton = () => {
  const { totalWishlistItems, openWishlist } = useWishlist();

  return (
    <button
      onClick={openWishlist}
      aria-label="View Saved Items"
      title="Saved Works"
      className="relative flex justify-center items-center p-2 text-[#1E180D] cursor-pointer hover:text-[#BA5B55] transition-colors group"
    >
      <Heart size={22} className={totalWishlistItems > 0 ? "text-[#BA5B55] fill-[#BA5B55]/15" : ""} />
      {totalWishlistItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-[#BA5B55] text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-xs">
          {totalWishlistItems > 99 ? '99+' : totalWishlistItems}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
