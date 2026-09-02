import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle } from "@mynaui/icons-react";

const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const dropdownRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: "New Feast Announced!",
      desc: "Autumn Solstice Feast is now accepting reservations in Andalusian Courtyard.",
      time: "20m ago"
    },
    {
      id: 2,
      title: "Artisan Batch Restocked",
      desc: "Al-Bazaar Botanicals restocked Royal Moroccan Amber Oud Oil.",
      time: "2h ago"
    },
    {
      id: 3,
      title: "University Masterclass",
      desc: "Enrollment opened for 'Art of Natural Perfumery'.",
      time: "1d ago"
    }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative flex justify-center items-center p-2 text-[#1E180D] cursor-pointer hover:text-[#BA5B55] transition-colors"
      >
        <Bell size={24} />
        {hasUnread && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#BA5B55] rounded-full ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">Community Alerts</p>
            <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Nashwa News</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
            {notifications.map((item) => (
              <div key={item.id} className="p-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-[#BA5B55] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
