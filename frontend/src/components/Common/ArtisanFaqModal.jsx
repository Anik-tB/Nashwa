import React, { useState } from "react";
import { X, ChevronDown, Sparkles, ShieldCheck, Truck, Lock, Leaf, Check } from "@mynaui/icons-react";

const ArtisanFaqModal = ({ isOpen, onClose }) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (!isOpen) return null;

  const faqs = [
    {
      question: "How do you package fragile terracotta and glass attar bottles for nationwide shipping?",
      category: "Fragile Packaging & Guarantee",
      answer: "Every fragile creation (Bijoypur terracotta, unglazed Matir Bhar, and Sylhet Dehn Al-Oud crystal flacons) is double-cushioned in organic raw golden jute fiber, wrapped in Bengal handloom muslin, and placed inside shock-resistant wooden crates sealed with traditional red lac wax. We provide an unconditional 100% Free Immediate Replacement Guarantee if any item incurs transit damage."
    },
    {
      question: "Is the Sylhet Dehn Al-Oud 100% pure wild agarwood with zero alcohol?",
      category: "Material Authenticity",
      answer: "Yes, without exception. Our Dehn Al-Oud is hydro-distilled in Barlekha, Moulvibazar from aged wild agarwood tree heartwood (Aquilaria agallocha). It contains 0% synthetic stabilizers, 0% mineral oils, and 0% alcohol (100% Halal attar). Each flacon is certified with a batch code archive verified by our master distillers."
    },
    {
      question: "How should I clean and season hand-hammered Dhamrai Bell-Metal (কাঁসা)?",
      category: "Artisan Care Rituals",
      answer: "Dhamrai lost-wax bell metal (78% Copper, 22% Tin) is an ancient alloy renowned for enhancing water and tea vitality. For daily cleaning, rinse with lukewarm water and mild botanical soap. To restore its radiant golden luster, rub gently with traditional tamarind pulp or sliced lemon with a pinch of sea salt, then polish dry with a soft muslin cloth."
    },
    {
      question: "How does payment work for bKash, Nagad, and Cash on Delivery across Bangladesh?",
      category: "Payments & Verification",
      answer: "We support automated bKash Merchant checkout, Nagad Direct, SSLCommerz 256-bit bank card gateway, and Cash on Delivery (COD) across all 64 districts. For COD, you inspect the parcel seal upon arrival by our courier rider (Steadfast or Pathao) and pay in cash. For bKash/Nagad, instant SMS and email receipts are dispatched immediately."
    },
    {
      question: "What are the delivery timelines for Dhaka and other 64 districts?",
      category: "Delivery Logistics",
      answer: "Orders placed inside Dhaka City are dispatched via 24-hour Express Courier. Deliveries to Chittagong, Sylhet, Rajshahi, and divisional hubs take 24–48 hours. Remote upazilas and coastal regions across all 64 districts arrive within 48–72 hours. You can track each transit milestone live using your BD-XXXXX tracking code."
    },
    {
      question: "How does the 100% Direct Fair Guild Compensation work?",
      category: "Patron Ethics",
      answer: "Middlemen syndicates and predatory exporters are completely bypassed. 85% of net proceeds go directly to the master craftsmen's family workshops in Dhamrai, Barlekha, Tangail, Bijoypur, and the Sundarbans, funding apprentice training and the preservation of generational tools."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/15 max-h-[90vh] overflow-y-auto animate-modal-enter flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close FAQ modal"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="pb-5 border-b border-amber-900/10 mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[#BA5B55] text-[10px] font-bold tracking-widest uppercase mb-2">
            <Sparkles size={12} className="text-[#D4A373]" />
            Patron Trust & Knowledgebase
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-serif">
            Artisan Care & Fragile Shipping FAQ
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Care rituals, packaging guarantees, and 64-district delivery protocols
          </p>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all duration-200 shadow-2xs hover:border-[#BA5B55]/30"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#BA5B55] block mb-0.5">
                      {faq.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-gray-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#BA5B55] text-white" : ""
                    }`}
                  >
                    <ChevronDown size={14} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-50 animate-in fade-in duration-150">
                    <p className="mt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 pt-4 border-t border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>100% Transit Breakage Protection Guarantee</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-[#1E180D] hover:bg-[#BA5B55] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtisanFaqModal;
