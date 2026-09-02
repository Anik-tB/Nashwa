import React, { useState } from "react";
import { X, Star, Cart, Check, Heart } from "@mynaui/icons-react";
import { useCart } from "../../context/CartContext";

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-sm transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="h-64 sm:h-auto bg-gray-100 relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.original_price > product.price && (
              <span className="absolute top-4 left-4 bg-[#BA5B55] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                Save ${Math.round(product.original_price - product.price)}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#BA5B55] bg-[#BA5B55]/10 px-2 py-0.5 rounded-md">
                  {product.category_name || "Artisan Goods"}
                </span>
                {product.shop_name && (
                  <span className="text-xs text-gray-500 font-medium truncate">
                    by {product.shop_name}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviews_count} reviews)</span>
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-[#1E180D]">
                  ${product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {product.tags && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {product.tags.split(",").map((tag) => (
                    <span
                      key={tag.trim()}
                      className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-sm font-semibold text-gray-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-[#BA5B55] text-white hover:bg-[#a34d47]"
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <Cart size={18} />
                    Add to Cart • ${(product.price * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
