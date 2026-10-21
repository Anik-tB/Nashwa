import React, { useState } from "react";
import { X, CheckCircle, ShieldCheck, Truck, Lock, Gift, Sparkles, ArrowRight } from "@mynaui/icons-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";

const CheckoutModal = ({ isOpen, onClose, onTrackOrder }) => {
  const { items, subtotal, discountAmount, shippingFee, totalPrice, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [customerName, setCustomerName] = useState(user ? user.name : "");
  const [customerEmail, setCustomerEmail] = useState(user ? user.email : "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [packagingType, setPackagingType] = useState("linen"); // 'linen' | 'gift_box'
  const [giftNote, setGiftNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bkash"); // 'bkash' | 'nagad' | 'card' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !address.trim() || !city.trim()) {
      setError("Please complete all shipping address and contact fields.");
      return;
    }

    // Validate 11-digit Bangladesh mobile number
    const cleanedPhone = customerPhone.replace(/\D/g, "");
    if (!cleanedPhone.startsWith("01") || cleanedPhone.length !== 11) {
      setError("Please provide a valid 11-digit Bangladeshi mobile number (e.g., 017XXXXXXXX) for courier tracking & delivery.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const orderPayload = {
        user_id: user ? user.id : null,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        address: address.trim(),
        city: city.trim(),
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image
        })),
        total_amount: totalPrice,
        packaging_type: packagingType,
        gift_note: giftNote.trim() || null,
        payment_method: paymentMethod
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/15 max-h-[92vh] overflow-y-auto animate-modal-enter">
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
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-300">
              <CheckCircle size={36} />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Acquisition Confirmed
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-2 font-serif">
              Thank You, {orderConfirmed.customer_name}!
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
              Your acquisition <span className="font-mono font-bold text-gray-950">#NSW-{orderConfirmed.id}</span> has been dispatched to our artisan master workshops for hand-packaging and seal certification.
            </p>

            <div className="my-6 p-5 bg-white rounded-2xl border border-gray-200/80 text-left text-xs space-y-2.5 max-w-md mx-auto shadow-sm">
              <div className="flex justify-between text-gray-600">
                <span>Confirmation Dispatched to:</span>
                <span className="font-semibold text-gray-900">{orderConfirmed.customer_email}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Amount Paid:</span>
                <span className="font-bold text-[#BA5B55] text-sm font-serif">
                  {formatPrice(orderConfirmed.total_amount)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Status:</span>
                <span className="font-semibold text-emerald-700">Artisan Guild Packaged (Carbon Neutral)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {onTrackOrder && (
                <button
                  onClick={() => {
                    handleClose();
                    onTrackOrder(orderConfirmed.id);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#1E180D] hover:bg-black text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Truck size={15} />
                  <span>Track Artisan Journey</span>
                </button>
              )}

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Continue Exploring Guilds
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
                Secure Guild Checkout
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 font-serif">
                Delivery & Packaging
              </h2>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                    placeholder="e.g. ফারহান আহমেদ / Farhan Ahmed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center justify-between">
                    <span>Contact Number (বাংলাদেশ)</span>
                    <span className="text-[#BA5B55] text-[10px] font-semibold">Courier SMS & OTP</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 select-none">
                      🇧🇩 +88
                    </span>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-16 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                      placeholder="01712-345678"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                    Email for Tracking & Receipt
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                    placeholder="patron@example.com"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                    Delivery District / Hub
                  </label>
                  <select
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                  >
                    <option value="Dhaka">Dhaka (Inside City - 24h Express)</option>
                    <option value="Dhaka Suburbs">Dhaka Suburbs (Savar, Gazipur, Narayanganj)</option>
                    <option value="Chittagong">Chittagong (Chattogram City & Port)</option>
                    <option value="Sylhet">Sylhet (Barlekha, Moulvibazar, Sreemangal)</option>
                    <option value="Rajshahi">Rajshahi (Silk & Mango Region)</option>
                    <option value="Khulna">Khulna & Sundarbans Delta</option>
                    <option value="Barisal">Barisal (Riverine Division)</option>
                    <option value="Rangpur">Rangpur & Dinajpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                    <option value="Comilla">Comilla & Bijoypur</option>
                    <option value="Tangail">Tangail (Handloom Weavers Hub)</option>
                    <option value="Jessore">Jessore (Jashore Woodcraft Hub)</option>
                    <option value="Cox's Bazar">Cox's Bazar</option>
                    <option value="Bogra">Bogra (Bogura)</option>
                    <option value="All Other 64 Districts">All Other 64 Districts (Steadfast / Pathao Home Delivery)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                  Street Address & House / Apartment
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                  placeholder="House #, Road #, Sector / Area (e.g. House 14, Road 7, Gulshan-2)"
                />
              </div>

              {/* Packaging Preference */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                  Heritage Artisan Packaging
                </label>
                <select
                  value={packagingType}
                  onChange={(e) => setPackagingType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                >
                  <option value="linen">Natural Golden Jute & Wax Seal (Complimentary)</option>
                  <option value="gift_box">Heirloom Sundarban Wooden Box with Red Lac Seal (Complimentary)</option>
                </select>
              </div>

              {/* Gift Note */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center justify-between">
                  <span>Complimentary Calligraphed Note (Optional)</span>
                  <span className="text-gray-400 font-normal">Hand-inked Bengali/English script</span>
                </label>
                <input
                  type="text"
                  maxLength={120}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="e.g. 'শুভকামনা সহ, নাসওয়া ক্রাফটের পক্ষ থেকে।'"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                />
              </div>

              {/* Payment selector: bKash, Nagad, Card, Cash on Delivery */}
              <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock size={13} className="text-[#BA5B55]" />
                    Secured Payment Gateways (Bangladesh)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Instant & COD Supported
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === "bkash"
                        ? "border-[#E2136E] bg-pink-50 text-[#E2136E] ring-1 ring-[#E2136E]"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-[11px] font-black tracking-wide">bKash</span>
                    <span className="text-[9px] font-normal text-gray-500">বিকাশ পেমেন্ট</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === "nagad"
                        ? "border-[#F7941D] bg-orange-50 text-[#F7941D] ring-1 ring-[#F7941D]"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-[11px] font-black tracking-wide">Nagad</span>
                    <span className="text-[9px] font-normal text-gray-500">নগদ ওয়ালেট</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === "card"
                        ? "border-[#BA5B55] bg-amber-50/50 text-[#BA5B55] ring-1 ring-[#BA5B55]"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-[11px] font-bold">Cards / Bank</span>
                    <span className="text-[9px] font-normal text-gray-500">Visa / Master</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === "cod"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-[11px] font-bold">Cash on Delivery</span>
                    <span className="text-[9px] font-normal text-gray-500">সারা বাংলাদেশে ক্যাশ</span>
                  </button>
                </div>

                <div className="text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between">
                  <span>
                    {paymentMethod === "bkash" && "bKash Merchant Account: 01700-NASHWA (Automated Checkout)"}
                    {paymentMethod === "nagad" && "Nagad Direct Gateway: Instant 0% charge payment"}
                    {paymentMethod === "card" && "256-Bit SSLCommerz & International Cards Ready"}
                    {paymentMethod === "cod" && "Cash on Delivery available via Steadfast & Pathao Courier"}
                  </span>
                  <span className="text-emerald-700 font-bold shrink-0">Verified ৳</span>
                </div>
              </div>

              {/* Order Financial Summary */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-900/10 space-y-1.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Craft Subtotal ({items.length} works)</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Artisan Promo ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Nationwide Express Courier (Steadfast / Pathao 64 Districts)</span>
                  <span className={shippingFee === 0 ? "text-emerald-700 font-bold" : "font-semibold"}>
                    {shippingFee === 0 ? "Complimentary Free" : formatPrice(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-gray-950 pt-2 border-t border-amber-900/10 font-serif">
                  <span>Total Amount</span>
                  <span className="text-[#BA5B55]">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock size={15} />
                <span>
                  {isProcessing ? "Authenticating with Guild..." : `Confirm & Pay ${formatPrice(totalPrice)}`}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
