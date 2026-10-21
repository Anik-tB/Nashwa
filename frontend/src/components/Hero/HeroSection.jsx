import React from "react";
import { Sparkles, BookOpen, Compass, ShieldCheck } from "@mynaui/icons-react";
import { triggerHaptic } from "../../lib/haptics";

const HeroSection = ({ onNavigate, onSearchPillClick, onOpenManifesto }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#F5EFE6]/70 via-[#FAF8F5] to-[#FAF8F5] py-8 sm:py-16 md:py-20 border-b border-amber-900/10">
      {/* Decorative ambient gold blurs */}
      <div className="absolute top-0 right-1/4 w-[320px] sm:w-[450px] h-[320px] sm:h-[450px] bg-[#BA5B55]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute -bottom-10 left-6 sm:left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#D4A373]/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/90 border border-amber-900/15 text-[#BA5B55] text-[11px] sm:text-xs font-bold shadow-xs mb-4 sm:mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-[#D4A373]" />
            <span className="tracking-wide">Artisan Guild Marketplace & Living Academy</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-[#1E180D] tracking-tight leading-[1.2] font-serif">
            The Path to <span className="text-[#BA5B55] italic font-serif">Growth</span>, Crafted by Living Hands.
          </h1>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-5 text-xs sm:text-lg text-gray-600 leading-relaxed font-normal max-w-2xl mx-auto px-2">
            Discover singular small-batch artisan creations: aged Sylhet Dehn Al-Oud, hand-hammered Dhamrai bell-metal (কাঁসা), wild Sundarbans raw honey, and Sonargaon heritage weaves.
          </p>

          {/* Call to action buttons */}
          <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                triggerHaptic("medium");
                onNavigate("shops");
              }}
              className="px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl bg-[#BA5B55] hover:bg-[#a34d47] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg touch-press cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Compass size={18} />
              <span>Explore Bengal Guilds</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic("light");
                onNavigate("university");
              }}
              className="px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl bg-white text-gray-900 font-bold text-xs uppercase tracking-wider border border-gray-200 hover:border-[#BA5B55] hover:text-[#BA5B55] transition-all shadow-2xs hover:shadow-xs touch-press cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <BookOpen size={18} />
              <span>Nashwa Academy</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic("light");
                onOpenManifesto();
              }}
              className="px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-amber-500/10 text-amber-950 font-bold text-xs uppercase tracking-wider border border-amber-500/20 hover:bg-amber-500/20 transition-all touch-press cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ShieldCheck size={18} className="text-[#BA5B55]" />
              <span>Our Manifesto</span>
            </button>
          </div>

          {/* Search Suggestion Pills - Horizontal Mobile Snap */}
          <div className="mt-5 sm:mt-8 flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar snap-carousel gap-2 text-xs text-gray-500 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className="font-bold text-gray-800 shrink-0 text-xs">Popular:</span>
            {["Sylhet Dehn Al-Oud", "Dhamrai Kasha Teapot", "Sundarbans Raw Honey", "Bijoypur Terracotta", "Tangail Indigo Khadi", "Matir Bhar"].map((pill) => (
              <button
                key={pill}
                onClick={() => {
                  triggerHaptic("selection");
                  onSearchPillClick(pill);
                }}
                className="px-3.5 py-1.5 bg-white hover:bg-amber-50 hover:text-[#BA5B55] hover:border-[#BA5B55]/40 border border-gray-200 rounded-full transition-all cursor-pointer text-gray-700 font-semibold shadow-2xs text-[11px] shrink-0 touch-press snap-start"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid with luxury styling */}
        <div className="mt-8 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 border-t border-amber-900/10 pt-6 sm:pt-10">
          <div className="text-center p-3 sm:p-5 bg-white/70 backdrop-blur-xs rounded-2xl border border-gray-100 shadow-2xs">
            <p className="text-xl sm:text-3xl font-black text-[#BA5B55] font-serif">500+</p>
            <p className="text-[10px] sm:text-xs text-gray-700 mt-0.5 font-semibold">Guild Artisans</p>
          </div>
          <div className="text-center p-3 sm:p-5 bg-white/70 backdrop-blur-xs rounded-2xl border border-gray-100 shadow-2xs">
            <p className="text-xl sm:text-3xl font-black text-[#1E180D] font-serif">100%</p>
            <p className="text-[10px] sm:text-xs text-gray-700 mt-0.5 font-semibold">Ethical Fair Pay</p>
          </div>
          <div className="text-center p-3 sm:p-5 bg-white/70 backdrop-blur-xs rounded-2xl border border-gray-100 shadow-2xs">
            <p className="text-xl sm:text-3xl font-black text-[#BA5B55] font-serif">50+</p>
            <p className="text-[10px] sm:text-xs text-gray-700 mt-0.5 font-semibold">Masterclasses</p>
          </div>
          <div className="text-center p-3 sm:p-5 bg-white/70 backdrop-blur-xs rounded-2xl border border-gray-100 shadow-2xs">
            <p className="text-xl sm:text-3xl font-black text-[#1E180D] font-serif">12,000+</p>
            <p className="text-[10px] sm:text-xs text-gray-700 mt-0.5 font-semibold">Living Patrons</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
