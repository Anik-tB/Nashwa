import React, { useState, useEffect } from "react";
import { X, Truck, Check, ClockCircle, MapPin, ShieldCheck, Sparkles, Box } from "@mynaui/icons-react";

const OrderTrackingModal = ({ orderId, isOpen, onClose }) => {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && orderId) {
      setLoading(true);
      setError("");
      fetch(`/api/orders/${orderId}/track`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setTracking(data);
        })
        .catch((err) => {
          console.error("Tracking error:", err);
          setError("Failed to load tracking details.");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/15 max-h-[90vh] overflow-y-auto animate-modal-enter">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <span className="text-[10px] font-black uppercase tracking-widest text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
          Live Guild Logistics
        </span>

        <h3 className="text-2xl font-black text-gray-950 mt-1 font-serif">
          Artisan Journey Tracking
        </h3>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-10 h-10 border-3 border-[#BA5B55] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-gray-500 font-semibold">Contacting dispatch courier...</p>
          </div>
        ) : error || !tracking ? (
          <div className="py-8 text-center text-red-600 text-xs font-semibold">
            {error || "Tracking information unavailable."}
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            {/* Tracking Overview Card */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
              <div className="flex justify-between items-start text-xs">
                <div>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Tracking Code</p>
                  <p className="font-mono font-bold text-gray-900 text-sm mt-0.5">{tracking.tracking_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Est. Delivery</p>
                  <p className="font-bold text-[#BA5B55] text-sm mt-0.5">{tracking.estimated_delivery}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-[#BA5B55]" />
                  {tracking.carrier}
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                  Carbon Neutral
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-4">
                Milestone Progress
              </h4>

              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {tracking.milestones.map((m) => {
                  const isDone = m.status === "completed";
                  const isCurrent = m.status === "current";

                  return (
                    <div key={m.step} className="flex items-start gap-4 relative">
                      <div
                        className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs shrink-0 z-10 transition-colors shadow-2xs ${
                          isDone
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                            ? "bg-[#BA5B55] text-white ring-4 ring-[#BA5B55]/20 animate-pulse"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isDone ? <Check size={13} /> : <span className="font-bold text-[10px]">{m.step}</span>}
                      </div>

                      <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                        <div className="flex justify-between items-center mb-0.5">
                          <p className={`text-xs font-bold ${isCurrent ? "text-[#BA5B55]" : "text-gray-900"}`}>
                            {m.name}
                          </p>
                          <span className="text-[10px] text-gray-400 font-medium">{m.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={11} className="text-gray-400 shrink-0" />
                          <span>{m.location}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-900 hover:bg-[#BA5B55] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Close Tracker
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingModal;
