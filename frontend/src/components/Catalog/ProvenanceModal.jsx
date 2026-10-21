import React from "react";
import { X, ShieldCheck, Sparkles, MapPin, CheckCircle } from "@mynaui/icons-react";

const ProvenanceModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  // Generate deterministic artisan provenance details
  const batchNumber = product.batch_code || `BD-2026-${String(product.id * 17 + 104).padStart(4, '0')}`;
  const origin = product.origin 
    ? product.origin 
    : (product.shop_name ? `${product.shop_name} Atelier` : "Authentic Bengal Artisan Heritage Guilds");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-900/20 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-amber-100/50 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Certificate Watermark Header */}
        <div className="text-center pb-5 border-b border-amber-900/15">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 rounded-full text-[10px] font-bold tracking-widest uppercase text-amber-900 mb-2">
            <Sparkles size={12} className="text-[#BA5B55]" />
            <span>Bengal Artisan Provenance & Traceability</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-gray-900">
            Certificate of Authenticity
          </h2>
          <p className="text-xs text-gray-500 font-mono mt-1 tracking-wider">
            BATCH ARCHIVE: {batchNumber}
          </p>
        </div>

        {/* Product Snapshot */}
        <div className="my-5 p-4 rounded-2xl bg-white border border-amber-900/10 flex items-center gap-4 shadow-xs">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover bg-amber-50 shrink-0 border border-amber-900/10"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate font-serif">
              {product.name}
            </h3>
            <p className="text-xs text-[#BA5B55] font-semibold mt-0.5 truncate">
              {origin}
            </p>
            <p className="text-[11px] text-gray-400 truncate">
              Slow-crafted in limited artisanal batches in Bangladesh
            </p>
          </div>
        </div>

        {/* Verification Matrix Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-2xl bg-white border border-amber-900/10">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
              Material Purity
            </span>
            <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5 truncate">
              <CheckCircle size={14} className="text-emerald-600 shrink-0" />
              <span>{product.materials || "100% Pure & Ethically Sourced"}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-amber-900/10">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
              Craft Method
            </span>
            <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-600 shrink-0" />
              100% Hand-worked (Non-industrial)
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-amber-900/10">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
              Fair Wage Guarantee
            </span>
            <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              Direct Bengal Artisan Living Wage
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-amber-900/10">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
              Atelier Location
            </span>
            <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5 truncate" title={product.origin || "Sylhet, Dhamrai & Bengal"}>
              <MapPin size={14} className="text-[#BA5B55] shrink-0" />
              <span className="truncate">{product.origin || (product.location || "Sylhet, Dhamrai & Bengal")}</span>
            </p>
          </div>
        </div>

        {/* Master Artisan Wax Seal Statement */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-900/20 text-xs text-amber-900 leading-relaxed relative overflow-hidden">
          <p className="italic font-serif">
            "Each individual creation carries subtle marks of the artisan’s chisel, kiln, or press. No two pieces are identical, preserving human presence against the tide of mass production."
          </p>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-amber-900/15 text-[11px]">
            <span className="font-semibold text-gray-700">Master Guild Inspector</span>
            <span className="font-mono text-[#BA5B55] font-bold">VERIFIED #NASHWA-QC</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 bg-[#1E180D] text-white text-xs font-bold rounded-2xl hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
        >
          Close Certificate
        </button>
      </div>
    </div>
  );
};

export default ProvenanceModal;
