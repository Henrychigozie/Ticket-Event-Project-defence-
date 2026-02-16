import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import FansVid from "../assets/_Home_Fans-1-.mp4";
import ArtistsVid from "../assets/_Home_Artists-1.mp4";
import TixPh from "../assets/Tix-ph.mp4";
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  Tag,
  CheckCircle,
  Globe,
  ThumbsUp,
  ChevronRight,
} from "lucide-react";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate(); // ✅ For programmatic navigation

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const trendingEvents = [
    { id: 1, title: "Sunset Sessions", artist: "DJ Maria", date: "FRI, JUN 14", venue: "Pacha", soldOut: true },
    { id: 2, title: "Live Jazz Night", artist: "Smooth Notes Quartet", date: "SAT, JUN 15", venue: "Amnesia", soldOut: false },
    { id: 3, title: "Techno Paradise", artist: "Neon Pulse", date: "SUN, JUN 16", venue: "Ushuaïa", soldOut: true },
  ];

  const features = [
    { icon: <Zap className="w-8 h-8" />, title: "Get tickets fast", description: "Get tickets in less time than it took to read this" },
    { icon: <Tag className="w-8 h-8" />, title: "Upfront pricing", description: "See the full price upfront, with no surprises at checkout" },
    { icon: <Sparkles className="w-8 h-8" />, title: "Personalized picks", description: "Recommendations on your unique Home feed" },
  ];

  const additionalFeatures = ["Get tickets to sold out shows", "Invite friends in a few taps", "Access exclusive merch"];

  const testimonials = [
    "I ticket purchasing revolution",
    "The best gig ticket app",
    "Refreshing, reassuring, stress-free",
    "10/10, kind, caring, outstanding",
  ];

  const stats = [
    { label: "Events", value: "50K+" },
    { label: "Cities", value: "100+" },
    { label: "Artists", value: "10K+" },
    { label: "Fans", value: "10M+" },
  ];

  // ✅ Navigation handlers
  const handleBrowseEvents = () => {
    navigate("/events");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetTickets = (eventId, soldOut) => {
    if (soldOut) {
      navigate(`/events/${eventId}/waitlist`);
    } else {
      navigate(`/events/${eventId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-hidden">

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-20 pt-10">
          
          {/* Left Column */}
          <div className="lg:w-3/5 relative text-center lg:text-left">
            <div className="absolute -top-20 -left-10 lg:-left-20 text-[120px] sm:text-[160px] lg:text-[200px] font-black opacity-5 select-none -z-10">
              Tix-PH
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 tracking-tight">
              WELCOME <span className="block relative">TO THE</span> <span className="block relative">ALTERNATIVE</span>
            </h1>
            <p className="text-gray-700 mb-6 text-base sm:text-lg md:text-xl max-w-full lg:max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Incredible live shows. Upfront pricing. Relevant recommendations. Tix-PH makes going out easy.
            </p>
            
            {/* ✅ Fixed: Linked to Browse Events */}
            <div className="flex justify-center lg:justify-start mb-12">
              <Link
                to="/events"
                className="group inline-flex items-center space-x-3 px-6 py-3 bg-black text-white rounded-full text-base md:text-lg font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Get Your Ticket Now</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="lg:w-2/5 w-full mb-8 lg:mb-0">
            <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] overflow-hidden shadow-xl lg:shadow-2xl rounded-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <video src={TixPh} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 bg-gray-50 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 text-center md:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-4 md:mb-0">
              <TrendingUp className="w-5 h-5 mr-2" />
              <h2 className="text-2xl md:text-3xl font-black">Trending in Aba</h2>
            </div>
            
            {/* ✅ Fixed: Browse Events button with Link */}
            <Link
              to="/events"
              className="flex items-center justify-center md:justify-start space-x-2 text-black hover:text-gray-700 transition-colors font-semibold group"
            >
              <span>BROWSE EVENTS</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {trendingEvents.map((event) => (
              <div key={event.id} className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative">
                {event.soldOut && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black text-white text-xs font-bold rounded-full z-10">
                    SOLD OUT
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  <span className="text-sm font-semibold tracking-wider">{event.date}</span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-2 mb-1">{event.title}</h3>
                  <p className="text-gray-600">{event.artist}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-black/10">
                    <span className="text-sm font-medium">{event.venue}</span>
                    
                    {/* ✅ Fixed: Event tickets link with proper routing */}
                    <Link
                      to={event.soldOut ? `/events/${event.id}/waitlist` : `/events/${event.id}`}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        event.soldOut 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none" 
                          : "bg-black text-white hover:bg-gray-900 hover:scale-105"
                      }`}
                      onClick={(e) => {
                        if (event.soldOut) {
                          e.preventDefault();
                          // Optional: Show toast notification
                        }
                      }}
                    >
                      {event.soldOut ? "Waitlist" : "Get tickets"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Weirdly easy ticketing</h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-full lg:max-w-2xl mx-auto">
            Everything you need to discover and book amazing live experiences
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-2xl shadow hover:shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Loved / Fans Section */}
      <section className="py-12 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black mb-4">Familiar fans, new crushes</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Easily find and follow your favourite artists, and we'll recommend more based on your impeccable taste
            </p>
            
            {/* ✅ Added link to artists page */}
            <Link
              to="/artists"
              className="inline-flex items-center space-x-2 text-black font-semibold group mt-4"
            >
              <span>Discover Artists</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl h-64 sm:h-80 md:h-96">
            <video src={ArtistsVid} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="mt-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="overflow-hidden rounded-2xl h-64 sm:h-80 md:h-96">
            <video src={FansVid} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>
          <div className="p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Loved by millions</h3>
            <p className="text-gray-700 italic mb-4 text-sm sm:text-base">
              You said, "{testimonials.slice(0, 3).join(", ")}..." We blush.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {testimonials.map((quote, index) => (
                <div key={index} className="bg-white border border-black/5 rounded-xl p-4 hover:border-black/20 hover:shadow-lg transition-all duration-300">
                  <p className="text-sm">"{quote}"</p>
                </div>
              ))}
            </div>
            
            {/* ✅ Added link to reviews page */}
            <Link
              to="/reviews"
              className="inline-flex items-center space-x-2 text-black font-semibold group mt-6"
            >
              <span>Read all reviews</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ Added Call-to-Action Section */}
      <section className="py-16 px-4 sm:px-6 md:px-10 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
            Ready for your next experience?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join millions of fans discovering amazing events.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-black rounded-full text-lg font-black hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <span>Browse Events</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;