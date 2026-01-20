import React from "react";

const EventModalDetail = ({
  selectedEvent,
  setSelectedEvent,
  savedEvents,
  toggleSave,
  handleShare,
  openInMaps,
}) => {
  if (!selectedEvent) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={() => setSelectedEvent(null)}
      ></div>

      <div className="relative bg-[#0a0a0a] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] border border-white/10 shadow-2xl flex flex-col md:flex-row animate-in zoom-in duration-300">
        <button
          onClick={() => setSelectedEvent(null)}
          className="absolute top-8 right-10 z-50 text-white/40 hover:text-white text-4xl font-light"
        >
          ×
        </button>

        <div className="w-full md:w-1/2 p-10">
          <img
            src={selectedEvent.img}
            alt={selectedEvent.title}
            className="w-full aspect-square object-cover rounded-[2rem] shadow-2xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 md:pl-2 md:pr-14 py-14 space-y-8">
          <div>
            <h2 className="text-5xl font-black leading-[0.9] tracking-tighter mb-4">
              {selectedEvent.title}
            </h2>

            <div
              onClick={() =>
                openInMaps(selectedEvent.venue, selectedEvent.state)
              }
              className="group/loc cursor-pointer"
            >
              <p className="text-2xl font-bold text-white/90 group-hover/loc:text-yellow-400 transition-colors">
                {selectedEvent.venue}
              </p>
              <p className="text-xs text-white/40 font-black uppercase tracking-widest mt-1">
                📍 Track on Google Maps
              </p>
            </div>

            <p className="text-yellow-400 font-black mt-4 tracking-tight">
              Sat {selectedEvent.date}, 6:00 pm WAT
            </p>
          </div>

          <div className="bg-[#151515] p-7 rounded-3xl flex justify-between items-center border border-white/5">
            <div>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                From
              </p>
              <p className="text-3xl font-black text-white">
                {selectedEvent.price}
              </p>
            </div>

            <button className="bg-yellow-400 text-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition active:scale-95 shadow-lg shadow-yellow-400/20">
              Buy Now
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-black uppercase tracking-widest border-b border-white/10 pb-2">
              About
            </h4>
            <p className="text-white/60 leading-relaxed text-sm">
              {selectedEvent.state.toUpperCase()} 2026. A premier{" "}
              {selectedEvent.type.toLowerCase()} event designed for the
              community.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => toggleSave(selectedEvent.title)}
              className={`flex-1 border border-white/10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                savedEvents.includes(selectedEvent.title)
                  ? "bg-white text-black"
                  : "hover:bg-white/5"
              }`}
            >
              {savedEvents.includes(selectedEvent.title) ? "♥ Saved" : "♡ Save"}
            </button>

            <button
              onClick={() => handleShare(selectedEvent)}
              className="flex-1 border border-white/10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition"
            >
              ➦ Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModalDetail;
