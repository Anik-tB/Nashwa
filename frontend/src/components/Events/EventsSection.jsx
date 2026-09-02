import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Ticket, Check, X, Coffee } from "@mynaui/icons-react";
import { useAuth } from "../../context/AuthContext";

const EventsSection = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rsvpEvent, setRsvpEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState("");
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
    setConfirmation("");
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
          name,
          email,
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

      setConfirmation(data.message);
      setTimeout(() => {
        setRsvpEvent(null);
      }, 2500);
    } catch (err) {
      setError(err.message || "Failed to submit RSVP.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#BA5B55] bg-[#BA5B55]/10 px-3 py-1 rounded-full">
          Communal Gatherings & Feasts
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E180D] mt-3 tracking-tight font-serif">
          Feasts & Living Traditions
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
          From communal solstice dinners under candlelit pavilions to fragrant botanical distillations and open souks, experience the warmth of Nashwa culture.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-80"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {events.map((event) => {
            const seatsLeft = Math.max(0, event.capacity - event.enrolled_count);
            const isFull = seatsLeft === 0;

            return (
              <div
                key={event.id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#BA5B55]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-[#BA5B55] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {event.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <span className="text-sm font-semibold flex items-center gap-1.5">
                        <Calendar size={16} /> {event.date}
                      </span>
                      <span className="text-sm font-extrabold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-xl">
                        {event.price === 0 ? "Free Entry" : `$${event.price.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5 font-medium">
                      <MapPin size={14} className="text-[#BA5B55]" />
                      <span>{event.location}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#BA5B55] transition-colors leading-tight">
                      {event.title}
                    </h3>

                    <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Capacity Indicator */}
                    <div className="mt-4 pt-3 border-t border-gray-50">
                      <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Users size={14} /> Capacity: {event.capacity} seats
                        </span>
                        <span className={isFull ? "text-red-500 font-bold" : "text-amber-700 font-semibold"}>
                          {isFull ? "Fully Booked" : `${seatsLeft} seats remaining`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#BA5B55] h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (event.enrolled_count / event.capacity) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    disabled={isFull}
                    onClick={() => openRsvpModal(event)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                      isFull
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#1E180D] hover:bg-[#BA5B55] text-white"
                    }`}
                  >
                    <Ticket size={16} />
                    {isFull ? "Event at Full Capacity" : "Reserve Your Seat"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RSVP Modal */}
      {rsvpEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setRsvpEvent(null)}
              aria-label="Close"
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BA5B55] bg-[#BA5B55]/10 px-2.5 py-0.5 rounded-full">
                Feast & Event Reservation
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 leading-tight">
                {rsvpEvent.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {rsvpEvent.date} • {rsvpEvent.location}
              </p>
            </div>

            {confirmation ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-sm font-medium flex items-center gap-2">
                <Check size={20} className="shrink-0 text-green-600" />
                <span>{confirmation}</span>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4 mt-4">
                {error && (
                  <div className="p-3 rounded-xl text-xs font-medium bg-red-50 text-red-800 border border-red-200">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] text-sm text-gray-900"
                    placeholder="e.g. Tariq Al-Mansoor"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] text-sm text-gray-900"
                    placeholder="tariq@example.com"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#BA5B55]/20 focus:border-[#BA5B55] text-sm text-gray-900 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-800">
                  <p className="font-semibold">Admission Note:</p>
                  <p className="mt-0.5">
                    {rsvpEvent.price === 0
                      ? "Free community entry with RSVP."
                      : `Total for ${guests} ${guests === 1 ? "ticket" : "tickets"}: $${(rsvpEvent.price * guests).toFixed(2)}`}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 bg-[#BA5B55] hover:bg-[#a34d47] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                    submitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <Ticket size={16} />
                  {submitting ? "Reserving..." : "Confirm Reservation"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsSection;
