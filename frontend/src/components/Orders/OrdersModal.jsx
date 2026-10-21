import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Calendar, MapPin, Truck, ShieldCheck, Printer } from "@mynaui/icons-react";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import OrderTrackingModal from "./OrderTrackingModal";
import OrderInvoiceModal from "./OrderInvoiceModal";

const OrdersModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const emailParam = user ? `?email=${encodeURIComponent(user.email)}` : "";
    fetch(`/api/orders${emailParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setOrders(data.orders || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/15 max-h-[88vh] flex flex-col animate-modal-enter">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-5">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
            Artisan Ledger
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 flex items-center gap-2 font-serif">
            <ShoppingBag size={24} className="text-[#BA5B55]" />
            Acquisitions & Dispatches
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Track status, guild provenance, and courier milestones
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {loading ? (
            <div className="space-y-3 py-6">
              {[1, 2].map((n) => (
                <div key={n} className="h-28 bg-white rounded-2xl animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-base font-bold text-gray-800 font-serif">No acquisitions recorded yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Your future artisan pieces, botanical distillations, and certificates will be listed here.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:border-[#BA5B55]/30 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-xs sm:text-sm text-gray-950">
                      Acquisition #NSW-{ord.id}
                    </span>
                    <span className="ml-2 text-[11px] text-gray-500">
                      {ord.customer_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {ord.status || 'Confirmed'}
                    </span>
                    <span className="text-sm font-black text-[#BA5B55] font-serif">
                      {formatPrice(ord.total_amount)}
                    </span>
                  </div>
                </div>

                {/* Items list */}
                <div className="space-y-1.5 text-xs text-gray-600">
                  {ord.items && ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="truncate max-w-[280px]">
                        <strong className="text-gray-900">{it.quantity}x</strong> {it.name}
                      </span>
                      <span className="font-semibold text-gray-900">{formatPrice(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer and Track Button */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#BA5B55]" /> {ord.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {ord.created_at ? ord.created_at.slice(0, 10) : "Recent"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInvoiceOrder(ord)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-amber-100 text-gray-800 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-200"
                    >
                      <Printer size={13} className="text-[#BA5B55]" />
                      <span>Invoice (রশিদ)</span>
                    </button>

                    <button
                      onClick={() => setTrackingOrderId(ord.id)}
                      className="px-3.5 py-1.5 bg-[#1E180D] hover:bg-[#BA5B55] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Truck size={13} />
                      <span>Track Journey</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tracking Modal */}
      <OrderTrackingModal
        orderId={trackingOrderId}
        isOpen={Boolean(trackingOrderId)}
        onClose={() => setTrackingOrderId(null)}
      />

      {/* Tax Invoice Modal */}
      <OrderInvoiceModal
        order={invoiceOrder}
        isOpen={Boolean(invoiceOrder)}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
};

export default OrdersModal;
