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
      "_blank",
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
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const filteredEvents = events.filter((e) => {
    const matchState = selectedState === "Nigeria" || e.state === selectedState;
    const matchSearch = e.title.toLowerCase().includes(query.toLowerCase());
    const matchType = e.type.toLowerCase().includes(query.toLowerCase());

    return matchState && (matchSearch || matchType);
  });

  return (
    <div className="bg-black text-white min-h-screen">
      <div className=" max-w-7xl mx-auto w-full">
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

        <main className="px-6 py-16">
          <EventsGrid
            filteredEvents={filteredEvents}
            setSelectedEvent={setSelectedEvent}
            selectedState={selectedState}
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
    </div>
  );
};

export default DiceNigeria;
