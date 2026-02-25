import React from "react";

const NavLinks = () => {
  return (
    <div className="flex items-center gap-8 cursor-pointer">
      <a
        href=""
        className="text-sm text-[#1E180D] hover:text-[#BA5B55] transition-colors leading-none"
      >
        Shops
      </a>
      <a
        href=""
        className="text-sm text-[#1E180D] hover:text-[#BA5B55] transition-colors leading-none"
      >
        Category
      </a>
      <a
        href=""
        className="text-sm text-[#1E180D] hover:text-[#BA5B55] transition-colors leading-none"
      >
        University
      </a>
      <a
        href=""
        className="text-sm text-[#1E180D] hover:text-[#BA5B55] transition-colors leading-none"
      >
        Feasts & Events
      </a>
    </div>
  );
};

export default NavLinks;
