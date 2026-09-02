import React, { useState, useEffect } from "react";
import { Star, MapPin, CheckCircle, ArrowRight, Store } from "@mynaui/icons-react";

const ShopsSection = ({ onSelectShop }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <span className="text-xs font-bold uppercase tracking-wider text-[#BA5B55] bg-[#BA5B55]/10 px-3 py-1 rounded-full">
          Master Guilds & Studios
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E180D] mt-3 tracking-tight font-serif">
          The Artisan Workshops
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
          Every item in Nashwa is crafted with dignity, heritage mastery, and generational knowledge. Explore the independent artisans behind the craft.
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
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#BA5B55]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Shop Banner */}
                <div className="h-44 w-full relative overflow-hidden bg-gray-100">
                  <img
                    src={shop.banner}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Rating badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1 text-xs font-bold text-gray-900">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span>{shop.rating}</span>
                  </div>

                  {/* Logo avatar */}
                  <div className="absolute -bottom-4 left-6 w-16 h-16 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-white">
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
                    <MapPin size={14} className="text-[#BA5B55]" />
                    <span>{shop.location}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#BA5B55] transition-colors flex items-center gap-1.5">
                    {shop.name}
                    <CheckCircle size={16} className="text-[#BA5B55]" />
                  </h3>

                  <p className="text-xs text-amber-900/80 font-medium mt-0.5">
                    Master Artisan: {shop.owner_name}
                  </p>

                  <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                    {shop.description}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectShop && onSelectShop(shop.id)}
                  className="w-full py-2.5 px-4 bg-gray-50 hover:bg-[#BA5B55] text-gray-800 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
                >
                  <Store size={16} />
                  <span>Browse Shop Products ({shop.product_count || 0})</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopsSection;
