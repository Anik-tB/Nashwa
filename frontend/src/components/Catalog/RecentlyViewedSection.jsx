import React, { useState, useEffect } from "react";
import { Sparkles, Eye, Star } from "@mynaui/icons-react";
import { useCurrency } from "../../context/CurrencyContext";

const RecentlyViewedSection = ({ onSelectProduct }) => {
  const { formatPrice } = useCurrency();
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("nashwa_recently_viewed") || "[]");
      setRecentItems(stored);
    } catch {
      setRecentItems([]);
    }
  }, []);

  if (!recentItems || recentItems.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-8 border-t border-amber-900/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/70 rounded-full text-[10px] font-bold tracking-widest uppercase text-amber-900 mb-1.5">
            <Sparkles size={12} className="text-[#BA5B55]" />
            <span>Your Patron Journey</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">
            Recently Admired Pieces
          </h2>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("nashwa_recently_viewed");
            setRecentItems([]);
          }}
          className="text-xs font-semibold text-gray-400 hover:text-gray-700 underline cursor-pointer"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {recentItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectProduct && onSelectProduct(item)}
            className="group bg-white rounded-2xl p-2.5 border border-amber-900/10 hover:border-[#BA5B55]/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-amber-50/50 mb-2">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-2 rounded-full bg-white/95 text-gray-900 shadow-sm">
                  <Eye size={16} />
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-gray-400 truncate uppercase font-semibold">
                  {item.category_name || "Artisan"}
                </p>
                <h3 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-[#BA5B55] transition-colors">
                  {item.name}
                </h3>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-bold font-serif text-[#1E180D]">
                  {formatPrice(item.price)}
                </span>
                <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                  <Star size={10} className="fill-amber-400" />
                  {item.rating || 5.0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
