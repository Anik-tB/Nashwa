import React, { useState } from "react";
import Logo from "../Navbar/Logo";
import { Send, Check, Heart } from "@mynaui/icons-react";

const Footer = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3500);
    }
  };

  return (
    <footer className="bg-[#1E180D] text-white pt-16 pb-12 border-t border-amber-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-start">
              <div className="bg-white/10 px-3 py-1.5 rounded-2xl backdrop-blur-xs mb-4">
                <Logo onClick={() => onNavigate("home")} />
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mt-3">
              Nashwa connects discerning seekers with independent artisan guilds, botanical distillation houses, and masterclass mentors across Bangladesh dedicated to the slow arts and sustainable growth.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90 mb-2">
                Join the Nashwa Chronicle
              </p>
              {subscribed ? (
                <div className="p-3 bg-white/10 rounded-xl text-xs text-amber-200 flex items-center gap-2">
                  <Check size={16} className="text-green-400" />
                  <span>Thank you for joining our feasting & craft circle!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 border border-white/15 rounded-l-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-[#BA5B55]"
                  />
                  <button
                    type="submit"
                    className="bg-[#BA5B55] hover:bg-[#a34d47] px-4 py-2.5 rounded-r-xl text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Send size={14} /> Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Nav Pillars */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300/90 mb-4">
              Artisan Guilds
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => onNavigate("shops")} className="hover:text-white transition-colors cursor-pointer">
                  Sylhet Agarwood & Dehn Al-Oud
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("shops")} className="hover:text-white transition-colors cursor-pointer">
                  Dhamrai Brass & Bell-Metal Guild
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("shops")} className="hover:text-white transition-colors cursor-pointer">
                  Bijoypur Terracotta & Ceramics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("shops")} className="hover:text-white transition-colors cursor-pointer">
                  Sundarbans Wild Honey & Apiary
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("shops")} className="hover:text-white transition-colors cursor-pointer">
                  Sonargaon Jamdani & Silk Guild
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300/90 mb-4">
              Growth Academy
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => onNavigate("university")} className="hover:text-white transition-colors cursor-pointer">
                  Sylhet Agarwood Hydro-Distillation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("university")} className="hover:text-white transition-colors cursor-pointer">
                  Artisan Export & Global Branding
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("university")} className="hover:text-white transition-colors cursor-pointer">
                  Dhamrai Lost-Wax Bell Metallurgy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("university")} className="hover:text-white transition-colors cursor-pointer">
                  Bengali Culinary Heritage & Spices
                </button>
              </li>
            </ul>
          </div>

            <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300/90 mb-4">
              Feasts & Gathering
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => onNavigate("events")} className="hover:text-white transition-colors cursor-pointer">
                  Nabanna Harvest Feast & Acoustic Oud
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("events")} className="hover:text-white transition-colors cursor-pointer">
                  Dhamrai & Sonargaon Grand Souk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("events")} className="hover:text-white transition-colors cursor-pointer">
                  Sylhet Scent Blending Masterclass
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("events")} className="hover:text-white transition-colors cursor-pointer">
                  Clay Hearth & Sundarbans Honey Tasting
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Guild Trust Badges */}
        <div className="py-6 border-b border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs text-amber-200/80">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-[#D4A373]">✓</span> 100% Direct Fair-Trade for Bengal Artisans
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-[#D4A373]">✓</span> 64 Districts Courier (Dhaka 24h Express)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-[#D4A373]">✓</span> Organic Golden Jute & Muslin Packaging
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-[#D4A373]">✓</span> bKash, Nagad & Cash on Delivery Accepted
          </span>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Nashwa Collective. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Crafted with</span>
            <Heart size={14} className="text-[#BA5B55] fill-[#BA5B55]" />
            <span>for ethical craftsmanship & human growth.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
