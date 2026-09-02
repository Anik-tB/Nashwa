import React, { useState } from "react";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchInput from "./SearchInput";
import SearchButton from "./SearchButton";
import NotificationButton from "./NotificationButton";
import ProfileButton from "./ProfileButton";
import CartButton from "./CartButton";
import MenuButton from "./MenuButton";

const Navbar = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAuth,
  onOpenOrders
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    // Setting activeTab to 'home' or products if searching
    if (searchQuery.trim()) {
      setActiveTab("home");
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "shops", label: "Shops" },
    { id: "categories", label: "Categories" },
    { id: "university", label: "University" },
    { id: "events", label: "Feasts & Events" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8 lg:gap-10">
            <Logo onClick={() => setActiveTab("home")} />
            <NavLinks activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 max-w-md mx-4 items-center"
          >
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit(e);
              }}
            />
            <SearchButton onClick={handleSearchSubmit} />
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <CartButton />
            <NotificationButton />
            <ProfileButton
              onOpenAuth={onOpenAuth}
              onOpenOrders={onOpenOrders}
            />
            <MenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          </div>
        </div>

        {/* Mobile Search bar */}
        <div className="sm:hidden mt-2.5">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit(e);
              }}
            />
            <SearchButton onClick={handleSearchSubmit} />
          </form>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1 pb-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-[#BA5B55]/10 text-[#BA5B55] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
