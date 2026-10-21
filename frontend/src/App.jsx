import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/Hero/HeroSection";
import CategorySection from "./components/Category/CategorySection";
import ProductGrid from "./components/Catalog/ProductGrid";
import ProductQuickView from "./components/Catalog/ProductQuickView";
import ShopsSection from "./components/Shops/ShopsSection";
import UniversitySection from "./components/University/UniversitySection";
import EventsSection from "./components/Events/EventsSection";
import CartDrawer from "./components/Cart/CartDrawer";
import WishlistDrawer from "./components/Wishlist/WishlistDrawer";
import CheckoutModal from "./components/Cart/CheckoutModal";
import OrdersModal from "./components/Orders/OrdersModal";
import OrderTrackingModal from "./components/Orders/OrderTrackingModal";
import LoginModal from "./components/LoginModal/LoginModal";
import PatronProfileModal from "./components/Account/PatronProfileModal";
import RecentlyViewedSection from "./components/Catalog/RecentlyViewedSection";
import ManifestoModal from "./components/Manifesto/ManifestoModal";
import ArtisanFaqModal from "./components/Common/ArtisanFaqModal";
import ArtisanConcierge from "./components/Common/ArtisanConcierge";
import Footer from "./components/Footer/Footer";
import MobileBottomNav from "./components/Navbar/MobileBottomNav";
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState(null);

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
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between text-gray-900 font-sans antialiased selection:bg-[#BA5B55]/20 selection:text-[#BA5B55] pb-16 md:pb-0">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#1E180D] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200 border border-amber-900/30">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
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
          if (tab !== "home" && tab !== "categories") clearAllFilters();
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={(view) => setAuthModal({ isOpen: true, view })}
        onOpenOrders={() => setOrdersOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenManifesto={() => setManifestoOpen(true)}
        onSelectProduct={(p) => setSelectedQuickViewProduct(p)}
      />

      {/* Main View Area based on activeTab */}
      <main className="flex-1">
        {activeTab === "home" && (
          <>
            <HeroSection
              onNavigate={(tab) => setActiveTab(tab)}
              onSearchPillClick={handleSearchPill}
              onOpenManifesto={() => setManifestoOpen(true)}
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
              onBuyNow={() => setCheckoutOpen(true)}
              onOpenFaq={() => setFaqOpen(true)}
            />

            {/* Recently Admired Works (Patron Journey) */}
            <RecentlyViewedSection onSelectProduct={(p) => setSelectedQuickViewProduct(p)} />
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
              onBuyNow={() => setCheckoutOpen(true)}
              onOpenFaq={() => setFaqOpen(true)}
            />
            <RecentlyViewedSection onSelectProduct={(p) => setSelectedQuickViewProduct(p)} />
          </div>
        )}

        {activeTab === "university" && <UniversitySection />}

        {activeTab === "events" && <EventsSection />}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} onOpenFaq={() => setFaqOpen(true)} />

      {/* Slide-over Drawers */}
      <CartDrawer onProceedToCheckout={() => setCheckoutOpen(true)} />
      <WishlistDrawer onSelectProduct={(p) => setSelectedQuickViewProduct(p)} />

      {/* Modals & Overlays */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onTrackOrder={(id) => setTrackingOrderId(id)}
      />

      <OrdersModal
        isOpen={ordersOpen}
        onClose={() => setOrdersOpen(false)}
      />

      <OrderTrackingModal
        orderId={trackingOrderId}
        isOpen={Boolean(trackingOrderId)}
        onClose={() => setTrackingOrderId(null)}
      />

      <ManifestoModal
        isOpen={manifestoOpen}
        onClose={() => setManifestoOpen(false)}
        onExplore={() => {
          setActiveTab("home");
          clearAllFilters();
        }}
      />

      <ArtisanFaqModal
        isOpen={faqOpen}
        onClose={() => setFaqOpen(false)}
      />

      {/* Quick View when triggered from search or wishlist */}
      {selectedQuickViewProduct && (
        <ProductQuickView
          isOpen={Boolean(selectedQuickViewProduct)}
          product={selectedQuickViewProduct}
          onClose={() => setSelectedQuickViewProduct(null)}
          onBuyNow={() => setCheckoutOpen(true)}
          onOpenFaq={() => setFaqOpen(true)}
        />
      )}

      {/* Patron Sign In & Join Modal */}
      <LoginModal
        isOpen={authModal.isOpen}
        initialView={authModal.view}
        onClose={() => setAuthModal({ isOpen: false, view: "login" })}
      />

      {/* Patron Profile & Guild Account Dashboard */}
      <PatronProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onOpenOrders={() => setOrdersOpen(true)}
      />

      {/* Floating Artisan Concierge Desk */}
      <ArtisanConcierge />

      {/* Luxury Mobile Bottom Navigation Bar (App Experience) */}
      <MobileBottomNav
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          clearAllFilters();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenAuth={(view) => setAuthModal({ isOpen: true, view: view || "login" })}
        onOpenProfile={() => setProfileOpen(true)}
      />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <WishlistProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </WishlistProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
};

export default App;
