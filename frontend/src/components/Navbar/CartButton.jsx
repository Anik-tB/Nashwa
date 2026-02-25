import React from "react";
import { Cart } from "@mynaui/icons-react";

const CartButton = () => {
  return (
    <button className="flex justify-center items-center p-2 text-[#1E180D] cursor-pointer hover:text-[#BA5B55] transition-colors group">
      <Cart size={24} />
    </button>
  );
};

export default CartButton;
