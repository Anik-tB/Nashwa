import React, { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import { Search, Filter, Sparkles, Check, X } from "@mynaui/icons-react";
import { useCurrency } from "../../context/CurrencyContext";

const ProductGrid = ({
  products,
  isLoading,
  sortOrder,
  setSortOrder,
  searchQuery,
  onClearSearch,
  categoryTitle,
  onBuyNow,
  onOpenFaq
}) => {
  const { formatPrice } = useCurrency();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Additional Filter states
  const [priceFilter, setPriceFilter] = useState("all"); // 'all' | 'under50' | '50to100' | 'over100'
  const [ratingFilter, setRatingFilter] = useState("all"); // 'all' | 'high'
  const [selectedTag, setSelectedTag] = useState("all");

  // Extract all unique tags across products
  const availableTags = useMemo(() => {
    const tagsSet = new Set();
    products.forEach((p) => {
      if (p.tags) {
        p.tags.split(",").forEach((t) => tagsSet.add(t.trim()));
      }
    });
    return Array.from(tagsSet);
  }, [products]);

  // Filter products client-side for smooth real-time response
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Price filter
      if (priceFilter === "under50" && p.price >= 50) return false;
      if (priceFilter === "50to100" && (p.price < 50 || p.price > 100)) return false;
      if (priceFilter === "over100" && p.price <= 100) return false;

      // Rating filter
      if (ratingFilter === "high" && p.rating < 4.9) return false;

      // Tag filter
      if (selectedTag !== "all") {
        if (!p.tags || !p.tags.toLowerCase().includes(selectedTag.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [products, priceFilter, ratingFilter, selectedTag]);

  const hasActiveFacets = priceFilter !== "all" || ratingFilter !== "all" || selectedTag !== "all";

  const resetAllFacets = () => {
    setPriceFilter("all");
    setRatingFilter("all");
    setSelectedTag("all");
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-4 border-b border-gray-200/60 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
              Guild Catalog
            </span>
            <span className="text-xs text-gray-500">
              Showing {filteredProducts.length} of {products.length} works
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#1E180D] tracking-tight font-serif mt-1">
            {categoryTitle || "Curated Artisan Works"}
          </h2>

          {searchQuery && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500">
                Search query: <span className="font-semibold text-[#BA5B55]">"{searchQuery}"</span>
              </p>
              <button
                onClick={onClearSearch}
                className="text-xs text-[#BA5B55] hover:underline font-semibold cursor-pointer"
              >
                (Clear search)
              </button>
            </div>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Sort by:
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-800 font-semibold focus:outline-none focus:border-[#BA5B55] shadow-2xs cursor-pointer"
          >
            <option value="featured">✨ Guild Curated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Patron Rating</option>
          </select>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="mb-8 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-gray-700 text-xs flex items-center gap-1">
          <Filter size={14} className="text-[#BA5B55]" /> Filter:
        </span>

        {/* Price chips */}
        {[
          { id: "all", label: "All Prices" },
          { id: "under50", label: `Under ${formatPrice(50)}` },
          { id: "50to100", label: `${formatPrice(50)} – ${formatPrice(100)}` },
          { id: "over100", label: `${formatPrice(100)}+` }
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setPriceFilter(chip.id)}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
              priceFilter === chip.id
                ? "bg-[#1E180D] text-white shadow-2xs"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {chip.label}
          </button>
        ))}

        {/* Rating chip */}
        <button
          onClick={() => setRatingFilter(ratingFilter === "high" ? "all" : "high")}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
            ratingFilter === "high"
              ? "bg-[#BA5B55] text-white shadow-2xs"
              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
          }`}
        >
          ★ 4.9+ Master Grade
        </button>

        {/* Tags chips preview */}
        {availableTags.slice(0, 4).map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? "all" : tag)}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
              selectedTag === tag
                ? "bg-[#BA5B55] text-white shadow-2xs"
                : "bg-amber-50/70 text-amber-900 border border-amber-900/10 hover:bg-amber-100"
            }`}
          >
            #{tag}
          </button>
        ))}

        {/* Reset Facets */}
        {hasActiveFacets && (
          <button
            onClick={resetAllFacets}
            className="text-xs text-[#BA5B55] hover:text-[#9A423D] font-bold underline cursor-pointer ml-1"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-4 animate-pulse border border-gray-100 h-80">
              <div className="aspect-square bg-gray-100 rounded-2xl mb-4"></div>
              <div className="h-4 bg-gray-100 rounded-md w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded-md w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-100 rounded-md w-1/3"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 p-8 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-[#BA5B55] flex items-center justify-center mx-auto mb-3">
            <Search size={26} />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 font-serif">No artisan works match your filters</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Try loosening your price or rating parameters to discover more handcrafted creations.
          </p>
          <button
            onClick={() => {
              resetAllFacets();
              if (onClearSearch) onClearSearch();
            }}
            className="mt-5 px-5 py-2.5 bg-[#BA5B55] text-white rounded-xl text-xs font-bold hover:bg-[#a34d47] transition-all cursor-pointer shadow-md"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <ProductQuickView
        isOpen={Boolean(quickViewProduct)}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onBuyNow={onBuyNow}
        onOpenFaq={onOpenFaq}
      />
    </section>
  );
};

export default ProductGrid;
