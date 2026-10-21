import React from 'react';
import { X, Heart, Trash, Cart, ArrowRight } from '@mynaui/icons-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

const WishlistDrawer = ({ onSelectProduct }) => {
  const { wishlist, removeFromWishlist, clearWishlist, isWishlistOpen, closeWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((p) => addToCart(p, 1));
    clearWishlist();
    closeWishlist();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={closeWishlist}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-amber-900/10">
          {/* Header */}
          <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#BA5B55]/10 text-[#BA5B55] flex items-center justify-center">
                <Heart size={18} className="fill-[#BA5B55]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">
                  Saved Artisan Works
                </h2>
                <p className="text-xs text-gray-500">
                  {wishlist.length} {wishlist.length === 1 ? 'creation' : 'creations'} bookmarked
                </p>
              </div>
            </div>

            <button
              onClick={closeWishlist}
              aria-label="Close wishlist"
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#BA5B55]/10 text-[#BA5B55] flex items-center justify-center mb-4">
                  <Heart size={32} />
                </div>
                <h3 className="text-base font-bold text-gray-900">Your wishlist is empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                  Click the heart icon on any craft or fragrance to save it to your personal slow living collection.
                </p>
                <button
                  onClick={closeWishlist}
                  className="mt-6 px-5 py-2.5 bg-[#BA5B55] text-white rounded-xl text-xs font-semibold hover:bg-[#a34d47] transition-all cursor-pointer shadow-xs"
                >
                  Explore Offerings
                </button>
              </div>
            ) : (
              wishlist.map((product) => (
                <div key={product.id} className="py-4 flex gap-4 items-center first:pt-0 last:pb-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-18 h-18 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100 cursor-pointer"
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(product);
                      closeWishlist();
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <h4
                        onClick={() => {
                          if (onSelectProduct) onSelectProduct(product);
                          closeWishlist();
                        }}
                        className="text-sm font-bold text-gray-900 leading-snug line-clamp-1 hover:text-[#BA5B55] cursor-pointer"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash size={15} />
                      </button>
                    </div>

                    <p className="text-xs text-[#BA5B55] font-semibold mt-0.5">
                      {formatPrice(product.price)}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="px-3 py-1.5 bg-gray-900 hover:bg-[#BA5B55] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Cart size={13} />
                        <span>Move to Basket</span>
                      </button>

                      {product.shop_name && (
                        <span className="text-[11px] text-gray-500 truncate max-w-[120px]">
                          by {product.shop_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer actions */}
          {wishlist.length > 0 && (
            <div className="p-6 bg-white border-t border-gray-100 space-y-3">
              <button
                onClick={handleMoveAllToCart}
                className="w-full py-3 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl text-xs font-bold tracking-wide uppercase shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Transfer All to Basket ({wishlist.length})</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={clearWishlist}
                className="w-full py-2 text-gray-400 hover:text-gray-700 text-xs font-semibold text-center transition-colors cursor-pointer"
              >
                Clear Saved Works
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
