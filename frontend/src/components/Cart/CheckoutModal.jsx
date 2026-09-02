import React, { useState } from "react";
import { X, CheckCircle, ShieldCheck, Truck, Lock } from "@mynaui/icons-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const CheckoutModal = ({ isOpen, onClose }) => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user ? user.name : "");
  const [customerEmail, setCustomerEmail] = useState(user ? user.email : "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const cardNumber = "4242 •••• •••• 4242";
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !address.trim() || !city.trim()) {
      setError("Please complete all shipping address fields.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const orderPayload = {
        user_id: user ? user.id : null,
        customer_name: customerName,
        customer_email: customerEmail,
        address,
        city,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image
        })),
        total_amount: totalPrice
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      setOrderConfirmed(data.order);
      clearCart();
    } catch (err) {
      setError(err.message || "Failed to submit order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setOrderConfirmed(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {orderConfirmed ? (
          /* Order Confirmation View */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#BA5B55] bg-[#BA5B55]/10 px-3 py-1 rounded-full">
              Order Confirmed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 font-serif">
              Thank You, {orderConfirmed.customer_name}!
            </h2>
            <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
              Your order <span className="font-mono font-bold text-gray-900">#NSW-{orderConfirmed.id}</span> has been routed directly to our artisan workshops.
            </p>

            <div className="my-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-gray-600">
                <span>Confirmation sent to:</span>
                <span className="font-semibold text-gray-900">{orderConfirmed.customer_email}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Amount Paid:</span>
                <span className="font-bold text-[#BA5B55] text-sm">${orderConfirmed.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery:</span>
                <span className="font-semibold text-gray-900">3-5 Business Days (Tracked)</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        ) : (
          /* Checkout Form View */
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
                Secure Artisan Checkout
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                Shipping & Payment
              </h2>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-xs font-medium bg-red-50 text-red-800 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] text-sm text-gray-900"
                    placeholder="Layla Mansoor"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Email for Tracking
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] text-sm text-gray-900"
                    placeholder="layla@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] text-sm text-gray-900"
                  placeholder="Apartment, suite, street number"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    City / Region
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] text-sm text-gray-900"
                    placeholder="Marrakech, London, New York..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 flex items-center justify-between">
                    <span>Payment Method</span>
                    <span className="text-green-600 flex items-center gap-1 font-normal text-[10px]">
                      <Lock size={12} /> Encrypted Demo
                    </span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={cardNumber}
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Order items preview summary */}
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Order Items ({items.length})
                </p>
                <div className="max-h-32 overflow-y-auto divide-y divide-gray-200/60 text-xs text-gray-600">
                  {items.map((i) => (
                    <div key={i.id} className="py-1.5 flex justify-between">
                      <span className="truncate pr-2">{i.quantity}x {i.product.name}</span>
                      <span className="font-semibold text-gray-900 shrink-0">
                        ${(i.product.price * i.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2.5 mt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
                  <span>Total Due:</span>
                  <span className="text-lg text-[#BA5B55] font-extrabold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 py-1">
                <span className="flex items-center gap-1">
                  <Truck size={14} className="text-[#BA5B55]" /> Free Insured Shipping
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-[#BA5B55]" /> 100% Artisan Guarantee
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3.5 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                  isProcessing ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <Lock size={16} />
                {isProcessing ? "Processing Order..." : `Confirm & Place Order ($${totalPrice.toFixed(2)})`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
