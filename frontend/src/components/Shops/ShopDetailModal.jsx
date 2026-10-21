import React, { useState, useEffect } from "react";
import { X, Star, MapPin, CheckCircle, Store, Send, Mail, User, ShieldCheck } from "@mynaui/icons-react";
import ProductCard from "../Catalog/ProductCard";
import ProductQuickView from "../Catalog/ProductQuickView";

const ShopDetailModal = ({ shopId, isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Inquiry form
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState("");
  const [inquiryError, setInquiryError] = useState("");

  useEffect(() => {
    if (isOpen && shopId) {
      setLoading(true);
      setInquirySuccess("");
      setInquiryError("");
      fetch(`/api/shops/${shopId}`)
        .then((res) => res.json())
        .then((json) => {
          setData(json);
        })
        .catch((err) => console.error("Error fetching shop detail:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, shopId]);

  if (!isOpen) return null;

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !inquiryMessage.trim()) return;

    setSendingInquiry(true);
    setInquiryError("");
    setInquirySuccess("");

    try {
      const res = await fetch(`/api/shops/${shopId}/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name: senderName.trim(),
          sender_email: senderEmail.trim(),
          message: inquiryMessage.trim()
        })
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to submit inquiry");

      setInquirySuccess(resData.message);
      setSenderName("");
      setSenderEmail("");
      setInquiryMessage("");
    } catch (err) {
      setInquiryError(err.message || "Failed to communicate with artisan");
    } finally {
      setSendingInquiry(false);
    }
  };

  const shop = data?.shop;
  const products = data?.products || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-amber-900/15 animate-modal-enter max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-3 border-[#BA5B55] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-gray-500 font-semibold">Opening Artisan Workshop...</p>
          </div>
        ) : !shop ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">Workshop not found.</p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {/* Banner & Header */}
            <div className="relative h-56 sm:h-64 bg-gray-900 overflow-hidden">
              <img
                src={shop.banner}
                alt={shop.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E180D] via-black/40 to-transparent"></div>

              {/* Logo & Info on Banner */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border-2 border-amber-200/60 shadow-xl overflow-hidden bg-white shrink-0">
                    <img
                      src={shop.logo}
                      alt={shop.owner_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-white">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-50">
                        {shop.name}
                      </h2>
                      <CheckCircle size={18} className="text-[#D4A373]" />
                    </div>
                    <p className="text-xs text-amber-200/90 font-medium flex items-center gap-1.5 mt-1">
                      <MapPin size={13} className="text-[#BA5B55]" />
                      <span>{shop.location}</span>
                      <span className="text-amber-500">•</span>
                      <span>Master Artisan: {shop.owner_name}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 text-xs font-bold text-gray-900 self-start sm:self-auto">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>{shop.rating} Master Rating</span>
                </div>
              </div>
            </div>

            {/* Workshop Story & Inquiry split */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 border-b border-gray-200/60">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#BA5B55]" />
                  <h3 className="text-base font-bold text-gray-900">Guild Provenance & Ethos</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-serif">
                  {shop.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-900/10 px-3 py-1 rounded-full font-semibold">
                    ✓ Verified Guild Workshop
                  </span>
                  <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-900/10 px-3 py-1 rounded-full font-semibold">
                    ✓ 100% Ancestral Methods
                  </span>
                  <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-900/10 px-3 py-1 rounded-full font-semibold">
                    ✓ Direct Artisan Compensation
                  </span>
                </div>
              </div>

              {/* Contact / Commission Box */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1 flex items-center gap-1.5">
                  <Mail size={14} className="text-[#BA5B55]" />
                  Commission a Custom Work
                </h4>
                <p className="text-[11px] text-gray-500 mb-3">
                  Direct inquiry to {shop.owner_name}
                </p>

                {inquirySuccess ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200">
                    {inquirySuccess}
                  </div>
                ) : (
                  <form onSubmit={handleSendInquiry} className="space-y-2">
                    {inquiryError && (
                      <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{inquiryError}</p>
                    )}
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    />
                    <textarea
                      required
                      rows={2}
                      placeholder="Describe your inquiry or custom order..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    />
                    <button
                      type="submit"
                      disabled={sendingInquiry}
                      className="w-full py-2 bg-[#1E180D] hover:bg-[#BA5B55] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Send size={13} />
                      <span>{sendingInquiry ? "Relaying Message..." : "Send Artisan Inquiry"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Workshop Creations Grid */}
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 font-serif mb-6">
                Creations by {shop.name} ({products.length})
              </h3>

              {products.length === 0 ? (
                <p className="text-xs text-gray-500">No active products listed currently.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{ ...product, shop_name: shop.name }}
                      onQuickView={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sub quick view if selected from workshop modal */}
      {selectedProduct && (
        <ProductQuickView
          isOpen={Boolean(selectedProduct)}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ShopDetailModal;
