import React, { useState, useEffect } from "react";
import { Star, MapPin, CheckCircle, ArrowRight, Store, Mail, Sparkles } from "@mynaui/icons-react";
import ShopDetailModal from "./ShopDetailModal";

const ShopsSection = ({ onSelectShop }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShopId, setModalShopId] = useState(null);

  useEffect(() => {
    fetch("/api/shops")
      .then((res) => res.json())
      .then((data) => setShops(data.shops || []))
      .catch((err) => console.error("Error fetching shops:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#BA5B55] bg-[#BA5B55]/10 px-3 py-1 rounded-full">
          Master Guilds & Heritage Studios
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1E180D] mt-3 tracking-tight font-serif">
          The Artisan Workshops
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
          Every piece in Nashwa is crafted with dignity, generational mastery, and transparent fair-trade economics. Meet the masters keeping ancestral traditions alive.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-80"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="group bg-white rounded-3xl overflow-hidden border border-amber-900/10 hover:border-[#BA5B55]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Shop Banner */}
                <div
                  onClick={() => setModalShopId(shop.id)}
                  className="h-44 w-full relative overflow-hidden bg-gray-100 cursor-pointer"
                >
                  <img
                    src={shop.banner}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Rating badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1 text-xs font-bold text-gray-900">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{shop.rating}</span>
                  </div>

                  {/* Logo avatar */}
                  <div className="absolute -bottom-4 left-6 w-16 h-16 rounded-2xl border-2 border-white shadow-lg overflow-hidden bg-white">
                    <img
                      src={shop.logo}
                      alt={shop.owner_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Shop Information */}
                <div className="p-6 pt-7">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <MapPin size={13} className="text-[#BA5B55]" />
                    <span>{shop.location}</span>
                  </div>

                  <h3
                    onClick={() => setModalShopId(shop.id)}
                    className="text-xl font-bold text-gray-900 group-hover:text-[#BA5B55] transition-colors flex items-center gap-1.5 font-serif cursor-pointer"
                  >
                    {shop.name}
                    <CheckCircle size={16} className="text-[#BA5B55]" />
                  </h3>

                  <p className="text-xs text-amber-900/80 font-semibold mt-0.5">
                    Master Craftsman: {shop.owner_name}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                    {shop.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => setModalShopId(shop.id)}
                  className="w-full py-2.5 px-4 bg-amber-50/70 hover:bg-amber-100/80 text-amber-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-900/10"
                >
                  <Sparkles size={14} className="text-[#BA5B55]" />
                  <span>Workshop Story & Commission</span>
                </button>

                <button
                  onClick={() => onSelectShop && onSelectShop(shop.id)}
                  className="w-full py-2.5 px-4 bg-gray-900 hover:bg-[#BA5B55] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group/btn shadow-xs"
                >
                  <Store size={14} />
                  <span>Browse Workshop Offerings ({shop.product_count || 0})</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Workshop Profile Modal */}
      <ShopDetailModal
        shopId={modalShopId}
        isOpen={Boolean(modalShopId)}
        onClose={() => setModalShopId(null)}
      />
    </div>
  );
};

export default ShopsSection;
