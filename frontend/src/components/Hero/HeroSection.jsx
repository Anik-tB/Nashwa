import React from "react";
import { Sparkles, ArrowRight, BookOpen, Compass, Coffee, ShieldCheck, Heart } from "@mynaui/icons-react";

const HeroSection = ({ onNavigate, onSearchPillClick, onOpenManifesto }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#F5EFE6]/70 via-[#FAF8F5] to-[#FAF8F5] py-14 sm:py-20 md:py-24 border-b border-amber-900/10">
      {/* Decorative ambient gold blurs */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#BA5B55]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute -bottom-10 left-10 w-96 h-96 bg-[#D4A373]/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-amber-900/15 text-[#BA5B55] text-xs font-bold shadow-xs mb-6 backdrop-blur-md">
            <Sparkles size={15} className="text-[#D4A373]" />
            <span className="tracking-wide">Artisan Guild Marketplace & Living Academy</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E180D] tracking-tight leading-[1.1] font-serif">
            The Path to <span className="text-[#BA5B55] italic font-serif">Growth</span>, Crafted by Living Hands.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Discover singular small-batch artisan creations: aged Sylhet Dehn Al-Oud, hand-hammered Dhamrai bell-metal (কাঁসা), wild Sundarbans raw honey, and Sonargaon heritage weaves.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate("shops")}
              className="px-6 py-3.5 rounded-2xl bg-[#BA5B55] hover:bg-[#a34d47] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <Compass size={18} />
              Explore Bengal Guilds
            </button>

            <button
              onClick={() => onNavigate("university")}
              className="px-6 py-3.5 rounded-2xl bg-white text-gray-900 font-bold text-xs uppercase tracking-wider border border-gray-200 hover:border-[#BA5B55] hover:text-[#BA5B55] transition-all shadow-2xs hover:shadow-xs active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <BookOpen size={18} />
              Nashwa Academy
            </button>

            <button
              onClick={onOpenManifesto}
              className="px-5 py-3.5 rounded-2xl bg-amber-500/10 text-amber-950 font-bold text-xs uppercase tracking-wider border border-amber-500/20 hover:bg-amber-500/20 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <ShieldCheck size={18} className="text-[#BA5B55]" />
              Our Manifesto
            </button>
          </div>

          {/* Search Suggestion Pills */}
          <div className="mt-8 flex items-center justify-center flex-wrap gap-2 text-xs text-gray-500">
            <span className="font-bold text-gray-800">Popular:</span>
            {["Sylhet Dehn Al-Oud", "Dhamrai Kasha Teapot", "Sundarbans Raw Honey", "Bijoypur Terracotta", "Tangail Indigo Khadi", "Matir Bhar"].map((pill) => (
              <button
                key={pill}
                onClick={() => onSearchPillClick(pill)}
                className="px-3.5 py-1 bg-white hover:bg-amber-50 hover:text-[#BA5B55] hover:border-[#BA5B55]/40 border border-gray-200 rounded-full transition-all cursor-pointer text-gray-700 font-semibold shadow-2xs text-[11px]"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid with luxury styling */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-amber-900/10 pt-10">
          <div className="text-center p-5 bg-white/70 backdrop-blur-xs rounded-2xl border border-gray-100 shadow-2xs hover:border-[#BA5B55]/30 transition-all">
            <p className="text-2xl sm:text-3xl font-black text-[#BA5B55] font-serif">500+</p>
            <p className="text-xs text-gray-700 mt-1 font-semibold">Independent Guild Artisans</p>
          </div>
          <div className="text-center p-5 bg-white/70 backdrop-blur-xs rounded-2xl border border-gray-100 shadow-2xs hover:border-[#BA5B55]/30 transition-all">
            <p className="text-2xl sm:text-3xl font-black text-[#1E180D] font-serif">100%</p>
            <p className="text-xs text-gray-700 mt-1 font-semibold">Ethical Fair Compensation</p>
          </div>
          <div className="text-center p-5 bg-white/70 backdrop-blur-xs rounded-2xl border border-gray-100 shadow-2xs hover:border-[#BA5B55]/30 transition-all">
            <p className="text-2xl sm:text-3xl font-black text-[#BA5B55] font-serif">50+</p>
            <p className="text-xs text-gray-700 mt-1 font-semibold">Slow Living Masterclasses</p>
          </div>
          <div className="text-center p-5 bg-white/70 backdrop-blur-xs rounded-2xl border border-gray-100 shadow-2xs hover:border-[#BA5B55]/30 transition-all">
            <p className="text-2xl sm:text-3xl font-black text-[#1E180D] font-serif">12,000+</p>
            <p className="text-xs text-gray-700 mt-1 font-semibold">Discerning Patrons</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
