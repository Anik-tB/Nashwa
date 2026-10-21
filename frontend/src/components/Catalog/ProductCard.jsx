import React, { useState } from "react";
import { Star, Cart, Check, Eye, Heart } from "@mynaui/icons-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCurrency } from "../../context/CurrencyContext";

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [justAdded, setJustAdded] = useState(false);

  const isSaved = isInWishlist(product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleView = () => {
    try {
      const list = JSON.parse(localStorage.getItem("nashwa_recently_viewed") || "[]");
      const filtered = list.filter((item) => item.id !== product.id);
      const updated = [product, ...filtered].slice(0, 6);
      localStorage.setItem("nashwa_recently_viewed", JSON.stringify(updated));
    } catch {}
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      onClick={handleView}
      className="group bg-white rounded-3xl overflow-hidden border border-amber-900/10 hover:border-[#BA5B55]/40 hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#F4EFEB]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
          {product.is_featured === 1 && (
            <span className="shimmer-badge text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-widest">
              Guild Reserve
            </span>
          )}
          {product.original_price > product.price && (
            <span className="bg-[#BA5B55] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm tracking-wider uppercase">
              Save {formatPrice(product.original_price - product.price)}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isSaved ? "Remove from saved works" : "Save to wishlist"}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-sm ${
            isSaved
              ? "bg-[#BA5B55] text-white scale-110"
              : "bg-white/80 hover:bg-white text-gray-700 hover:text-[#BA5B55]"
          }`}
        >
          <Heart size={16} className={isSaved ? "fill-white" : ""} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 backdrop-blur-md text-gray-900 text-xs font-bold px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={15} className="text-[#BA5B55]" /> View Craft Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#BA5B55] font-bold uppercase tracking-wider text-[10px]">
              {product.category_name || "Artisan Craft"}
            </span>
            <div className="flex items-center gap-1 text-amber-500 bg-amber-50/80 px-2 py-0.5 rounded-md">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-gray-900 text-[11px]">{product.rating}</span>
              {product.reviews_count > 0 && (
                <span className="text-gray-400 text-[10px]">({product.reviews_count})</span>
              )}
            </div>
          </div>

          <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#BA5B55] transition-colors font-serif">
            {product.name}
          </h3>

          {product.shop_name && (
            <p className="text-xs text-gray-500 mt-1.5 truncate">
              Guild: <span className="text-gray-800 font-semibold">{product.shop_name}</span>
            </p>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-gray-950 font-serif">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            className={`p-2 sm:px-3 sm:py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
              justAdded
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 hover:bg-[#BA5B55] text-gray-900 hover:text-white"
            }`}
          >
            {justAdded ? <Check size={16} /> : <Cart size={16} />}
            <span className="hidden sm:inline">
              {justAdded ? "Added" : "Add to Basket"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
