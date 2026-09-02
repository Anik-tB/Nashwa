import React from "react";
import { Cart } from "@mynaui/icons-react";
import { useCart } from "../../context/CartContext";

const CartButton = () => {
  const { totalItems, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      aria-label="Open Shopping Cart"
      className="relative flex justify-center items-center p-2 text-[#1E180D] cursor-pointer hover:text-[#BA5B55] transition-colors group"
    >
      <Cart size={24} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#BA5B55] text-white text-[11px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center shadow-sm animate-pulse">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartButton;
