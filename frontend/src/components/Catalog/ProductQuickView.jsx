import React, { useState, useEffect } from "react";
import { X, Star, Cart, Check, Heart, ShieldCheck, Sparkles, Send, Box } from "@mynaui/icons-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCurrency } from "../../context/CurrencyContext";
import ProvenanceModal from "./ProvenanceModal";

const ProductQuickView = ({ product, isOpen, onClose, onBuyNow }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'reviews' | 'care'
  const [provenanceOpen, setProvenanceOpen] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");

  const isSaved = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setActiveTab("details");
      setReviewSuccess("");

      // Record to Recently Admired in localStorage
      try {
        const list = JSON.parse(localStorage.getItem("nashwa_recently_viewed") || "[]");
        const filtered = list.filter((item) => item.id !== product.id);
        const updated = [product, ...filtered].slice(0, 6);
        localStorage.setItem("nashwa_recently_viewed", JSON.stringify(updated));
      } catch {}

      // Fetch reviews
      setLoadingReviews(true);
      fetch(`/api/products/${product.id}/reviews`)
        .then((res) => res.json())
        .then((data) => {
          setReviews(data.reviews || []);
        })
        .catch((err) => console.error("Error fetching reviews:", err))
        .finally(() => setLoadingReviews(false));
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleInstantBuy = () => {
    addToCart(product, quantity);
    onClose();
    if (onBuyNow) onBuyNow();
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: reviewerName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      setReviews((prev) => [data.review, ...prev]);
      setReviewSuccess("Your review has been verified and published!");
      setReviewerName("");
      setReviewComment("");
    } catch (err) {
      alert(err.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-amber-900/15 animate-modal-enter max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Image & Badges */}
          <div className="bg-[#F4EFEB] p-6 flex flex-col justify-between relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-amber-900/10">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.original_price > product.price && (
                <span className="absolute top-3 left-3 bg-[#BA5B55] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
                  Save {formatPrice(product.original_price - product.price)}
                </span>
              )}

              {/* Wishlist Heart */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Save to wishlist"
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                  isSaved
                    ? "bg-[#BA5B55] text-white"
                    : "bg-white/80 hover:bg-white text-gray-700 hover:text-[#BA5B55]"
                }`}
              >
                <Heart size={18} className={isSaved ? "fill-white" : ""} />
              </button>
            </div>

            {/* Guild Provenance Stamp */}
            <div className="mt-4 p-3.5 bg-white/80 backdrop-blur-xs rounded-xl border border-amber-900/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#BA5B55] flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-gray-900 truncate">
                  {product.shop_name ? `Guild: ${product.shop_name}` : "Verified Master Guild"}
                </p>
                <p className="text-[10px] text-gray-500">
                  {product.shop_location || "Ethically Sourced & Verified Provenance"}
                </p>
              </div>
            </div>
          </div>

          {/* Details & Tabs */}
          <div className="p-6 sm:p-7 flex flex-col justify-between bg-white">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
                  {product.category_name || "Artisan Goods"}
                </span>

                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < Math.floor(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-900">{product.rating}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-gray-950 font-serif leading-snug">
                {product.name}
              </h2>

              {/* Pricing & Provenance Trigger */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-[#1E180D] font-serif">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setProvenanceOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/70 hover:bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold border border-amber-900/10 cursor-pointer transition-colors shadow-2xs"
                >
                  <ShieldCheck size={13} className="text-[#BA5B55]" />
                  <span>Provenance Certificate</span>
                </button>
              </div>

              {/* Navigation Tabs inside modal */}
              <div className="mt-5 flex border-b border-gray-100 gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === "details"
                      ? "text-[#BA5B55] border-b-2 border-[#BA5B55] font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Craft Story
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-2 transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === "reviews"
                      ? "text-[#BA5B55] border-b-2 border-[#BA5B55] font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
                <button
                  onClick={() => setActiveTab("care")}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === "care"
                      ? "text-[#BA5B55] border-b-2 border-[#BA5B55] font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Guild Packaging & Care
                </button>
              </div>

              {/* Tab Contents */}
              <div className="mt-4">
                {activeTab === "details" && (
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {product.description}
                    </p>

                    {product.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {product.tags.split(",").map((tag) => (
                          <span
                            key={tag.trim()}
                            className="text-[10px] bg-amber-50/80 text-amber-900 border border-amber-900/10 px-2.5 py-0.5 rounded-full font-medium"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4 max-h-52 overflow-y-auto pr-1">
                    {/* Add Review Form */}
                    <form onSubmit={handleSubmitReview} className="p-3 bg-amber-50/50 rounded-xl border border-amber-900/10 space-y-2">
                      <p className="text-xs font-bold text-gray-900">Leave an Artisan Testimonial</p>
                      {reviewSuccess && (
                        <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium">{reviewSuccess}</p>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        >
                          <option value={5}>5 Stars (Exceptional)</option>
                          <option value={4}>4 Stars (Very Good)</option>
                          <option value={3}>3 Stars (Average)</option>
                        </select>
                      </div>
                      <textarea
                        required
                        rows={2}
                        placeholder="Share your thoughts on the craftsmanship..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-3 py-1 bg-[#BA5B55] hover:bg-[#a34d47] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>

                    {/* Review List */}
                    {loadingReviews ? (
                      <p className="text-xs text-gray-400">Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                      <p className="text-xs text-gray-500 py-2">No reviews yet. Be the first patron to review this piece!</p>
                    ) : (
                      reviews.map((r) => (
                        <div key={r.id} className="p-3 bg-white rounded-xl border border-gray-100 text-xs shadow-2xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900">{r.user_name}</span>
                            <div className="flex text-amber-400">
                              {[...Array(r.rating || 5)].map((_, i) => (
                                <Star key={i} size={11} className="fill-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-[11px]">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="space-y-2.5 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <Box size={16} className="text-[#BA5B55] shrink-0 mt-0.5" />
                      <p><strong className="text-gray-900">Artisan Packaging:</strong> Hand-wrapped in organic unbleached linen with a botanical wax seal and cedar shaving cushioning.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles size={16} className="text-[#BA5B55] shrink-0 mt-0.5" />
                      <p><strong className="text-gray-900">Care Advice:</strong> Wipe brass and pottery with a dry cotton cloth. Store botanical oils away from direct sunlight.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-200 cursor-pointer font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-gray-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-200 cursor-pointer font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={handleAddToCart}
                  className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  {added ? <Check size={16} /> : <Cart size={16} />}
                  <span>{added ? "Added!" : "Add to Basket"}</span>
                </button>

                <button
                  onClick={handleInstantBuy}
                  className="py-3 px-3 rounded-xl font-bold text-xs bg-[#BA5B55] hover:bg-[#a34d47] text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Instant Acquire</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provenance Certificate Modal */}
      <ProvenanceModal
        isOpen={provenanceOpen}
        onClose={() => setProvenanceOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductQuickView;
