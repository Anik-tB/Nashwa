import React from "react";

const Logo = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer select-none group py-1"
    >
      {/* Artisan Emblem Seal */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E180D] via-[#2D2214] to-[#1E180D] p-1.5 shadow-md flex items-center justify-center border border-amber-900/20 group-hover:border-[#BA5B55]/50 transition-all duration-300">
        <svg viewBox="0 0 100 100" className="w-full h-full transform group-hover:rotate-45 transition-transform duration-500">
          <defs>
            <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6B87D" />
              <stop offset="60%" stopColor="#BA5B55" />
              <stop offset="100%" stopColor="#803530" />
            </linearGradient>
          </defs>
          <path
            d="M 50,10 L 62,35 L 90,38 L 68,58 L 75,85 L 50,70 L 25,85 L 32,58 L 10,38 L 38,35 Z"
            fill="url(#logoGold)"
          />
          <circle cx="50" cy="50" r="10" fill="#FAF8F5" />
          <circle cx="50" cy="50" r="4" fill="#BA5B55" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-black tracking-[0.18em] text-[#1E180D] leading-none group-hover:text-[#BA5B55] transition-colors font-serif">
          NASHWA
        </span>
        <span className="text-[9px] text-[#BA5B55] tracking-[0.3em] uppercase leading-none font-bold mt-1">
          Artisan Guilds
        </span>
      </div>
    </div>
  );
};

export default Logo;

