import React from "react";
import { Menu } from "@mynaui/icons-react";

const MenuButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle Navigation Menu"
      className="md:hidden flex justify-center items-center p-2 text-[#1E180D] cursor-pointer hover:text-[#BA5B55] transition-colors"
    >
      <Menu size={24} />
    </button>
  );
};

export default MenuButton;
