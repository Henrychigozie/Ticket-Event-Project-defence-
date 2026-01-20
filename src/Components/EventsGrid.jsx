import React from "react";
import EventCard from "./EventCard";

const EventsGrid = ({ filteredEvents, setSelectedEvent }) => {
  return (
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
  );
};

export default EventsGrid;
