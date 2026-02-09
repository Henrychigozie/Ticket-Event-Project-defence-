import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import EventsGrid from "../components/EventsGrid";
import EventModalDetail from "../components/EventModalDetail";
import events, { states } from "../components/eventsData";

const Events = () => {
  const location = useLocation();
  const [selectedState, setSelectedState] = useState("Nigeria");
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);

  /* ===============================
      SYNC SEARCH FROM URL
  ================================ */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("q");
    if (searchParam) {
      setQuery(searchParam);
    } else {
      setQuery("");
    }
  }, [location.search]);

  /* ===============================
      FUNCTIONS (Crucial for display)
  ================================ */
  const openInMaps = (venue, state) => {
    const mapQuery = encodeURIComponent(`${venue}, ${state}, Nigeria`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
      "_blank",
    );
  };

  const handleShare = async (event) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out ${event.title} at ${event.venue}!`,
          url: window.location.href,
        });
      } catch (err) {
        /* ignore cancel */
      }
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

  /* ===============================
      FILTER LOGIC
  ================================ */
  const filteredEvents = events.filter((e) => {
    const matchState = selectedState === "Nigeria" || e.state === selectedState;
    const matchSearch = e.title.toLowerCase().includes(query.toLowerCase());
    const matchType = e.type.toLowerCase().includes(query.toLowerCase());
    return matchState && (matchSearch || matchType);
  });

  return (
    <div className=" text-black min-h-screen">
      <div className="max-w-7xl mx-auto w-full pt-20">
        {" "}
        {/* Added padding for fixed header */}
        <Header query={query} setQuery={setQuery} />
        <FilterBar
          states={states}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          query={query}
          setQuery={setQuery}
        />
        <main className="px-6 py-16 ">
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

export default Events;
