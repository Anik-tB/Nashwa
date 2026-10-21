import React, { useState } from "react";
import { Message, X, Sparkles, Send, Check, Heart, ShieldCheck, Telephone, ChatMessages } from "@mynaui/icons-react";
import { triggerHaptic } from "../../lib/haptics";

const ArtisanConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const quickTopics = [
    { label: "🌿 Sylhet Oud Purity & Scent Notes", text: "I would like to inquire about the distillation process and longevity of the Barlekha Dehn Al-Oud batch." },
    { label: "🔨 Bespoke Dhamrai Kasha Inscription", text: "Can I commission custom engraving on a hand-hammered Dhamrai bell-metal tea service?" },
    { label: "📦 Corporate / Wedding Jute Gift Hampers", text: "We are interested in curated artisan gift sets packaged in raw golden jute crates." },
    { label: "📱 bKash / Nagad Verification & Order SMS", text: "I have a question regarding my payment confirmation and delivery schedule." }
  ];

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic.label);
    setUserQuery(topic.text);
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    // Direct WhatsApp dispatch
    const encodedMsg = encodeURIComponent(
      `[Nashwa Bengal Artisan Inquiry]\n\n${userQuery.trim()}`
    );
    window.open(`https://wa.me/8801700000000?text=${encodedMsg}`, "_blank");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setUserQuery("");
      setSelectedTopic("");
      setIsOpen(false);
    }, 2500);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => {
            triggerHaptic("medium");
            setIsOpen(!isOpen);
          }}
          aria-label="Artisan Concierge"
          className="group relative flex items-center gap-2 bg-[#1E180D] hover:bg-[#BA5B55] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 touch-press border border-amber-500/30 cursor-pointer"
        >
          <div className="relative">
            <Message size={18} className="text-[#D4A373] group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
          </div>
          <span className="text-xs font-bold tracking-wide">
            Concierge
          </span>
          <span className="hidden sm:inline text-[10px] text-amber-200/80 font-normal">
            (কারিগর পরামর্শ)
          </span>
        </button>
      </div>

      {/* Concierge Desk Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-2 sm:right-6 z-50 w-[95vw] sm:w-[92vw] max-w-sm bg-[#FAF8F5] rounded-3xl shadow-2xl border border-amber-900/15 overflow-hidden animate-sheet-up sm:animate-in sm:slide-in-from-bottom-5 duration-200 flex flex-col max-h-[78vh]">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1E180D] via-[#2D2214] to-[#1E180D] text-white relative">
            <button
              onClick={() => {
                triggerHaptic("light");
                setIsOpen(false);
              }}
              className="absolute top-3.5 right-3.5 p-1.5 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer touch-press"
            >
              <X size={16} />
            </button>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[#D4A373] text-[10px] font-bold tracking-widest uppercase mb-1.5">
              <Sparkles size={11} />
              Bengal Heritage Desk
            </div>

            <h3 className="text-base font-bold font-serif text-amber-50">
              Direct Atelier Concierge
            </h3>
            <p className="text-[11px] text-amber-200/80 mt-0.5">
              Connect directly with our master curators in Dhaka & Sylhet.
            </p>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check size={24} />
                </div>
                <p className="font-bold text-gray-900">Connecting via WhatsApp...</p>
                <p className="text-gray-500 text-[11px]">
                  Our artisan curator will attend to your inquiry shortly.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Common Inquiries (দ্রুত বিষয় নির্বাচন)
                  </p>
                  <div className="space-y-1.5">
                    {quickTopics.map((t, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectTopic(t)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          selectedTopic === t.label
                            ? "bg-amber-100/70 border-[#BA5B55] text-gray-900 font-bold"
                            : "bg-white border-gray-200 text-gray-700 hover:border-amber-400 hover:bg-amber-50/40"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendWhatsApp} className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Your Bespoke Request / Note
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="e.g. 'I want to ask about ordering 10 bottles of Sylhet Dehn Al-Oud...'"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Telephone size={14} />
                    <span>Open WhatsApp with Curator</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-1">
                    <ShieldCheck size={12} className="text-[#BA5B55]" />
                    <span>Gulshan-1 Atelier • Direct Response • 10 AM - 10 PM</span>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ArtisanConcierge;
