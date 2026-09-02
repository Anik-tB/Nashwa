import React from "react";

const NavLinks = ({ activeTab, setActiveTab }) => {
  const links = [
    { id: "home", label: "Home" },
    { id: "shops", label: "Shops" },
    { id: "categories", label: "Categories" },
    { id: "university", label: "University" },
    { id: "events", label: "Feasts & Events" },
  ];

  return (
    <div className="hidden md:flex items-center gap-6 lg:gap-8">
      {links.map((link) => {
        const isActive = activeTab === link.id;
        return (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`text-sm font-medium transition-all duration-150 leading-none cursor-pointer py-1 relative ${
              isActive
                ? "text-[#BA5B55] font-semibold"
                : "text-[#1E180D]/80 hover:text-[#BA5B55]"
            }`}
          >
            {link.label}
            {isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#BA5B55] rounded-full"></span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default NavLinks;
