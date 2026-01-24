import React from "react";

const EventCard = ({ event, onSelect, onTickets }) => {
  return (
    <div
      onClick={() => onSelect(event)}
      className="group relative flex flex-col bg-[#080808] p-4 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer"
    >
      <div className="relative aspect-4/5 rounded-[2rem] overflow-hidden bg-[#111] mb-6">
        <img
          src={event.img}
          alt={event.title}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />

        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-black text-[9px] px-3 py-1.5 rounded-full border border-white/10 tracking-widest uppercase">
          {event.status}
        </div>
      </div>

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
            className="bg-white text-black text-[10px] font-black px-6 py-3 rounded-full hover:bg-yellow-400 transition-all transform active:scale-95 uppercase tracking-tighter text-[12px]"
          >
            Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
