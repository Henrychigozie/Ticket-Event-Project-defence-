import React from "react";
import { Link } from "react-router-dom";

const Header = ({ query, setQuery, setSelectedState }) => {
  return (
    <nav className="sticky top-0 z-[1000] bg-black/95 border-b border-white/10 px-6 py-5 flex items-center justify-between backdrop-blur-xl">
      <h1
        onClick={() => setSelectedState("Nigeria")}
        className="text-3xl font-black italic tracking-tighter cursor-pointer hover:text-yellow-400 transition"
      >
        TIX.ph
      </h1>

      <div className="hidden md:flex flex-1 max-w-lg mx-12">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Tech, Music, Business..."
          className="w-full bg-[#111] border border-white/20 rounded-full px-6 py-3 text-sm focus:border-yellow-400 outline-none transition shadow-inner"
        />
      </div>

      <Link to="/login">
        <button className="bg-white text-black px-8 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition">
          Login
        </button>
      </Link>
    </nav>
  );
};

export default Header;
