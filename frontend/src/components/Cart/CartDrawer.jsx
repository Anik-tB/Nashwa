import React, { useState } from "react";
import { X, Trash, ArrowRight, Cart, Plus, Minus, Tag, Check, Sparkles, ShieldCheck } from "@mynaui/icons-react";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { triggerHaptic } from "../../lib/haptics";

const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    discountAmount,
    shippingFee,
    isFreeShipping,
    freeShippingThreshold,
    totalPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { formatPrice } = useCurrency();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError("");

    const res = await applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.error);
    } else {
      setCouponInput("");
    }
    setCouponLoading(false);
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-amber-900/10">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-white border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#BA5B55]/10 text-[#BA5B55] flex items-center justify-center">
                <Cart size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">
                  Your Basket ({totalItems})
                </h2>
                <p className="text-[11px] text-gray-500">
                  Supporting independent guild artisans
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerHaptic("light");
                closeCart();
              }}
              aria-label="Close cart"
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer touch-press"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="bg-amber-50/70 border-b border-amber-900/10 p-3.5 px-6">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#BA5B55]" />
                  {isFreeShipping ? (
                    <span className="text-emerald-700">Unlocked Complimentary Express Shipping!</span>
                  ) : (
                    <span>Add {formatPrice(amountToFreeShipping)} more for Free Shipping</span>
                  )}
                </span>
                <span className="text-[11px] text-amber-800">{progressPercent}%</span>
              </div>
              <div className="w-full bg-amber-200/50 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#D4A373] to-[#BA5B55] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#BA5B55]/10 text-[#BA5B55] flex items-center justify-center mb-4">
                  <Cart size={32} />
                </div>
                <h3 className="text-base font-bold text-gray-900">Your basket is empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                  Explore single-batch Sylhet oud attar, hand-hammered Dhamrai kasha teapots, and Sundarbans raw honey.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-5 py-2.5 bg-[#BA5B55] text-white rounded-xl text-xs font-bold hover:bg-[#a34d47] transition-all cursor-pointer shadow-sm"
                >
                  Explore Offerings
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-start first:pt-0 last:pb-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash size={15} />
                      </button>
                    </div>

                    <p className="text-xs text-[#BA5B55] font-semibold mt-0.5">
                      {formatPrice(item.product.price)} each
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          onClick={() => {
                            triggerHaptic("selection");
                            updateQuantity(item.product.id, item.quantity - 1);
                          }}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer text-xs font-bold touch-press"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold text-gray-900 min-w-6 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            triggerHaptic("selection");
                            updateQuantity(item.product.id, item.quantity + 1);
                          }}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer text-xs font-bold touch-press"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-gray-950 font-serif">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Promo Code & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-white space-y-4 pb-[max(env(safe-area-inset-bottom),16px)]">
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Tag size={14} className="text-emerald-600" />
                      <span>{appliedCoupon.code} applied!</span>
                      <span className="text-[11px] font-normal text-emerald-700">({appliedCoupon.description})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. NASHWA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 uppercase font-semibold focus:outline-none focus:border-[#BA5B55]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-4 py-2 bg-gray-900 hover:bg-[#BA5B55] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Craft Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Artisan Promo Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Nationwide Express Courier (64 Districts)</span>
                  <span className={isFreeShipping ? "text-emerald-700 font-bold" : "text-gray-900 font-semibold"}>
                    {isFreeShipping ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-gray-950 pt-2 border-t border-gray-100 font-serif">
                  <span>Total Due</span>
                  <span className="text-[#BA5B55]">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  triggerHaptic("medium");
                  closeCart();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer touch-press"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck size={13} className="text-[#BA5B55]" />
                <span>Direct Bengal Artisan Compensation • 100% Guaranteed Purity</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
