import React, { useState } from "react";
import Header from "./Header";
import FilterBar from "./FilterBar";
import EventsGrid from "./EventsGrid";
import EventModalDetail from "./EventModalDetail";
import events, { states } from "./eventsData";

const DiceNigeria = () => {
  const [selectedState, setSelectedState] = useState("Nigeria");
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);

  const openInMaps = (venue, state) => {
    const mapQuery = encodeURIComponent(`${venue}, ${state}, Nigeria`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
      "_blank"
    );
  };

  const handleShare = async (event) => {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: `Check out ${event.title} at ${event.venue}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  const toggleSave = (title) => {
    setSavedEvents((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const filteredEvents = events.filter((e) => {
    const matchState =
      selectedState === "Nigeria" || e.state === selectedState;
    const matchSearch = e.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchType = e.type
      .toLowerCase()
      .includes(query.toLowerCase());

    return matchState && (matchSearch || matchType);
  });

  return (
    <div className="bg-black text-white min-h-screen">
      <Header
        query={query}
        setQuery={setQuery}
        setSelectedState={setSelectedState}
      />

      

      <FilterBar
        states={states}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        query={query}
        setQuery={setQuery}
      />

       <main className="px-6 py-16 relative z-10">
               {" "}
        <div className="mb-16">
                   {" "}
          <h2 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] opacity-90">
                       {" "}
            {selectedState === "Nigeria" ? "Discovery" : selectedState}       
             {" "}
          </h2>
                   {" "}
          <p className="text-yellow-400 font-black uppercase text-xs mt-6 tracking-[0.4em]">
                        Verified 2026 Calendar • {filteredEvents.length} Events
            Listed          {" "}
          </p>
                 {" "}
        </div>
               {" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                   {" "}
          {filteredEvents.map((event, i) => (
            <div
              key={i}
              onClick={() => setSelectedEvent(event)} // Clicking card opens modal
              className="group relative flex flex-col bg-[#080808] p-4 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer"
            >
                           {" "}
              <div className="relative aspect-4/5 rounded-[2rem] overflow-hidden bg-[#111] mb-6">
                               {" "}
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                               {" "}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-black text-[9px] px-3 py-1.5 rounded-full border border-white/10 tracking-widest uppercase">
                                    {event.status}               {" "}
                </div>
                             {" "}
              </div>
                           {" "}
              <div className="px-2 space-y-3">
                               {" "}
                <h3 className="text-2xl font-black leading-tight group-hover:text-yellow-400 transition-colors">
                                    {event.title}               {" "}
                </h3>
                               {" "}
                <div className="space-y-1">
                                   {" "}
                  <p className="text-sm font-bold text-yellow-400/90 tracking-tighter">
                                        {event.date} • {event.venue}           
                         {" "}
                  </p>
                                   {" "}
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                        {event.state}, NG                  {" "}
                  </p>
                                 {" "}
                </div>
                               {" "}
                <div className="pt-6 flex justify-between items-center border-t border-white/5 mt-4">
                                   {" "}
                  <div className="flex flex-col">
                                       {" "}
                    <span className="text-[10px] text-white/30 font-black uppercase">
                      Admission
                    </span>
                                       {" "}
                    <span className="font-black text-xl tracking-tighter">
                      {event.price}
                    </span>
                                     {" "}
                  </div>
                                   {" "}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents double-clicking modal
                      setSelectedEvent(event);
                    }}
                    className="bg-white text-black text-[10px] font-black px-6 py-3 rounded-full hover:bg-yellow-400 transition-all transform active:scale-95 uppercase tracking-tighter"
                  >
                                        Tickets                  {" "}
                  </button>
                                 {" "}
                </div>
                             {" "}
              </div>
                         {" "}
            </div>
          ))}
                 {" "}
        </div>
             {" "}
      </main>

      <main className="px-6 py-16">
        <EventsGrid
          filteredEvents={filteredEvents}
          setSelectedEvent={setSelectedEvent}
        />
      </main>

      <EventModalDetail
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        savedEvents={savedEvents}
        toggleSave={toggleSave}
        handleShare={handleShare}
        openInMaps={openInMaps}
      />
    </div>
  );
};

export default DiceNigeria;
