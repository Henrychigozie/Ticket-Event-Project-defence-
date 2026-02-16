import React, { useEffect, useState } from "react";
import { db, auth } from "../FireBase/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { 
  QrCode, 
  Ticket as TicketIcon, 
  Calendar, 
  MapPin, 
  Share2 
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Import social sharing components
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
  LinkedinIcon
} from 'react-share';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [activeShareMenu, setActiveShareMenu] = useState(null);
  const navigate = useNavigate();

  // ✅ Configure toast
  const showToast = {
    success: (msg) => toast.success(msg, {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark",
    }),
    error: (msg) => toast.error(msg, {
      position: "bottom-right",
      autoClose: 4000,
      theme: "dark",
    }),
    info: (msg) => toast.info(msg, {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark",
    }),
  };

  // ✅ Responsive window size tracking
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // ✅ Fetch tickets
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("🎫 FETCHING TICKETS FOR USER:", user.uid);
        
        try {
          const q = query(
            collection(db, "tickets"),
            where("userId", "==", user.uid),
            orderBy("purchasedAt", "desc")
          );
          
          const querySnapshot = await getDocs(q);
          console.log("🎫 USER TICKETS FOUND:", querySnapshot.size);
          
          const ticketList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              purchaseDate: data.purchasedAt?.seconds 
                ? new Date(data.purchasedAt.seconds * 1000).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })
                : "N/A"
            };
          });
          
          setTickets(ticketList);
          if (ticketList.length > 0) {
            showToast.success(`Found ${ticketList.length} ticket${ticketList.length > 1 ? 's' : ''}`);
          }
        } catch (error) {
          console.error("Error fetching tickets:", error);
          showToast.error("Failed to load tickets");
        } finally {
          setLoading(false);
        }
      } else {
        setTickets([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Generate share content for ticket
  const getShareContent = (ticket) => {
    const shareUrl = window.location.origin;
    const title = `🎟️ My Ticket for ${ticket.eventTitle}`;
    const summary = `Check out my ticket for ${ticket.eventTitle} on ${ticket.eventDate} at ${ticket.eventVenue}! 🎫`;
    const hashtags = ['Event', 'Ticket', ticket.eventType || 'Concert'].filter(Boolean);
    
    return {
      url: shareUrl,
      title: title,
      summary: summary,
      hashtags: hashtags,
      via: 'TicketApp'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto"></div>
            <TicketIcon className="w-6 h-6 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white/60 mt-4 text-sm animate-pulse">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] to-black text-white">
      {/* ✅ Toast Container */}
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 99999 }}
      />

      <div className="container mx-auto px-4 py-8 pt-24 pb-20 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <div className="relative">
              <TicketIcon className="text-yellow-400 w-8 h-8 md:w-10 md:h-10" />
              {tickets.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
                  {tickets.length}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
                My <span className="text-yellow-400">Tickets</span>
              </h1>
              <p className="text-white/40 text-xs md:text-sm mt-1">
                {tickets.length} {tickets.length === 1 ? 'item' : 'items'} in wallet
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105"
          >
            Browse Events
          </button>
        </div>

        {/* Empty State */}
        {tickets.length === 0 ? (
          <div className="text-center py-16 md:py-24 px-4 border border-white/5 rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-black">
            <div className="bg-gradient-to-b from-white/5 to-transparent w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <QrCode className="w-8 h-8 md:w-12 md:h-12 text-white/20" />
            </div>
            <h2 className="text-xl md:text-2xl font-black mb-2">Your wallet is empty</h2>
            <p className="text-white/40 mb-6 md:mb-8 text-sm md:text-base max-w-xs mx-auto">
              Discover amazing events and secure your tickets instantly.
            </p>
            <button 
              onClick={() => navigate("/")} 
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 md:px-12 py-4 md:py-5 rounded-full font-black uppercase text-xs tracking-widest transition-all hover:scale-105 shadow-lg shadow-yellow-400/20"
            >
              Browse Events
            </button>
          </div>
        ) : (
          /* Tickets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {tickets.map((ticket) => {
              const shareContent = getShareContent(ticket);
              const isShareMenuOpen = activeShareMenu === ticket.id;
              
              return (
                <div 
                  key={ticket.id} 
                  className="group bg-gradient-to-br from-[#0a0a0a] to-black border border-white/5 rounded-xl md:rounded-2xl hover:border-yellow-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/5 relative"
                >
                  {/* Ticket Header */}
                  <div className="p-4 md:p-6 pb-3 md:pb-4 border-b border-white/5">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="bg-yellow-400/10 text-yellow-400 text-[10px] md:text-xs px-2 py-1 rounded-full uppercase font-black">
                            {ticket.ticketType || "General"}
                          </span>
                          <span className="text-green-400 text-[10px] md:text-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="hidden xs:inline">Confirmed</span>
                          </span>
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-black leading-tight mb-1 truncate">
                          {ticket.eventTitle}
                        </h2>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <p className="text-[8px] md:text-[10px] text-white/30 font-black uppercase tracking-wider">PRICE</p>
                        <p className="text-lg md:text-xl lg:text-2xl font-black text-yellow-400">
                          {ticket.amountPaid}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Body */}
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <div className="bg-white/5 p-1.5 md:p-2 rounded-lg flex-shrink-0">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] md:text-[10px] text-white/30 font-black uppercase tracking-wider">DATE</p>
                          <p className="text-xs md:text-sm font-bold truncate">{ticket.eventDate}</p>
                          <p className="text-[10px] md:text-xs text-white/60 truncate">{ticket.eventTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="bg-white/5 p-1.5 md:p-2 rounded-lg flex-shrink-0">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] md:text-[10px] text-white/30 font-black uppercase tracking-wider">VENUE</p>
                          <p className="text-xs md:text-sm font-bold truncate">{ticket.eventVenue}</p>
                          <p className="text-[10px] md:text-xs text-white/60 truncate">{ticket.eventLocation}</p>
                        </div>
                      </div>
                    </div>

                    {/* QR Code & Share Section */}
                    <div className="flex flex-col xs:flex-row items-center gap-4 bg-black/40 p-3 md:p-4 rounded-xl">
                      <div className="bg-white p-2 rounded-lg flex-shrink-0">
                        <QRCodeSVG 
                          value={ticket.verificationCode || ticket.id} 
                          size={isMobile ? 60 : 80} 
                          level="H"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 text-center xs:text-left">
                        <p className="text-[10px] md:text-xs text-yellow-400/60 font-black uppercase tracking-widest mb-1">
                          ✓ DIGITAL TICKET
                        </p>
                        <p className="text-xs md:text-sm font-mono font-black bg-white/5 px-2 py-1 rounded inline-block truncate max-w-full">
                          {ticket.verificationCode}
                        </p>
                        
                        {/* ✅ FIXED: Share Button with Menu - Positioned Above */}
                        <div className="relative mt-3">
                          <button
                            onClick={() => setActiveShareMenu(isShareMenuOpen ? null : ticket.id)}
                            className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all hover:scale-105 group/share flex items-center gap-2 mx-auto xs:mx-0"
                          >
                            <Share2 className="w-4 h-4 text-white/40 group-hover/share:text-yellow-400" />
                            <span className="text-xs font-medium">Share Ticket</span>
                          </button>

                          {/* ✅ FIXED: Menu appears ABOVE the button (no overflow issues) */}
                          {isShareMenuOpen && (
                            <div className="absolute z-50 bottom-full mb-2 p-3 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl w-[280px] left-1/2 transform -translate-x-1/2 xs:left-0 xs:translate-x-0 animate-fade-in">
                              <p className="text-[10px] text-white/40 mb-2 text-center">Share via</p>
                              
                              {/* Social Media Grid - Compact */}
                              <div className="grid grid-cols-3 gap-2 justify-items-center">
                                {/* WhatsApp */}
                                <div className="flex flex-col items-center">
                                  <WhatsappShareButton
                                    url={shareContent.url}
                                    title={`${shareContent.title}\n\n${shareContent.summary}\n\nTicket Code: ${ticket.verificationCode}`}
                                    className="hover:scale-110 transition-transform"
                                  >
                                    <WhatsappIcon size={32} round />
                                  </WhatsappShareButton>
                                  <span className="text-[7px] text-white/40 mt-0.5">WA</span>
                                </div>

                                {/* Facebook */}
                                <div className="flex flex-col items-center">
                                  <FacebookShareButton
                                    url={shareContent.url}
                                    quote={shareContent.summary}
                                    hashtag={`#${ticket.eventTitle.replace(/\s+/g, '')}`}
                                    className="hover:scale-110 transition-transform"
                                  >
                                    <FacebookIcon size={32} round />
                                  </FacebookShareButton>
                                  <span className="text-[7px] text-white/40 mt-0.5">FB</span>
                                </div>

                                {/* Twitter */}
                                <div className="flex flex-col items-center">
                                  <TwitterShareButton
                                    url={shareContent.url}
                                    title={`${shareContent.title} - ${ticket.eventDate}`}
                                    className="hover:scale-110 transition-transform"
                                  >
                                    <TwitterIcon size={32} round />
                                  </TwitterShareButton>
                                  <span className="text-[7px] text-white/40 mt-0.5">X</span>
                                </div>

                                {/* Telegram */}
                                <div className="flex flex-col items-center">
                                  <TelegramShareButton
                                    url={shareContent.url}
                                    title={`${shareContent.title}\n\n${shareContent.summary}`}
                                    className="hover:scale-110 transition-transform"
                                  >
                                    <TelegramIcon size={32} round />
                                  </TelegramShareButton>
                                  <span className="text-[7px] text-white/40 mt-0.5">TG</span>
                                </div>

                                {/* LinkedIn */}
                                <div className="flex flex-col items-center">
                                  <LinkedinShareButton
                                    url={shareContent.url}
                                    title={shareContent.title}
                                    summary={shareContent.summary}
                                    source="Ticket App"
                                    className="hover:scale-110 transition-transform"
                                  >
                                    <LinkedinIcon size={32} round />
                                  </LinkedinShareButton>
                                  <span className="text-[7px] text-white/40 mt-0.5">IN</span>
                                </div>

                                {/* Email */}
                                <div className="flex flex-col items-center">
                                  <EmailShareButton
                                    url={shareContent.url}
                                    subject={shareContent.title}
                                    body={`${shareContent.summary}\n\nTicket Code: ${ticket.verificationCode}\n\n`}
                                    className="hover:scale-110 transition-transform"
                                  >
                                    <EmailIcon size={32} round />
                                  </EmailShareButton>
                                  <span className="text-[7px] text-white/40 mt-0.5">Email</span>
                                </div>
                              </div>

                              {/* Copy Full Details Button */}
                              <div className="mt-3 pt-2 border-t border-white/10">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      `${shareContent.title}\n\n${shareContent.summary}\nTicket Code: ${ticket.verificationCode}\n\nView at: ${shareContent.url}`
                                    );
                                    showToast.success("Ticket details copied!");
                                    setActiveShareMenu(null);
                                  }}
                                  className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all w-full flex items-center justify-center gap-1"
                                >
                                  <span>📋</span> Copy Full Details
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-[8px] md:text-[10px] text-white/20 mt-3 text-center xs:text-left">
                      Purchased: {ticket.purchaseDate}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .xs\\:left-0 {
          left: 0;
        }
        .xs\\:translate-x-0 {
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
};

export default MyTickets;