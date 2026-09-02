import React, { useState } from "react";
import { Star, Cart, Check, Eye } from "@mynaui/icons-react";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#BA5B55]/30 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.is_featured === 1 && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs tracking-wider">
              Artisan Pick
            </span>
          )}
          {product.original_price > product.price && (
            <span className="bg-[#BA5B55] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Save ${(product.original_price - product.price).toFixed(0)}
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 backdrop-blur-xs text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye size={16} /> Quick View
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#BA5B55] font-semibold truncate">
              {product.category_name || "Handcrafted"}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-800 text-[11px]">{product.rating}</span>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#BA5B55] transition-colors">
            {product.name}
          </h3>

          {product.shop_name && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              by <span className="text-gray-700 font-medium">{product.shop_name}</span>
            </p>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              justAdded
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-[#BA5B55] text-gray-800 hover:text-white"
            }`}
          >
            {justAdded ? <Check size={16} /> : <Cart size={16} />}
            <span className="hidden sm:inline font-semibold">
              {justAdded ? "Added" : "Add"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
