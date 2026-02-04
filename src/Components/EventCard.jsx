import React, { useState } from "react";

const EventCard = ({ event, onSelect, onTickets }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={() => onSelect(event)}
      className="group relative flex flex-col bg-[#080808] text-white p-4 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative w-full aspect-[4/5] rounded-4xl overflow-hidden bg-[#111] mb-6 ">

        {/* Skeleton Loader */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#1a1a1a] via-[#222] to-[#1a1a1a]" />
        )}

        {/* Image */}
        <img
          src={event.img}
          alt={event.title}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700
          ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-110"}
          group-hover:scale-110`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition duration-500" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-black text-[9px] px-3 py-1.5 rounded-full border border-white/10 tracking-widest uppercase">
          {event.status}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-2 space-y-3">
        <h3 className="text-2xl font-black leading-tight group-hover:text-yellow-400 transition-colors">
          {event.title}
        </h3>

        <div className="space-y-1">
          <p className="text-sm font-bold text-yellow-400/90 tracking-tighter">
            {event.date} • {event.venue}
          </p>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            {event.state}, NG
          </p>
        </div>

        {/* FOOTER */}
        <div className="pt-6 flex justify-between items-center border-t border-white/5 mt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/30 font-black uppercase">
              Admission
            </span>
            <span className="font-black text-xl tracking-tighter">
              {event.price}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onTickets(event);
            }}
            className="bg-white text-black font-black px-6 py-3 rounded-full hover:bg-yellow-400 transition-all transform active:scale-95 uppercase tracking-tighter text-[12px]"
          >
            Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
