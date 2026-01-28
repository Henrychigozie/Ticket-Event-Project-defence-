// App.jsx
import React from "react";
import {
  Search,
  Music,
  Calendar,
  Tag,
  Users,
  Star,
  CheckCircle,
  Heart,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Play,
  TrendingUp,
  Sparkles,
  Zap,
  Globe,
  ThumbsUp,
  Ticket,
} from "lucide-react";
import { useEffect, useState } from "react";
import Fans from "/src/assets/_Home_Fans-1-.mp4"
import { Link } from "react-router-dom";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 
//   const [handle, setHandle] = useState(false);
//   useEffect(() => {
//    const AnimatedBackground = () => setHandle()
//  } )

  


  return (
    <>   {/* Animated background elements */}
    

      {/* Header/Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50  transition-all duration-300 w-full ${
          scrollY > 50
            ? "bg-white/95 backdrop-blur-md border-b border-black/10"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-10 py-4">
          <div className="flex items-center justify-between ">
            {/* Logo */}
            <div className="flex items-center space-x-2  ">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg">
                <Music className="w-5 h-5 text-white cursor-arrow" />
              </div>
              <span className="text-2xl font-black tracking-tighter "><Link to="/">Tix-PH</Link></span>
            </div>

            {/* Centered Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-black/20 rounded-full focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Search events, artists, venues..."
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-9">
              <button className="hidden md:flex items-center space-x-2 text-sm font-medium hover:text-gray-600 transition-colors">
                <span className="hover:underline hover:transition-all hover:duration-300"><Link to="/BrowseEvents">Browse Events</Link></span>
                
              </button>

              <button className="hidden md:flex items-center space-x-2 text-sm font-medium hover:text-gray-600 transition-colors">
                <span className="hover:underline hover:transition-all hover:duration-300"> <Link to="/GetHelp">Get help</Link></span>
              </button>

              <div className="hidden md:flex items-center space-x-3 border-l border-black/10 pl-4">
                <button className={`text-sm font-medium hover:text-gray-600 transition-colors`}>
                  <Link to="/SignUp">Log In</Link>
                </button>
                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
                  <Link to="/SignUp">Sign up</Link>
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 animate-fadeIn border-t border-black/10 pt-4">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:border-black"
                    placeholder="Search events..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="block font-medium hover:text-gray-600  transition-colors"
                  >
                    Browser Events
                  </a>
                  <a
                    href="#"
                    className="block font-medium hover:text-gray-600 transition-colors  items-center space-x-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span className="">Get help</span>
                  </a>
                </div>
                <div className="flex space-x-4 pt-4 border-t border-black/10">
                  <button className="flex-1 py-2 border border-black/20 rounded-lg text-sm font-medium hover:bg-black/5">
                    Log in
                  </button>
                  <button className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900">
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

     
  

 
    </>
  );
};

export default App;
