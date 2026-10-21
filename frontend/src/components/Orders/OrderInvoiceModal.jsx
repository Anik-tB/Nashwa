import React from "react";
import { X, Printer, ShieldCheck, CheckCircle, Download, Sparkles } from "@mynaui/icons-react";
import { useCurrency } from "../../context/CurrencyContext";

const OrderInvoiceModal = ({ order, isOpen, onClose }) => {
  const { formatPrice } = useCurrency();

  if (!isOpen || !order) return null;

  const invoiceNumber = `NSW-INV-2026-${String(order.id).padStart(5, "0")}`;
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const handlePrint = () => {
    window.print();
  };

  const items = Array.isArray(order.items)
    ? order.items
    : typeof order.items_json === "string"
    ? JSON.parse(order.items_json || "[]")
    : order.items_json || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-amber-900/15 max-h-[92vh] overflow-y-auto animate-modal-enter print:p-0 print:border-none print:shadow-none print:rounded-none">
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 print:hidden mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
              NBR Compliant Receipt
            </span>
            <span className="text-xs font-mono font-bold text-gray-500">
              {invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#1E180D] hover:bg-[#BA5B55] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close invoice"
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="space-y-6 text-gray-800">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-amber-950/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-serif tracking-tight text-[#1E180D]">
                  NASHWA
                </span>
                <span className="text-xs font-serif italic text-[#BA5B55]">
                  (নাসওয়া ক্রাফট হাউস)
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Luxury Artisan Living & Heritage Guild of Bengal
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Registered Atelier: House 18, Road 11, Gulshan-1, Dhaka-1212, Bangladesh
              </p>
              <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                NBR BIN (VAT Registration): <strong>004821948-0101</strong> (Handicraft Exemption S.R.O)
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-lg font-black font-serif text-gray-900 block">
                CHALLAN & TAX INVOICE
              </span>
              <span className="text-[11px] font-bold text-gray-500 block">
                চালান ও কর চালানপত্র
              </span>
              <p className="text-xs font-mono font-bold text-[#BA5B55] mt-1">
                {invoiceNumber}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Issue Date: {orderDate}
              </p>
            </div>
          </div>

          {/* Customer & Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-900/10 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Bill & Ship To (গ্রাহকের বিবরণ)
              </span>
              <p className="font-bold text-gray-900 text-sm">
                {order.customer_name}
              </p>
              <p className="text-gray-600 mt-0.5">{order.address}</p>
              <p className="text-gray-600 font-semibold">{order.city}, Bangladesh</p>
              {order.customer_phone && (
                <p className="text-gray-800 font-mono mt-1 font-bold">
                  📱 {order.customer_phone}
                </p>
              )}
              <p className="text-gray-500 text-[11px]">{order.customer_email}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Acquisition Specifics (অর্ডার বিবরণ)
              </span>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Channel:</span>
                  <span className="font-bold uppercase text-emerald-800">
                    {order.payment_method === "bkash" && "bKash Verified (বিকাশ)"}
                    {order.payment_method === "nagad" && "Nagad Direct (নগদ)"}
                    {order.payment_method === "card" && "SSLCommerz / Card"}
                    {order.payment_method === "cod" && "Cash on Delivery (ক্যাশ অন ডেলিভারি)"}
                    {!order.payment_method && "Secured Electronic"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dispatch Logistics:</span>
                  <span className="font-semibold text-gray-800">
                    {order.courier_name || "Steadfast / Pathao Express (64 Districts)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Packaging Type:</span>
                  <span className="font-semibold text-gray-800">
                    {order.packaging_type === "gift_box"
                      ? "Heirloom Sundarban Wood Crate"
                      : "Organic Golden Jute & Red Wax Seal"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-2.5">Item & Craft Lineage</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((it, idx) => (
                  <tr key={idx} className="text-gray-800">
                    <td className="py-3 pr-2">
                      <p className="font-bold text-gray-950 font-serif">{it.name}</p>
                      <p className="text-[10px] text-gray-400">
                        Certified Bengal Heritage • Batch Sealed
                      </p>
                    </td>
                    <td className="py-3 text-center font-bold">{it.quantity}</td>
                    <td className="py-3 text-right font-mono text-gray-600">
                      {formatPrice(it.price)}
                    </td>
                    <td className="py-3 text-right font-bold text-gray-950 font-mono">
                      {formatPrice(it.price * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation */}
          <div className="border-t-2 border-gray-200 pt-4 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (মূল্য):</span>
                <span className="font-mono font-semibold">{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT / সম্পূরক শুল্ক (0% S.R.O):</span>
                <span className="text-emerald-700 font-bold">৳0 (Handicraft Exempt)</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Nationwide Courier (ডেলিভারি):</span>
                <span className="font-semibold text-emerald-700">Included / Complimentary</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-950 pt-2 border-t-2 border-amber-900/20 font-serif">
                <span>Total Paid (পরিশোধিত):</span>
                <span className="text-[#BA5B55]">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Authenticity Watermark Footer */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>100% Genuine Artisan Provenance Guaranteed</span>
            </div>
            <p className="italic text-center sm:text-right font-serif">
              "Thank you for preserving the slow arts and livelihood of living artisans across Bengal."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoiceModal;
