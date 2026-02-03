import React from "react";
import {
  Music,
  Ticket,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Shield,
  Award,
  Heart,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
  ArrowUpRight,
  ArrowUp,
} from "lucide-react";
import logo from "/src/assets/Tix-logo-transparent.png";  // Import your logo image

const Footer = () => {
  const footerLinks = {
    "Buy Tickets": [
      { name: "Concerts", count: "1,240+" },
      { name: "Festivals", count: "89+" },
      { name: "Theater", count: "450+" },
      { name: "Sports", count: "320+" },
      { name: "Comedy Shows", count: "210+" },
    ],
    "Cities": [
      "Factory Road",
      "Calabar Street",
      "Benidon Hotel",
      "Modrich Hotel",
      "Iloilo City",
      "Bacolod City",
      "Tiger Bar",
    ],
    "Company": [
      "About Us",
      "Careers",
      "Press Center",
      "Investor Relations",
      "Sustainability",
      "Contact Us",
    ],
    "Support": [
      "Help Center",
      "Ticket Refunds",
      "Updates",
      "Accessibility",
      "Terms of Service",
      "Privacy Policy",
      "Cookie Policy",
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, name: "Facebook", color: "hover:bg-gray-900" },
    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", color: "hover:bg-gray-900" },
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", color: "hover:bg-gray-900" },
    { icon: <Youtube className="w-5 h-5" />, name: "YouTube", color: "hover:bg-gray-900" },
  ];

  const trustBadges = [
    { icon: <Shield className="w-6 h-6" />, text: "Secure Checkout", subtext: "PCI DSS Compliant" },
    { icon: <Award className="w-6 h-6" />, text: "Verified Tickets", subtext: "100% Authentic" },
    { icon: <Heart className="w-6 h-6" />, text: "Fan Guarantee", subtext: "Money Back Promise" },
  ];

  const contactInfo = [
    { icon: <MapPin className="w-4 h-4" />, text: "Rad5 Tech Hub" },
    { icon: <Phone className="w-4 h-4" />, text: "+234 703 9648 157" },
    { icon: <Mail className="w-4 h-4" />, text: "support@tix-ph.com" },
  ];

  const trendingSearches = [
    "Ben&Ben",
    "K-Pop",
    "Philippine Arena",
    "MOA Arena",
    "Theater",
    "Enhypen",
    "Wanderland",
  ];

  return (
    <footer className="bg-white text-black border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top Section - Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-100 hover:border-gray-300 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-black text-white rounded-lg">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg">{badge.text}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">{badge.subtext}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Section - Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category} className="mb-6 sm:mb-0">
              <h3 className="font-bold text-base sm:text-lg mb-4 text-black flex items-center">
                <ChevronRight className="w-4 h-4 mr-2 text-black" />
                {category}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {items.map((item, index) => (
                  <li key={index}>
                    {typeof item === "object" ? (
                      <a
                        href="#"
                        className="text-gray-600 hover:text-black hover:font-medium transition-all duration-200 flex items-center justify-between group text-sm sm:text-base"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {item.name}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      </a>
                    ) : (
                      <a
                        href="#"
                        className="text-gray-600 hover:text-black hover:font-medium transition-all duration-200 flex items-center group text-sm sm:text-base"
                      >
                        <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {item}
                        </span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand & Social */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={logo} 
                alt="Tix-PH Logo" 
                className="w-10 h-10 border-2 border-gray-500 object-contain"
              />
              <div>
                <span className="text-2xl font-black text-black">Tix-PH</span>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  <div className="text-xs text-gray-600">#1 Ticketing Platform</div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Your gateway to unforgettable experiences. Discover, book, and enjoy the best events.
            </p>
            
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`w-10 h-10 bg-gray-100 text-black rounded-full flex items-center justify-center border border-gray-200 ${social.color} hover:text-white transition-all duration-300 hover:scale-105`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h4 className="font-bold text-lg mb-6 text-black">Contact Us</h4>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 text-black rounded-lg">
                    {info.icon}
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">{info.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <h5 className="font-bold mb-3 text-black">Business Hours</h5>
              <p className="text-gray-600 text-sm">24/7 Customer Support</p>
              <p className="text-gray-600 text-sm">Sales: Mon-Sun, 8AM-10PM</p>
            </div>
          </div>

          {/* Trending Searches */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h4 className="font-bold text-lg mb-4 sm:mb-0 text-black">Trending Now</h4>
              <span className="text-sm text-gray-500">🔥 Hot searches this week</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {trendingSearches.map((search, index) => (
                <a
                  key={index}
                  href="#"
                  className="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-200 group"
                >
                  {search}
                  <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              ))}
            </div>
            
            <div className="p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <Ticket className="w-8 h-8 text-black" />
                <div>
                  <h5 className="font-bold text-black">Newsletter</h5>
                  <p className="text-sm text-gray-600">Get weekly event updates</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
                />
                <button className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors duration-300 text-sm sm:text-base whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Tix-PH Logo" 
                className="w-8 h-8 border border-gray-400 object-contain"
              />
              <div className="text-gray-600 text-xs sm:text-sm">
                <p>© {new Date().getFullYear()} Tix-PH Holdings Ltd. All rights reserved.</p>
                <p className="mt-1">Registered with Rad5 TECH HUB SEC: CS2023123456</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <a href="#" className="text-gray-600 hover:text-black text-xs sm:text-sm">Sitemap</a>
              <a href="#" className="text-gray-600 hover:text-black text-xs sm:text-sm">Accessibility</a>
              <a href="#" className="text-gray-600 hover:text-black text-xs sm:text-sm">Terms</a>
              <a href="#" className="text-gray-600 hover:text-black text-xs sm:text-sm">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-black text-xs sm:text-sm">Cookies</a>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <span className="text-gray-600 text-sm whitespace-nowrap">We accept:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {['GCash', 'Maya', 'Credit Cards', 'Bank Transfer', 'PayPal'].map((method, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-4 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 border border-gray-800"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </footer>
  );
};

export default Footer;