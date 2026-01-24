import React from "react";
import EventCard from "./EventCard";

const EventsGrid = ({ filteredEvents, setSelectedEvent, selectedState }) => {
  return (
    <>
      {/* Discovery / Header Section */}
      <div className="mb-16">
        <h2 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] opacity-90">
          {selectedState === "Nigeria" ? "Discovery" : selectedState}
        </h2>
        <p className="text-yellow-400 font-black uppercase text-xs mt-6 tracking-[0.4em]">
          Verified 2026 Calendar • {filteredEvents.length} Events Listed
        </p>
      </div>

      {/* Events Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
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
