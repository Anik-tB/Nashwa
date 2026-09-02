import React from "react";
import { Sparkles, ArrowRight, BookOpen, Compass, Coffee } from "@mynaui/icons-react";

const HeroSection = ({ onNavigate, onSearchPillClick }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-[#F2F4F7] to-[#F2F4F7] py-12 md:py-20 border-b border-gray-100">
      {/* Decorative ambient blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#BA5B55]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-2xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#BA5B55]/20 text-[#BA5B55] text-xs font-semibold shadow-xs mb-6 backdrop-blur-xs">
            <Sparkles size={16} className="text-[#BA5B55]" />
            <span>Curated Artisan Marketplace & Growth Academy</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E180D] tracking-tight leading-[1.12] font-serif">
            The Path to <span className="text-[#BA5B55]">Growth</span>, Crafted by Soulful Hands.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
            Discover single-batch artisan crafts, cold-distilled botanicals, ancient spice routes, and masterclasses dedicated to intentional living and sustainable growth.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate("shops")}
              className="px-6 py-3.5 rounded-2xl bg-[#BA5B55] text-white font-semibold text-sm hover:bg-[#a34d47] transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <Compass size={18} />
              Explore Artisan Shops
            </button>
            <button
              onClick={() => onNavigate("university")}
              className="px-6 py-3.5 rounded-2xl bg-white text-gray-900 font-semibold text-sm border border-gray-200 hover:border-[#BA5B55] hover:text-[#BA5B55] transition-all shadow-xs hover:shadow-sm active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <BookOpen size={18} />
              Nashwa University
            </button>
            <button
              onClick={() => onNavigate("events")}
              className="px-6 py-3.5 rounded-2xl bg-amber-500/10 text-amber-900 font-semibold text-sm border border-amber-500/20 hover:bg-amber-500/20 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <Coffee size={18} />
              Feasts & Events
            </button>
          </div>

          {/* Search Suggestion Pills */}
          <div className="mt-8 flex items-center justify-center flex-wrap gap-2 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Popular:</span>
            {["Amber Oud", "Damascus Teapot", "Sidr Honey", "Terracotta", "Scent Distillation"].map((pill) => (
              <button
                key={pill}
                onClick={() => onSearchPillClick(pill)}
                className="px-3 py-1 bg-white hover:bg-[#BA5B55]/10 hover:text-[#BA5B55] hover:border-[#BA5B55]/30 border border-gray-200 rounded-full transition-colors cursor-pointer text-gray-700 font-medium"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-gray-200/60 pt-10">
          <div className="text-center p-4 bg-white/60 backdrop-blur-xs rounded-2xl border border-gray-100">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#BA5B55]">500+</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Independent Artisans</p>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-xs rounded-2xl border border-gray-100">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1E180D]">100%</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Ethically Sourced</p>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-xs rounded-2xl border border-gray-100">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#BA5B55]">50+</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Growth Masterclasses</p>
          </div>
          <div className="text-center p-4 bg-white/60 backdrop-blur-xs rounded-2xl border border-gray-100">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1E180D]">12,000+</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Community Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
