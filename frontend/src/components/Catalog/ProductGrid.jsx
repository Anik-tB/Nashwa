import React, { useState } from "react";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import { Search } from "@mynaui/icons-react";

const ProductGrid = ({
  products,
  isLoading,
  sortOrder,
  setSortOrder,
  searchQuery,
  onClearSearch,
  categoryTitle
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-gray-200/60 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E180D] tracking-tight">
            {categoryTitle || "Artisan Offerings"}
          </h2>
          {searchQuery && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-500">
                Search results for <span className="font-semibold text-[#BA5B55]">"{searchQuery}"</span>
              </p>
              <button
                onClick={onClearSearch}
                className="text-xs text-[#BA5B55] hover:underline font-semibold cursor-pointer"
              >
                (Clear)
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Sort by:
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-[#BA5B55] shadow-2xs cursor-pointer"
          >
            <option value="featured">Featured & Curated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse border border-gray-100">
              <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded-md w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 p-8">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-[#BA5B55] flex items-center justify-center mx-auto mb-3">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No artisan products found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search term or exploring another craft category.
          </p>
          {(searchQuery || categoryTitle) && (
            <button
              onClick={onClearSearch}
              className="mt-4 px-4 py-2 bg-[#BA5B55] text-white rounded-xl text-xs font-semibold hover:bg-[#a34d47] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
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
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};

export default ProductGrid;
