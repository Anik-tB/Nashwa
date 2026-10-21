import React, { useState, useEffect } from 'react';
import { Sparkles, Globe, ChevronDown, Check } from '@mynaui/icons-react';
import { useCurrency } from '../../context/CurrencyContext';
import SoundscapeToggle from '../Common/SoundscapeToggle';

const AnnouncementBar = ({ onOpenManifesto }) => {
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const announcements = [
    { text: "✨ 64 Districts Home Delivery • Dhaka 24h Express • bKash, Nagad & Cash on Delivery", linkText: "Learn more", action: onOpenManifesto },
    { text: "🌿 New Batch: Pure Sylhet Dehn Al-Oud & Sundarbans Raw Khalisha Honey now released", linkText: "View offerings", action: null },
    { text: "🏷️ Code NASHWA10 unlocks 10% off your initial artisan acquisition (৳ Taka)", linkText: "Copy code", copy: "NASHWA10" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-[#1E180D] text-amber-50/90 text-[11px] border-b border-amber-950/40 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Brand motto / Story link */}
        <div className="hidden md:flex items-center gap-3 text-amber-200/80">
          <span className="inline-flex items-center gap-1 font-medium tracking-wide">
            <Sparkles size={13} className="text-[#D4A373]" />
            Direct Fair-Trade Guilds
          </span>
          <span className="text-amber-700/60">•</span>
          <button
            onClick={onOpenManifesto}
            className="hover:text-amber-100 underline decoration-amber-500/40 underline-offset-2 transition-colors cursor-pointer"
          >
            The Slow Craft Manifesto
          </button>
        </div>

        {/* Center: Rotating announcements */}
        <div className="flex items-center justify-center text-center">
          <div className="flex items-center gap-2">
            <span className="font-medium tracking-wide text-amber-100">
              {announcements[currentSlide].text}
            </span>
            {announcements[currentSlide].copy ? (
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(announcements[currentSlide].copy);
                  alert('Code NASHWA10 copied to clipboard!');
                }}
                className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider transition-colors cursor-pointer"
              >
                Copy
              </button>
            ) : announcements[currentSlide].linkText ? (
              <button
                onClick={announcements[currentSlide].action}
                className="text-[#D4A373] hover:text-amber-200 underline underline-offset-2 font-semibold text-[10px] cursor-pointer"
              >
                {announcements[currentSlide].linkText}
              </button>
            ) : null}
          </div>
        </div>

        {/* Right: Soundscape & Currency selector */}
        <div className="flex items-center gap-3">
          <SoundscapeToggle />

          {/* Currency dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/15 text-amber-100 font-semibold text-[11px] transition-colors cursor-pointer"
            >
              <Globe size={12} className="text-[#D4A373]" />
              <span>{currency}</span>
              <ChevronDown size={11} className={`transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {currencyDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCurrencyDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 text-gray-800 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
                    Currency
                  </div>
                  {availableCurrencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-amber-50 cursor-pointer ${
                        currency === c.code ? 'text-[#BA5B55] bg-amber-50/60 font-bold' : 'text-gray-700'
                      }`}
                    >
                      <span>{c.label}</span>
                      {currency === c.code && <Check size={12} className="text-[#BA5B55]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
