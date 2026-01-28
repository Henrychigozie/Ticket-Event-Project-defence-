import React from "react";
import FansVid from "../assets/_Home_Fans-1-.mp4";
import ArtistsVid from "../assets/_Home_Artists-1.mp4";
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
import Fans from "/src/assets/_Home_Fans-1-.mp4";
import Header from "../components/Header";
import SDL from "/src/assets/SDL.jpg";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const trendingEvents = [
    {
      id: 1,
      title: "Sunset Sessions",
      artist: "DJ Maria",
      date: "FRI, JUN 14",
      venue: "Pacha",
      soldOut: true,
    },
    {
      id: 2,
      title: "Live Jazz Night",
      artist: "Smooth Notes Quartet",
      date: "SAT, JUN 15",
      venue: "Amnesia",
      soldOut: false,
    },
    {
      id: 3,
      title: "Techno Paradise",
      artist: "Neon Pulse",
      date: "SUN, JUN 16",
      venue: "Ushuaïa",
      soldOut: true,
    },
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Get tickets fast",
      description: "Get tickets in less time than it took to read this",
    },
    {
      icon: <Tag className="w-8 h-8" />,
      title: "Upfront pricing",
      description: "See the full price upfront, with no surprises at checkout",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Personalized picks",
      description: "Recommendations on your unique Home feed",
    },
  ];

  const additionalFeatures = [
    "Get tickets to sold out shows",
    "Invite friends in a few taps",
    "Access exclusive merch",
  ];

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

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-black/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-black/5 rounded-full"></div>
        <div
          className="absolute top-0 left-0 w-full h-full opacity-6"
          style={{
            backgroundImage: `radial-gradient(circle at ${scrollY * 0.1}px ${
              scrollY * 0.2
            }px, #000 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-25 pb-20 overflow-hidden">
        <div className="container mx-auto px-10">
          <div className="max-w-3xl relative">
            {/* Animated background text */}
            <div className="absolute -top-20 -left-20 text-[200px] font-black opacity-5 select-none -z-10  ">
              Tix-PH
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tighter ">
              WELCOME
              <span className="block relative">TO THE</span>
              <span className="block relative">
                ALTERNATIVE
                <span className="absolute -bottom-2 left-0 w-48 h-1 bg-black transform -skew-x-12"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl leading-relaxed">
              Incredible live shows. Upfront pricing. Relevant recommendations.
              Tix-PH makes going out easy.
            </p>
            <button className="group inline-flex items-center space-x-3 px-8 py-4 bg-black text-white rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95">
              <span>Get Your Ticket Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>

            {/* Stats */}
            <div className="mt-16 w-300 grid grid-cols-2 md:grid-cols-4 gap-6 ">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-black mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-gray-50 relative px-9">
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-black/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center mb-2">
                <TrendingUp className="w-6 h-6 mr-2" />
                <h2 className="text-3xl font-black">Trending in Aba</h2>
              </div>
              <p className="text-gray-600 max-w-xl">
                Check out some of the most popular events coming up in your
                city, from club nights and gigs to artist signings and comedy
                shows.
              </p>
            </div>
            <button className="mt-4 md:mt-0 group flex items-center space-x-2 text-black hover:text-gray-700 transition-colors">
              <span className="font-semibold">BROWSE EVENTS</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 ">
            {trendingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group relative"
              >
                {event.soldOut && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black text-white text-xs font-bold rounded-full z-10">
                    SOLD OUT
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-6">
                    <span className="text-sm font-semibold tracking-wider">
                      {event.date}
                    </span>
                    <h3 className="text-2xl font-bold mt-3 mb-2 group-hover:text-gray-700 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600">{event.artist}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-black/10">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                      <span className="font-medium">{event.venue}</span>
                    </div>
                    <button
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        event.soldOut
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-900 hover:scale-105"
                      }`}
                    >
                      {event.soldOut ? "Waitlist" : "Get tickets"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Weirdly easy ticketing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Everything you need to discover and book amazing live experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform duration-500">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-black text-white rounded-3xl p-10 max-w-4xl mx-auto transform hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center mb-8">
              <Sparkles className="w-8 h-8 mr-4" />
              <h3 className="text-3xl font-bold">What else?</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/10 transition-colors duration-300"
                >
                  <CheckCircle className="w-6 h-6 mt-1 shrink-0" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Globe className="w-16 h-16 mx-auto mb-8" />
            <h2 className="text-4xl font-black mb-6">
              A network of world-class venues and promoters
            </h2>
            <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
              We partner with the people and places that keep live music culture
              thriving around the world
            </p>
            <button className="group inline-flex items-center space-x-3 px-8 py-4 border-2 border-black rounded-full font-semibold hover:bg-black hover:text-white transition-all duration-300">
              <span>BECOME A PARTNER</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* LovedTestimonial Section */}
      <section className="w-full  h-130 flex items-center">
        <div className="container mx-auto px-4  w-full flex items-center justify-center gap-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16  w-[50%]">
            <div className="  flex flex-col w-full">
              <h2 className="text-3xl font-black mb-8 ">
                Familiar fans, new crushes
              </h2>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                Easily find and follow your favourite artists, and we'll
                recommend more based on your impeccable taste
              </p>
            </div>
          </div>
          {/* Ppp img */}
          <div className="w-[40%] h-110  rounded-md flex items-center justify-center  bg-[#f5f5f5] overflow-hidden">
            <video
              src={ArtistsVid}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full  "
            />
          </div>
        </div>
      </section>

      {/* Loved Section */}
      <section className="w-full h-130 flex items-center   ">
        <div className=" w-full h-90% flex mx-auto px-4   items-center justify-center gap-8 ">
          {/* text sect */}
          <div className=" w-[40%] h-110  rounded-md  bg-[#f5f5f5] overflow-hidden">
            <video
              src={FansVid}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            ></video>
          </div>
          {/* testimonials sect */}
          <div className=" p-10  w-[50%] h-full">
            <div className="flex items-center mb-8">
              <ThumbsUp className="w-8 h-8 mr-4" />
              <h3 className="text-3xl font-bold">Loved by millions</h3>
            </div>
            <p className="text-gray-700 mb-10 text-lg italic leading-relaxed">
              You said, "{testimonials.slice(0, 3).join(", ")}..." We blush.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {testimonials.map((quote, index) => (
                <div
                  key={index}
                  className="bg-white border border-black/5 rounded-xl p-4 hover:border-black/20 transition-all duration-300 hover:shadow-md"
                >
                  <p className="text-sm">"{quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
