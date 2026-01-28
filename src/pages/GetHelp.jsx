
import React from 'react';
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
  ChevronDown,
} from "lucide-react";

const HelpPage = () => {
  const menuItems = [
    "I need help with an event",
    "I want to request a refund",
    "I need help with my account",
    "FAQs"
  ];

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-bold text-black text-center mb-10">
          How can we help you?
        </h1>
        
        {/* Menu Items */}
        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 shadow-md rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {/* Circle bullet point */}
              <div className="w-2 h-2 bg-black rounded-full mr-4"></div>
              <span className="text-lg text-black flex items-center  w-full justify-between  ">{item} < ChevronRight className={` ${ <ChevronDown/> ? "" : ""}`} /></span>
             
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;