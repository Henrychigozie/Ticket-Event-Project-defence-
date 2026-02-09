import React, { useState } from "react";

const FilterBar = ({
  selectedState,
  setSelectedState,
  query,
  setQuery,
  states,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white text-white px-4 sm:px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center gap-4 overflow-visible">

      {/* Location Dropdown */}
      <div className="relative w-full sm:w-auto">
        <button
          onClick={() => setOpen(!open)}
          className="bg-[#1a1a1a] w-full sm:w-auto px-6 py-3 rounded-full text-sm font-black flex items-center justify-between sm:justify-center gap-3 border border-white/10 hover:border-yellow-400/50 transition whitespace-nowrap"
        >
          📍 {selectedState}
          <span
            className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        {open && (
          <div className="absolute top-14 left-0 w-full sm:w-64 bg-[#0a0a0a] border border-white/20 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,1)] py-4 z-[1000] animate-in fade-in slide-in-from-top-2">
            {states.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSelectedState(s);
                  setOpen(false);
                }}
                className={`w-full text-left px-6 py-3 text-sm font-bold transition-all ${
                  selectedState === s
                    ? "text-yellow-400 bg-white/5"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {["Tech", "Music", "Business", "Culture"].map((cat) => (
          <button
            key={cat}
            onClick={() => setQuery(cat)}
            className={`bg-[#1a1a1a] px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition border border-transparent whitespace-nowrap flex-shrink-0 ${
              query === cat
                ? "text-yellow-400 border-yellow-400/50"
                : "text-white/40 hover:text-white hover:bg-yellow-400/90"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
