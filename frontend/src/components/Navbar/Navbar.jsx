import React, { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchInput from "./SearchInput";
import SearchButton from "./SearchButton";
import NotificationButton from "./NotificationButton";
import ProfileButton from "./ProfileButton";
import CartButton from "./CartButton";
import WishlistButton from "./WishlistButton";
import MenuButton from "./MenuButton";
import AnnouncementBar from "./AnnouncementBar";
import { Search, Sparkles, ArrowRight } from "@mynaui/icons-react";
import { useCurrency } from "../../context/CurrencyContext";

const Navbar = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAuth,
  onOpenOrders,
  onOpenProfile,
  onOpenManifesto,
  onSelectProduct
}) => {
  const { formatPrice, currency, setCurrency } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Handle autocomplete search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(searchQuery.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions((data.products || []).slice(0, 4));
        })
        .catch(() => {});
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      setActiveTab("home");
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "shops", label: "Guilds & Studios" },
    { id: "categories", label: "Craft Categories" },
    { id: "university", label: "Academy" },
    { id: "events", label: "Feasts & Gatherings" },
  ];

  const renderSuggestionsList = () => (
    <div className="divide-y divide-gray-50 mt-1">
      {suggestions.map((p) => (
        <div
          key={p.id}
          onClick={() => {
            setShowSuggestions(false);
            if (onSelectProduct) onSelectProduct(p);
          }}
          className="py-2 px-2 hover:bg-amber-50/70 rounded-xl flex items-center gap-3 cursor-pointer transition-colors"
        >
          <img
            src={p.image}
            alt={p.name}
            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
            <p className="text-[10px] text-gray-500 truncate">
              {p.shop_name ? `by ${p.shop_name}` : p.category_name}
            </p>
          </div>
          <span className="text-xs font-bold text-[#BA5B55] font-serif shrink-0">
            {formatPrice(p.price)}
          </span>
        </div>
      ))}
      <button
        onClick={handleSearchSubmit}
        className="w-full mt-2 pt-2 border-t border-gray-100 text-center text-xs font-bold text-gray-700 hover:text-[#BA5B55] flex items-center justify-center gap-1 cursor-pointer"
      >
        <span>View all results for "{searchQuery}"</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <AnnouncementBar onOpenManifesto={onOpenManifesto} />

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Main Nav */}
            <div className="flex items-center gap-7 lg:gap-10">
              <Logo onClick={() => setActiveTab("home")} />
              <NavLinks activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Desktop Search Bar with Live Autocomplete */}
            <div ref={searchContainerRef} className="hidden sm:flex flex-1 max-w-md mx-4 relative">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full flex items-center"
              >
                <SearchInput
                  value={searchQuery}
                  onChange={(val) => {
                    setSearchQuery(val);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit(e);
                  }}
                />
                <SearchButton onClick={handleSearchSubmit} />
              </form>

              {/* Suggestions Popover Desktop */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 pb-1.5 border-b border-gray-100 flex items-center justify-between">
                    <span>Matching Artisan Works</span>
                    <span className="text-[#BA5B55]">{suggestions.length} Found</span>
                  </div>
                  {renderSuggestionsList()}
                </div>
              )}
            </div>

            {/* Right Actions: Responsive for Desktop vs Phone */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Desktop Only Buttons (On Mobile these are in the Bottom Bar) */}
              <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
                <WishlistButton />
                <CartButton />
                <ProfileButton
                  onOpenAuth={onOpenAuth}
                  onOpenOrders={onOpenOrders}
                  onOpenProfile={onOpenProfile}
                />
              </div>

              {/* Mobile Quick Currency Switcher */}
              <button
                type="button"
                onClick={() => setCurrency(currency === "BDT" ? "USD" : "BDT")}
                className="md:hidden px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-[#BA5B55] rounded-xl text-[11px] font-bold border border-amber-500/20 cursor-pointer transition-colors active:scale-95"
                title="Toggle Currency"
              >
                {currency === "BDT" ? "৳ BDT" : "$ USD"}
              </button>

              <NotificationButton />
              <MenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
            </div>
          </div>

          {/* Mobile Search bar with Live Autocomplete */}
          <div ref={mobileSearchRef} className="sm:hidden mt-2.5 relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <SearchInput
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit(e);
                }}
              />
              <SearchButton onClick={handleSearchSubmit} />
            </form>

            {/* Mobile Suggestions Popover */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-72 overflow-y-auto">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 pb-1.5 border-b border-gray-100 flex items-center justify-between">
                  <span>Matching Works</span>
                  <span className="text-[#BA5B55]">{suggestions.length} Found</span>
                </div>
                {renderSuggestionsList()}
              </div>
            )}
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
                  className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === item.id
                      ? "bg-[#BA5B55]/10 text-[#BA5B55]"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenManifesto) onOpenManifesto();
                }}
                className="text-left px-3 py-2 rounded-xl text-xs font-bold text-[#BA5B55] hover:bg-amber-50"
              >
                The Slow Craft Manifesto
              </button>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
