// components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import {
  Search,
  HelpCircle,
  Menu,
  X,
  Calendar,
  User,
  LogOut,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/src/assets/Tix-logo-transparent.png";

const Header = ({ query: externalQuery, setQuery: setExternalQuery }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(externalQuery || "");
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize user data from localStorage using lazy initializer
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("tixUser");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem("tixUser");
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem("tixUser");
    if (stored) {
      try {
        JSON.parse(stored);
        return true;
      } catch {
        localStorage.removeItem("tixUser");
      }
    }
    return false;
  });

  /* ===============================
      HANDLE SCROLL + SCREEN SIZE
  ================================ */
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);
    checkMobile();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  /* ===============================
      LOCK BACKGROUND SCROLL
  ================================ */
  useEffect(() => {
    if (isMobile && (isMenuOpen || isSearchOpen)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen, isSearchOpen, isMobile]);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      try {
        searchInputRef.current.focus();
      } catch {
        // Silently ignore focus errors
      }
    }
  }, [isSearchOpen]);

  // Sync search bar with external query (from events page)
  useEffect(() => {
    if (typeof externalQuery === "string" && externalQuery !== searchQuery) {
      setSearchQuery(externalQuery);
    }
  }, [externalQuery]);

  // Close overlays with Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
      if (e.key === "Enter" && isSearchOpen) {
        e.preventDefault();
        if (searchQuery.trim()) {
          navigate(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
          setIsSearchOpen(false);
          if (setExternalQuery) setExternalQuery(searchQuery.trim());
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen, searchQuery, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
    } catch {
      // Silently ignore signOut errors
    }
    localStorage.removeItem("tixUser");
    setUserData(null);
    setIsAuthenticated(false);
    setIsMenuOpen(false);
  };

  // Dynamic values for layout
  const headerHeight = scrollY > 50 ? "h-16" : "h-20";
  const menuTop = scrollY > 50 ? "4rem" : "5rem";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-2000 transition-all duration-300 ${headerHeight} ${
        scrollY > 50 || isMenuOpen
          ? "bg-white border-b shadow-sm"
          : "bg-white md:bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-10 h-full flex items-center justify-between relative">
        {/* MOBILE SEARCH OVERLAY (Left-side Professional Entrance) */}
        <div
          className={`md:hidden absolute inset-y-0 left-0 bg-white transition-all duration-300 ease-in-out flex items-center px-4 z-50 ${
            isSearchOpen
              ? "w-[85%] opacity-100"
              : "w-0 opacity-0 pointer-events-none"
          }`}
        >
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(
                    `/events?q=${encodeURIComponent(searchQuery.trim())}`,
                  );
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }
              }
            }}
          />
        </div>

        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2 shrink-0">
          <img src={logo} alt="logo" className="w-8 md:w-10" />
          <span className="text-xl md:text-2xl font-black tracking-tight">
            Tix-PH
          </span>
        </Link>

        {/* DESKTOP SEARCH - UNTOUCHED */}
        <div className="hidden md:flex flex-1 justify-center px-8">
  <div className="relative w-full max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none bg-white" // Added bg-white to ensure no transparency
      placeholder="Search events..."
      
      /* ADD THESE TWO PROPS TO STOP THE OVERLAYING WORDS */
      autoComplete="off"
      spellCheck="false"
      
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        if (setExternalQuery) setExternalQuery(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
          navigate(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
          if (setExternalQuery) setExternalQuery(searchQuery.trim());
        }
      }}
    />
  </div>
</div>

        {/* DESKTOP ACTIONS - UNTOUCHED */}
        <div className="hidden md:flex items-center space-x-6 shrink-0">
          {/* To this: */}
          <Link
            to="/events" // Change from /BrowseEvents
            className="text-sm font-medium hover:text-gray-600 transition"
          >
            Browse Events
          </Link>

          <Link
            to="/my-tickets"
            className="text-sm font-medium hover:text-gray-600 transition"
          >
            My tickets
          </Link>
          <Link
            to="/GetHelp"
            className="flex items-center space-x-1 text-sm font-medium hover:text-gray-600 transition"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4 border-l pl-4 ml-2">
              <Link to="/profile" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border">
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 m-1.5 text-gray-500" />
                  )}
                </div>
                <span className="text-sm font-medium lg:block hidden">
                  {userData?.name || userData?.email?.split("@")[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/SignUp"
              className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* MOBILE ICONS */}
        <div className="md:hidden flex items-center space-x-4">
          {!isSearchOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                try {
                  setIsSearchOpen(true);
                } catch {
                  // Silently ignore state update errors
                }
              }}
              className="p-1 focus:outline-none user-select-none"
              style={{
                WebkitTapHighlightColor: "transparent",
                userSelect: "none",
              }}
            >
              <Search className="w-6 h-6 text-gray-700" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              try {
                setIsMenuOpen(!isMenuOpen);
                setIsSearchOpen(false);
              } catch {
                // Silently ignore state update errors
              }
            }}
            className="p-1"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-7 h-7 text-gray-900" />
            ) : (
              <Menu className="w-7 h-7 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 bg-white z-55 transition-all duration-300 ease-in-out border-t ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
        style={{ top: menuTop, height: `calc(100vh - ${menuTop})` }}
      >
        <div className="h-full overflow-y-auto py-8 px-6 flex flex-col">
          <nav className="space-y-4">
            <Link
              to="/events"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
            >
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-gray-700" />
                <span className="font-bold text-gray-900 text-lg">
                  Browse Events
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link
              to="/GetHelp"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
            >
              <div className="flex items-center space-x-4">
                <HelpCircle className="w-5 h-5 text-gray-700" />
                <span className="font-bold text-gray-900 text-lg">
                  Get Help
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </nav>

          <div className="mt-auto pb-10">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border rounded-2xl bg-gray-50">
                  <div className="w-12 h-12 rounded-full bg-white border flex items-center justify-center overflow-hidden">
                    {userData?.avatar ? (
                      <img
                        src={userData.avatar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {userData?.name || "Member"}
                    </p>
                    <p className="text-sm text-gray-500">{userData?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-4 text-red-600 bg-red-50 rounded-2xl font-bold flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/SignUp"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center py-4 bg-black text-white font-bold rounded-2xl shadow-lg"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      {(isMenuOpen || isSearchOpen) && (
        <div
          className={`md:hidden fixed inset-0 bg-black/40 z-50 ${isMenuOpen ? "backdrop-blur-sm" : ""}`}
          onClick={() => {
            setIsMenuOpen(false);
            setIsSearchOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
