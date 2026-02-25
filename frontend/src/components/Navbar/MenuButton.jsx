import React from "react";
import { Menu } from "@mynaui/icons-react";

const MenuButton = () => {
  return (
    <button className="relative p-2 text-[#1E180D] cursor-pointer hover:text-[#BA5B55] transition-colors group">
      <Menu size={24} />
    </button>
  );
};

export default MenuButton;
