import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Ticket, Check, X, Coffee, Sparkles, ShieldCheck } from "@mynaui/icons-react";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";

const EventsSection = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // RSVP state
  const [rsvpEvent, setRsvpEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [ticketPass, setTicketPass] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []))
      .catch((err) => console.error("Error fetching events:", err))
      .finally(() => setLoading(false));
  }, []);

  const openRsvpModal = (event) => {
    setRsvpEvent(event);
    setName(user ? user.name : "");
    setEmail(user ? user.email : "");
    setGuests(1);
    setTicketPass(null);
    setError("");
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: rsvpEvent.id,
          name: name.trim(),
          email: email.trim(),
          guests
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "RSVP failed");

      // Update local event enrolled_count
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === rsvpEvent.id
            ? { ...ev, enrolled_count: ev.enrolled_count + guests }
            : ev
        )
      );

      // Generate Ticket Pass
      const ticketCode = `NSH-GUEST-${Math.floor(10000 + Math.random() * 90000)}`;
      setTicketPass({
        ticketCode,
        guestName: name.trim(),
        guestEmail: email.trim(),
        partySize: guests,
        eventTitle: rsvpEvent.title,
        date: rsvpEvent.date,
        location: rsvpEvent.location,
        priceTotal: rsvpEvent.price === 0 ? "Complimentary Souk Access" : formatPrice(rsvpEvent.price * guests)
      });
    } catch (err) {
      setError(err.message || "Failed to submit RSVP.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === "all") return true;
    return e.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#BA5B55] bg-[#BA5B55]/10 px-3 py-1 rounded-full">
          Communal Gatherings & Feasts
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1E180D] mt-3 tracking-tight font-serif">
          Feasts & Living Traditions
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
          From communal solstice dinners under candlelit pavilions to fragrant botanical distillations and open souks, experience the warmth of Nashwa culture.
        </p>

        {/* Filter chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: "All Gatherings" },
            { id: "feast", label: "Feasts & Banquets" },
            { id: "workshop", label: "Hands-on Workshops" },
            { id: "souk", label: "Night Souks" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#1E180D] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-80"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredEvents.map((event) => {
            const seatsLeft = Math.max(0, event.capacity - event.enrolled_count);
            const isFull = seatsLeft === 0;
            const percentFilled = Math.min(100, Math.round((event.enrolled_count / event.capacity) * 100));

            return (
              <div
                key={event.id}
                className="group bg-white rounded-3xl overflow-hidden border border-amber-900/10 hover:border-[#BA5B55]/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Event Banner */}
                  <div className="h-52 w-full relative overflow-hidden bg-gray-100">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    <span className="absolute top-4 left-4 bg-[#1E180D]/85 backdrop-blur-md text-amber-100 text-[10px] font-bold px-3 py-1 rounded-full">
                      {event.category}
                    </span>

                    <span className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-black px-3 py-1 rounded-xl shadow-sm">
                      {event.price === 0 ? "Complimentary Entry" : `${formatPrice(event.price)} / guest`}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold mb-1.5">
                      <Calendar size={14} className="text-[#BA5B55]" />
                      <span>{event.date}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#BA5B55] transition-colors leading-snug font-serif">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                      <MapPin size={13} className="text-[#BA5B55]" />
                      <span>{event.location}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Capacity Progress Bar */}
                    <div className="mt-5 p-3 bg-amber-50/60 rounded-xl border border-amber-900/10">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-[#BA5B55]" />
                          Capacity Status
                        </span>
                        <span className={seatsLeft <= 5 ? "text-amber-800 font-black" : "text-gray-500"}>
                          {isFull ? "Event Fully Booked" : `Only ${seatsLeft} seats remaining`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#D4A373] to-[#BA5B55] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentFilled}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RSVP Button */}
                <div className="p-6 pt-0">
                  <button
                    disabled={isFull}
                    onClick={() => openRsvpModal(event)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                      isFull
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#1E180D] hover:bg-[#BA5B55] text-white shadow-md active:scale-98"
                    }`}
                  >
                    <Ticket size={16} />
                    <span>{isFull ? "Waitlist Closed" : "Reserve Guest Invitation"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RSVP Modal */}
      {rsvpEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/15 animate-modal-enter">
            <button
              onClick={() => setRsvpEvent(null)}
              aria-label="Close"
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {ticketPass ? (
              /* Ticket Pass */
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                  <Ticket size={28} />
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Reservation Confirmed
                  </span>
                  <h3 className="text-xl font-bold font-serif text-gray-950 mt-2">
                    Official Gathering Pass
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Your invitation has been dispatched to {ticketPass.guestEmail}.
                  </p>
                </div>

                {/* The Ticket Badge */}
                <div className="p-5 bg-gradient-to-br from-[#1E180D] via-[#2A1F12] to-[#1E180D] text-white rounded-2xl text-left shadow-xl border border-amber-500/30 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-[#D4A373] font-bold">
                        Nashwa Gathering Pass
                      </p>
                      <h4 className="text-sm font-bold text-amber-50 font-serif leading-snug mt-0.5">
                        {ticketPass.eventTitle}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300/80 bg-white/10 px-2 py-0.5 rounded">
                      {ticketPass.ticketCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-white/10 text-amber-100/90">
                    <div>
                      <p className="text-[10px] text-amber-400/70 font-semibold uppercase">Guest of Honor</p>
                      <p className="font-bold">{ticketPass.guestName} ({ticketPass.partySize} {ticketPass.partySize === 1 ? 'seat' : 'seats'})</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-amber-400/70 font-semibold uppercase">Date & Time</p>
                      <p className="font-bold truncate">{ticketPass.date}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 text-[10px] text-amber-200/60 flex items-center justify-between">
                    <span className="truncate max-w-[200px]">{ticketPass.location}</span>
                    <span className="font-bold text-[#D4A373]">{ticketPass.priceTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => setRsvpEvent(null)}
                  className="w-full py-2.5 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close & Return to Calendar
                </button>
              </div>
            ) : (
              /* RSVP Form */
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
                  Gathering Reservation
                </span>
                <h3 className="text-xl font-bold text-gray-950 font-serif mt-2 leading-snug">
                  {rsvpEvent.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {rsvpEvent.date} • {rsvpEvent.location}
                </p>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl mt-3">{error}</p>
                )}

                <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-3 mt-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. tariq@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Number of Guests in Party
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#BA5B55]"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                    Complimentary spiced mint tea and heritage flatbreads served at all Nashwa gatherings.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <Ticket size={16} />
                    <span>{submitting ? "Securing Table..." : "Confirm Gathering RSVP"}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsSection;
