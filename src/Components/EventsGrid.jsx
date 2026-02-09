import React from "react";
import EventCard from "./EventCard";

const EventsGrid = ({ filteredEvents, setSelectedEvent, selectedState }) => {
  return (
    <>
      {/* Discovery / Header Section */}
      <div className="mb-12 sm:mb-16">
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] opacity-90">
          {selectedState === "Nigeria" ? "Discovery" : selectedState}
        </h2>

        <p className="text-yellow-400 font-black uppercase text-[10px] sm:text-xs mt-4 sm:mt-6 tracking-[0.25em] sm:tracking-[0.4em]">
          Verified 2026 Calendar • {filteredEvents.length} Events Listed
        </p>
      </div>

      {/* Events Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {filteredEvents.map((event, i) => (
          <EventCard
            key={i}
            event={event}
            onSelect={(ev) => setSelectedEvent(ev)}
            onTickets={(ev) => setSelectedEvent(ev)}
          />
        ))}
      </div>
    </>
  );
};

export default EventsGrid;
