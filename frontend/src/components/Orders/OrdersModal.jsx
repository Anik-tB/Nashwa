import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Calendar, MapPin } from "@mynaui/icons-react";
import { useAuth } from "../../context/AuthContext";

const OrdersModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
            Artisan Orders
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2 flex items-center gap-2">
            <ShoppingBag size={24} className="text-[#BA5B55]" />
            Order History
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Track deliveries from independent craft masters and guilds
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {loading ? (
            <div className="space-y-3 py-6">
              {[1, 2].map((n) => (
                <div key={n} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-semibold text-gray-700">No orders placed yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Your future artisan treasures will appear right here.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/60 pb-3 mb-3">
                  <div>
                    <span className="font-mono font-bold text-sm text-gray-900">
                      Order #NSW-{ord.id}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {ord.customer_name} ({ord.customer_email})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-800">
                      {ord.status}
                    </span>
                    <span className="text-sm font-extrabold text-[#BA5B55]">
                      ${Number(ord.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600">
                  {ord.items && ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-semibold text-gray-900">${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {ord.address}, {ord.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {ord.created_at ? ord.created_at.slice(0, 10) : "Recent"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;
