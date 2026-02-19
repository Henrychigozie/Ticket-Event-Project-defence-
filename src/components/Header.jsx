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
  Share2,
  Link2,
  Check,
  Ticket,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "/src/assets/Tix-logo-transparent.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
  LinkedinIcon,
} from "react-share";

const Header = ({ query: externalQuery, setQuery: setExternalQuery }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(externalQuery || "");
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  // User state
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

  // Toast notifications
  const showToast = {
    success: (msg) =>
      toast.success(msg, {
        position: "bottom-center",
        autoClose: 2000,
        theme: "dark",
      }),
    error: (msg) =>
      toast.error(msg, {
        position: "bottom-center",
        autoClose: 2000,
        theme: "dark",
      }),
  };

  // Share content
  const shareUrl = window.location.origin;
  const shareTitle = "Check out Tix-PH - Amazing Events Platform!";
  const shareSummary =
    "Discover and book tickets for the best events in town. Get your tickets now! 🎫";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Scroll and resize handlers
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsShareOpen(false);
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && (isMenuOpen || isSearchOpen || isShareOpen)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen, isSearchOpen, isShareOpen, isMobile]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Sync search with external query
  useEffect(() => {
    if (typeof externalQuery === "string" && externalQuery !== searchQuery) {
      setSearchQuery(externalQuery);
    }
  }, [externalQuery]);

  // Handle escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsShareOpen(false);
      }
      if (e.key === "Enter" && isSearchOpen && searchQuery.trim()) {
        navigate(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchOpen(false);
        if (setExternalQuery) setExternalQuery(searchQuery.trim());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen, searchQuery, navigate, setExternalQuery]);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      localStorage.removeItem("tixUser");
      setUserData(null);
      setIsAuthenticated(false);
      setIsMenuOpen(false);
      showToast.success("Logged out successfully");
    } catch (error) {
      showToast.error("Error logging out");
    }
  };

  const headerHeight = scrollY > 50 ? "h-16" : "h-20";
  const menuTop = scrollY > 50 ? "4rem" : "5rem";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[2000] transition-all duration-300 ${headerHeight} ${
        scrollY > 50 || isMenuOpen || isSearchOpen || isShareOpen
          ? "bg-white/95 backdrop-blur-md border-b shadow-sm"
          : "bg-white"
      }`}
    >
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="dark"
        style={{ zIndex: 99999 }}
      />

      <div className="container mx-auto px-4 lg:px-10 h-full flex items-center justify-between relative">
        {/* MOBILE SEARCH OVERLAY */}
        <div
          className={`md:hidden absolute inset-y-0 left-0 bg-white transition-all duration-300 ease-in-out flex items-center px-4 z-50 ${
            isSearchOpen
              ? "w-[85%] opacity-100"
              : "w-0 opacity-0 pointer-events-none"
          }`}
        >
          <button onClick={() => setIsSearchOpen(false)} className="mr-2 p-1 hover:scale-110 active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fdc700]/50 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                navigate(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
                setIsSearchOpen(false);
                setSearchQuery("");
              }
            }}
          />
        </div>

        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2 shrink-0 group">
          <img 
            src={logo} 
            alt="Tix-PH Logo" 
            className="w-8 md:w-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ease-out" 
          />
          <span className="text-xl md:text-2xl font-black tracking-tight group-hover:text-gray-700 transition-colors">
            Tix-PH
          </span>
        </Link>

        {/* DESKTOP SEARCH */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#fdc700] transition-colors duration-300" />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-[#fdc700] focus:ring-4 focus:ring-[#fdc700]/10 bg-white transition-all duration-300"
              autoComplete="off"
              spellCheck="false"
              placeholder="Search events..."
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

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center space-x-6 shrink-0">
          {/* Share Button */}
          <div className="relative">
            <button
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="group flex items-center space-x-1 text-sm font-medium hover:text-gray-600 transition-colors"
            >
              <Share2 className="w-4 h-4 group-hover:scale-110 group-active:scale-95 transition-transform duration-200" />
              <span>Share</span>
            </button>

            {/* Share Menu */}
            {isShareOpen && (
              <div className="absolute right-0 mt-2 p-3 bg-white border rounded-xl shadow-2xl w-[280px] z-50 animate-fade-in origin-top-right">
                <p className="text-xs text-gray-500 mb-2 text-center">
                  Share Tix-PH
                </p>
                <div className="grid grid-cols-4 gap-2 justify-items-center">
                  {/* WhatsApp */}
                  <div className="flex flex-col items-center">
                    <WhatsappShareButton
                      url={shareUrl}
                      title={`${shareTitle}\n\n${shareSummary}`}
                      className="hover:scale-110 hover:-translate-y-1 transition-all duration-200"
                    >
                      <WhatsappIcon size={36} round />
                    </WhatsappShareButton>
                    <span className="text-[8px] text-gray-500 mt-1">WA</span>
                  </div>

                  {/* Facebook */}
                  <div className="flex flex-col items-center">
                    <FacebookShareButton
                      url={shareUrl}
                      quote={shareSummary}
                      hashtag="#TixPH"
                      className="hover:scale-110 hover:-translate-y-1 transition-all duration-200"
                    >
                      <FacebookIcon size={36} round />
                    </FacebookShareButton>
                    <span className="text-[8px] text-gray-500 mt-1">FB</span>
                  </div>

                  {/* Twitter */}
                  <div className="flex flex-col items-center">
                    <TwitterShareButton
                      url={shareUrl}
                      title={`${shareTitle} - ${shareSummary}`}
                      hashtags={["TixPH", "Events"]}
                      className="hover:scale-110 hover:-translate-y-1 transition-all duration-200"
                    >
                      <TwitterIcon size={36} round />
                    </TwitterShareButton>
                    <span className="text-[8px] text-gray-500 mt-1">X</span>
                  </div>

                  {/* Telegram */}
                  <div className="flex flex-col items-center">
                    <TelegramShareButton
                      url={shareUrl}
                      title={`${shareTitle}\n\n${shareSummary}`}
                      className="hover:scale-110 hover:-translate-y-1 transition-all duration-200"
                    >
                      <TelegramIcon size={36} round />
                    </TelegramShareButton>
                    <span className="text-[8px] text-gray-500 mt-1">TG</span>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex flex-col items-center">
                    <LinkedinShareButton
                      url={shareUrl}
                      title={shareTitle}
                      summary={shareSummary}
                      source="Tix-PH"
                      className="hover:scale-110 hover:-translate-y-1 transition-all duration-200"
                    >
                      <LinkedinIcon size={36} round />
                    </LinkedinShareButton>
                    <span className="text-[8px] text-gray-500 mt-1">IN</span>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col items-center">
                    <EmailShareButton
                      url={shareUrl}
                      subject={shareTitle}
                      body={`${shareSummary}\n\nCheck out Tix-PH: ${shareUrl}`}
                      className="hover:scale-110 hover:-translate-y-1 transition-all duration-200"
                    >
                      <EmailIcon size={36} round />
                    </EmailShareButton>
                    <span className="text-[8px] text-gray-500 mt-1">Email</span>
                  </div>

                  {/* Copy Link */}
                  <div className="flex flex-col items-center col-span-4 mt-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center justify-center gap-2 text-xs bg-gray-100 hover:bg-gray-200 active:bg-gray-300 px-3 py-2 rounded-lg transition-all w-full"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-green-600 animate-scale-in" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Link2 className="w-3 h-3" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/events"
            className={`group text-sm font-medium transition-colors duration-300 relative py-1 ${
              location.pathname === "/events"
                ? "text-[#fdc700] active-link-glow"
                : "text-gray-900 hover:text-[#fdc700]"
            }`}
          >
            Browse Events
            <span className={`absolute left-1/2 -bottom-0.5 h-[2px] bg-[#fdc700] rounded-full transition-all duration-300 ease-out -translate-x-1/2 ${
                location.pathname === "/events" ? "w-full" : "w-0 group-hover:w-full opacity-50"
            }`}></span>
          </Link>

          <Link
            to="/my-tickets"
            className={`group text-sm font-medium transition-colors duration-300 relative py-1 ${
              location.pathname === "/my-tickets"
                ? "text-[#fdc700] active-link-glow"
                : "text-gray-900 hover:text-[#fdc700]"
            }`}
          >
            My Tickets
            <span className={`absolute left-1/2 -bottom-0.5 h-[2px] bg-[#fdc700] rounded-full transition-all duration-300 ease-out -translate-x-1/2 ${
                location.pathname === "/my-tickets" ? "w-full" : "w-0 group-hover:w-full opacity-50"
            }`}></span>
          </Link>

          <Link
            to="/GetHelp"
            className={`group flex items-center space-x-1 text-sm font-medium transition-colors duration-300 relative py-1 ${
              location.pathname === "/GetHelp"
                ? "text-[#fdc700] active-link-glow"
                : "text-gray-900 hover:text-[#fdc700]"
            }`}
          >
            <HelpCircle className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span>Help</span>
            <span className={`absolute left-1/2 -bottom-0.5 h-[2px] bg-[#fdc700] rounded-full transition-all duration-300 ease-out -translate-x-1/2 ${
                location.pathname === "/GetHelp" ? "w-full" : "w-0 group-hover:w-full opacity-50"
            }`}></span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4 border-l pl-4 ml-2">
              <Link to="/profile" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-transparent group-hover:border-[#fdc700] transition-colors duration-300 group-hover:shadow-[0_0_10px_rgba(253,199,0,0.3)]">
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      alt="avatar"
                    />
                  ) : (
                    <User className="w-5 h-5 m-1.5 text-gray-500 group-hover:text-[#fdc700] transition-colors" />
                  )}
                </div>
                <span className="text-sm font-medium lg:block hidden group-hover:text-gray-600 transition-colors">
                  {userData?.name || userData?.email?.split("@")[0]}
                </span>
              </Link>
            </div>
          ) : (
            <Link
              to="/SignUp"
              className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* MOBILE ICONS */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Search */}
          <button onClick={() => setIsSearchOpen(true)} className="p-1 hover:scale-110 active:scale-95 transition-transform">
            <Search className="w-6 h-6 text-gray-700" />
          </button>

          {/* My Tickets */}
          <Link to="/my-tickets" className="p-1 hover:scale-110 active:scale-95 transition-transform">
            <Ticket className={`w-6 h-6 transition-colors duration-300 ${location.pathname === "/my-tickets" ? "text-[#fdc700] drop-shadow-[0_0_8px_rgba(253,199,0,0.5)]" : "text-gray-700"}`} />
          </Link>

          {/* Menu */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsSearchOpen(false);
              setIsShareOpen(false);
            }}
            className="p-1 hover:scale-110 active:scale-95 transition-transform"
          >
            {isMenuOpen ? (
              <X className="w-7 h-7 text-gray-900 animate-spin-in" />
            ) : (
              <Menu className="w-7 h-7 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 bg-white z-[55] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) border-t ${
          isMenuOpen
            ? "translate-y-0 opacity-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
            : "translate-y-full opacity-0"
        }`}
        style={{ top: menuTop, height: `calc(100vh - ${menuTop})` }}
      >
        <div className="h-full overflow-y-auto py-8 px-6 flex flex-col">
          <nav className="space-y-4">
            <Link
              to="/events"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 active:scale-[0.98] ${
                isMenuOpen ? "animate-slide-in-right-1" : "opacity-0"
              } ${
                location.pathname === "/events" 
                  ? "bg-[#fdc700]/10 border border-[#fdc700]/30 shadow-[0_4px_15px_rgba(253,199,0,0.15)] -translate-y-1" 
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-4">
                <Calendar className={`w-5 h-5 transition-colors duration-300 ${location.pathname === "/events" ? "text-[#fdc700]" : "text-gray-700"}`} />
                <span className={`font-bold text-lg transition-colors duration-300 ${location.pathname === "/events" ? "text-[#fdc700]" : "text-gray-900"}`}>
                  Browse Events
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${location.pathname === "/events" ? "text-[#fdc700] translate-x-1" : "text-gray-400"}`} />
            </Link>

            <Link
              to="/my-tickets"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 active:scale-[0.98] ${
                isMenuOpen ? "animate-slide-in-right-2" : "opacity-0"
              } ${
                location.pathname === "/my-tickets" 
                  ? "bg-[#fdc700]/10 border border-[#fdc700]/30 shadow-[0_4px_15px_rgba(253,199,0,0.15)] -translate-y-1" 
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-4">
                <Ticket className={`w-5 h-5 transition-colors duration-300 ${location.pathname === "/my-tickets" ? "text-[#fdc700]" : "text-gray-700"}`} />
                <span className={`font-bold text-lg transition-colors duration-300 ${location.pathname === "/my-tickets" ? "text-[#fdc700]" : "text-gray-900"}`}>
                  My Tickets
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${location.pathname === "/my-tickets" ? "text-[#fdc700] translate-x-1" : "text-gray-400"}`} />
            </Link>

            <Link
              to="/GetHelp"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 active:scale-[0.98] ${
                isMenuOpen ? "animate-slide-in-right-3" : "opacity-0"
              } ${
                location.pathname === "/GetHelp" 
                  ? "bg-[#fdc700]/10 border border-[#fdc700]/30 shadow-[0_4px_15px_rgba(253,199,0,0.15)] -translate-y-1" 
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-4">
                <HelpCircle className={`w-5 h-5 transition-colors duration-300 ${location.pathname === "/GetHelp" ? "text-[#fdc700]" : "text-gray-700"}`} />
                <span className={`font-bold text-lg transition-colors duration-300 ${location.pathname === "/GetHelp" ? "text-[#fdc700]" : "text-gray-900"}`}>
                  Get Help
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${location.pathname === "/GetHelp" ? "text-[#fdc700] translate-x-1" : "text-gray-400"}`} />
            </Link>
          </nav>

          <div className={`mt-auto pb-10 transition-all duration-500 delay-300 ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border rounded-2xl bg-gray-50 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-white border flex items-center justify-center overflow-hidden">
                    {userData?.avatar ? (
                      <img
                        src={userData.avatar}
                        className="w-full h-full object-cover"
                        alt="avatar"
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
                  className="w-full py-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-colors active:scale-[0.98]"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/SignUp"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center py-4 bg-black text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      {(isMenuOpen || isSearchOpen || isShareOpen) && (
        <div
          className={`md:hidden fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
            isMenuOpen || isSearchOpen || isShareOpen ? "opacity-100 backdrop-blur-sm" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => {
            setIsMenuOpen(false);
            setIsSearchOpen(false);
            setIsShareOpen(false);
          }}
        />
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes spin-in {
          from {
            transform: rotate(-90deg) scale(0.5);
            opacity: 0;
          }
          to {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        @keyframes glow-pulse {
          0% { box-shadow: 0 2px 8px rgba(253,199,0,0.4); }
          50% { box-shadow: 0 2px 16px rgba(253,199,0,0.8); }
          100% { box-shadow: 0 2px 8px rgba(253,199,0,0.4); }
        }

        @keyframes slide-in-right {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-spin-in {
          animation: spin-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .active-link-glow::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 2px;
          background-color: #fdc700;
          border-radius: 9999px;
          animation: glow-pulse 2s infinite ease-in-out;
        }

        .animate-slide-in-right-1 { animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .animate-slide-in-right-2 { animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-slide-in-right-3 { animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
      `}</style>
    </header>
  );
};

export default Header;