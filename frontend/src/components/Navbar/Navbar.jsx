import React from "react";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchInput from "./SearchInput";
import SearchButton from "./SearchButton";
import NotificationButton from "./NotificationButton";
import ProfileButton from "./ProfileButton";
import CartButton from "./CartButton";
import MenuButton from "./MenuButton";

const Navbar = () => {
  return (
    <nav className="bg-[#ffffff] px-6 py-3">
      <div className="flex items-center justify-between mx-auto">
        <div className="flex items-center gap-12">
          <Logo />
          <NavLinks />
        </div>

        <div className="flex w-xl mx-8">
          <SearchInput />
          <SearchButton />
        </div>

        <div className="flex items-center gap-6">
          <CartButton />
          <NotificationButton />
          <ProfileButton />
          <MenuButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
