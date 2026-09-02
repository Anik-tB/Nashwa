import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";

import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/Hero/HeroSection";
import CategorySection from "./components/Category/CategorySection";
import ProductGrid from "./components/Catalog/ProductGrid";
import ShopsSection from "./components/Shops/ShopsSection";
import UniversitySection from "./components/University/UniversitySection";
import EventsSection from "./components/Events/EventsSection";
import CartDrawer from "./components/Cart/CartDrawer";
import CheckoutModal from "./components/Cart/CheckoutModal";
import OrdersModal from "./components/Orders/OrdersModal";
import LoginModal from "./components/LoginModal/LoginModal";
import Footer from "./components/Footer/Footer";
import { Check } from "@mynaui/icons-react";

const MainApp = () => {
  const { toast } = useCart();

  // Navigation & Filtering State
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");

  // Data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Modals state
  const [authModal, setAuthModal] = useState({ isOpen: false, view: "login" });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  // Fetch Categories once
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  // Fetch Products based on search, category, shop, and sort
  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.append("q", searchQuery.trim());
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedShop) params.append("shop", selectedShop);
    if (sortOrder) params.append("sort", sortOrder);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setProducts(data.products || []);
          setLoadingProducts(false);
        }
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        if (isMounted) setLoadingProducts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory, selectedShop, sortOrder]);

  const handleSearchPill = (term) => {
    setSearchQuery(term);
    setSelectedCategory(null);
    setSelectedShop(null);
    setActiveTab("home");
  };

  const handleSelectCategory = (slug) => {
    setSelectedCategory(slug);
    setSelectedShop(null);
    if (slug) {
      setActiveTab("home");
    }
  };

  const handleSelectShop = (shopId) => {
    setSelectedShop(shopId);
    setSelectedCategory(null);
    setActiveTab("home");
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedShop(null);
  };

  // Determine Category title for Product Grid
  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const categoryTitle = selectedShop
    ? "Shop Offerings"
    : activeCategoryObj
    ? activeCategoryObj.name
    : searchQuery
    ? `Search Results`
    : "Curated Artisan Goods";

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col justify-between text-gray-900 font-sans antialiased selection:bg-[#BA5B55]/20 selection:text-[#BA5B55]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E180D] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200 border border-amber-900/30">
          <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
            <Check size={14} />
          </div>
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== "home") clearAllFilters();
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={(view) => setAuthModal({ isOpen: true, view })}
        onOpenOrders={() => setOrdersOpen(true)}
      />

      {/* Main View Area based on activeTab */}
      <main className="flex-1">
        {activeTab === "home" && (
          <>
            <HeroSection
              onNavigate={(tab) => setActiveTab(tab)}
              onSearchPillClick={handleSearchPill}
            />

            <CategorySection
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />

            <ProductGrid
              products={products}
              isLoading={loadingProducts}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              searchQuery={searchQuery}
              onClearSearch={clearAllFilters}
              categoryTitle={categoryTitle}
            />
          </>
        )}

        {activeTab === "shops" && (
          <ShopsSection onSelectShop={handleSelectShop} />
        )}

        {activeTab === "categories" && (
          <div className="pt-6">
            <CategorySection
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
            <ProductGrid
              products={products}
              isLoading={loadingProducts}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              searchQuery={searchQuery}
              onClearSearch={clearAllFilters}
              categoryTitle={categoryTitle}
            />
          </div>
        )}

        {activeTab === "university" && <UniversitySection />}

        {activeTab === "events" && <EventsSection />}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Modals & Overlays */}
      <CartDrawer onProceedToCheckout={() => setCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />

      <OrdersModal
        isOpen={ordersOpen}
        onClose={() => setOrdersOpen(false)}
      />

      <LoginModal
        isOpen={authModal.isOpen}
        initialView={authModal.view}
        onClose={() => setAuthModal({ isOpen: false, view: "login" })}
      />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
