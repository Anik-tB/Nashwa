import React from 'react';
import { X, Sparkles, CheckCircle, Leaf, ShieldCheck, Heart } from '@mynaui/icons-react';

const ManifestoModal = ({ isOpen, onClose, onExplore }) => {
  if (!isOpen) return null;

  const pillars = [
    {
      icon: Sparkles,
      title: "Generational Provenance",
      description: "We partner exclusively with verified master ateliers across Bangladesh—from the ancient agarwood hills of Barlekha to the lost-wax bronze furnaces of Dhamrai and the weaver settlements of Tangail."
    },
    {
      icon: ShieldCheck,
      title: "100% Direct Fair Guild Compensation",
      description: "Middlemen and exploitative middlemen syndicates are eliminated. Every purchase sends 85% of revenue straight to the master craftsman's workshop."
    },
    {
      icon: Leaf,
      title: "Pure & Single-Batch Formulations",
      description: "Our Sylhet wild oud attar, Sundarbans raw honey, and wooden Ghani cold-pressed mustard oils are completely unadulterated, unpasteurized, and free of artificial additives."
    },
    {
      icon: Heart,
      title: "Golden Jute & Wax Compostable Packaging",
      description: "Every shipment is hand-wrapped in organic raw golden jute cloth and Bengal muslin, sealed with traditional red lac wax, and delivered nationwide."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 animate-modal-enter max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#1E180D] via-[#2A2114] to-[#1E180D] text-white relative">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-[#D4A373] text-[10px] font-bold tracking-widest uppercase mb-3">
            <Sparkles size={12} />
            The Bengal Slow Craft Creed
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-amber-50">
            The Nashwa Manifesto
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-2 max-w-lg leading-relaxed">
            "We reject the hurried, disposable cadence of mass production. Nashwa exists to cultivate deep communion between thoughtful patrons and soulful makers across Bengal."
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-[#BA5B55]/30 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#BA5B55] flex items-center justify-center mb-3">
                    <Icon size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug">{pillar.title}</h4>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Artisan Quote */}
          <div className="p-5 bg-amber-50/70 border border-amber-900/10 rounded-2xl text-center">
            <p className="text-sm italic font-serif text-amber-950 leading-relaxed">
              "When you pour from a bell-metal pot cast by hand, you drink not just tea, but the quiet patience of human devotion that has endured through centuries of Bengal history."
            </p>
            <p className="text-[11px] font-bold tracking-wider text-[#BA5B55] uppercase mt-2">
              — Master Sukanta Banik, Dhamrai Bell-Metal Heritage Guild (ধামরাই কাঁসা শিল্প)
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Backed by our 100% Guild Authenticity Guarantee
          </p>
          <button
            onClick={() => {
              onClose();
              if (onExplore) onExplore();
            }}
            className="px-5 py-2.5 bg-[#BA5B55] hover:bg-[#a34d47] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Explore the Works
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManifestoModal;
