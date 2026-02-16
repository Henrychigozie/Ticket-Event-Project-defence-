import React, { useState, useEffect } from "react";
import { db, auth } from "../FireBase/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { GeoAltFill, XCircle, Heart, Share } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventModalDetail = ({
  selectedEvent,
  setSelectedEvent,
  savedEvents,
  toggleSave,
  handleShare,
  openInMaps,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const navigate = useNavigate();

  // ✅ Responsive window tracking
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // ✅ Configure toast defaults
  const showToast = {
    success: (msg) => toast.success(msg, {
      position: isMobile ? "bottom-center" : "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    }),
    error: (msg) => toast.error(msg, {
      position: isMobile ? "bottom-center" : "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    }),
    info: (msg) => toast.info(msg, {
      position: isMobile ? "bottom-center" : "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    }),
    warning: (msg) => toast.warning(msg, {
      position: isMobile ? "bottom-center" : "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    }),
  };

  // ✅ LOAD PAYSTACK SCRIPT - v2 (SILENT LOADING)
  useEffect(() => {
    if (window.PaystackPop) {
      console.log("✅ Paystack already loaded");
      setPaystackLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.async = true;
    
    script.onload = () => {
      console.log("✅ Paystack script loaded");
      if (window.PaystackPop) {
        setPaystackLoaded(true);
        // 👇 REMOVED THE TOAST - NO MORE "Payment system ready" message
      }
    };
    
    script.onerror = () => {
      console.error("❌ Failed to load Paystack");
      // Silent fail - no toast
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Cleanup not needed
    };
  }, []);

  // ✅ SAFE PRICE PARSING
  const numericPrice = (() => {
    try {
      if (!selectedEvent?.price) return 500000;
      const priceString = selectedEvent.price.replace(/[^0-9]/g, "") || "5000";
      return parseInt(priceString) * 100 || 500000;
    } catch (e) {
      return 500000;
    }
  })();

  // ✅ FORMAT PRICE FOR DISPLAY
  const formatPrice = (price) => {
    if (!price) return "₦0";
    const numeric = price.toString().replace(/[^0-9]/g, "");
    return `₦${parseInt(numeric).toLocaleString()}`;
  };

  // ✅ SAVE TICKET TO FIRESTORE
  const saveTicketToFirestore = async (transaction) => {
    setIsProcessing(true);
    console.log("🔥🔥🔥 ATTEMPTING TO SAVE TICKET...");
    
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("❌ No user found!");
        showToast.error("User session lost. Please log in again.");
        return;
      }

      if (!selectedEvent) {
        console.error("❌ No selectedEvent!");
        showToast.error("No event selected. Please try again.");
        return;
      }

      const ticketId = uuidv4();
      const verificationCode = ticketId.substring(0, 8).toUpperCase();
      
      const ticketData = {
        // EVENT DETAILS
        eventTitle: selectedEvent.title || "Untitled Event",
        eventDate: selectedEvent.date || "TBA",
        eventTime: selectedEvent.time || "6:00 pm WAT",
        eventVenue: selectedEvent.venue || "Venue TBA",
        eventLocation: selectedEvent.state || "Location TBA",
        
        // TICKET DETAILS
        ticketType: selectedEvent.type || "General Admission",
        ticketQuantity: 1,
        
        // PRICE
        amountPaid: selectedEvent.price || "₦5,000",
        amountRaw: selectedEvent.price,
        
        // PAYMENT DETAILS
        paymentRef: transaction.reference || transaction.ref || "unknown",
        paymentStatus: "success",
        paymentDate: new Date().toISOString(),
        
        // USER DETAILS
        customerEmail: user.email,
        customerName: user.displayName || user.email?.split('@')[0] || "Customer",
        userId: user.uid,
        
        // STATUS
        status: "confirmed",
        verificationStatus: "active",
        
        // TIMESTAMP
        purchasedAt: serverTimestamp(),
        
        // TICKET IDENTIFIERS
        internalTicketId: ticketId,
        verificationCode: verificationCode,
        
        // METADATA
        createdAt: serverTimestamp(),
      };

      console.log("📝 FINAL TICKET DATA:", JSON.stringify(ticketData, null, 2));

      // ✅ WRITE TO FIRESTORE
      const docRef = await addDoc(collection(db, "tickets"), ticketData);
      console.log("✅✅✅ DOCUMENT WRITTEN! ID:", docRef.id);
      
      // ✅ VERIFY IMMEDIATELY
      const verifyRead = await getDoc(doc(db, "tickets", docRef.id));
      if (verifyRead.exists()) {
        console.log("✅✅✅ VERIFICATION SUCCESSFUL!");
        
        // 🎉 SUCCESS TOAST
        showToast.success(`🎟️ Payment Successful! Your ticket has been saved.`);
      }
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        setSelectedEvent(null);
        navigate("/my-tickets");
      }, 1500);
      
    } catch (error) {
      console.error("❌❌❌ ERROR SAVING TICKET:", error);
      
      // 🚨 SPECIFIC ERROR HANDLING
      if (error.code === "permission-denied") {
        showToast.error("Permission denied! Please check your account.");
      } else if (error.code === "not-found") {
        showToast.error("Tickets collection not found. Please contact support.");
      } else if (error.code === "unavailable") {
        showToast.error("Service unavailable. Check your connection.");
      } else {
        showToast.error(`Failed to save ticket: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ PAYSTACK PAYMENT
  const initializePayment = () => {
    if (!window.PaystackPop) {
      showToast.warning("Payment system loading. Please try again.");
      return;
    }

    if (!auth.currentUser?.email) {
      showToast.error("Please log in to continue.");
      setShowAuthPrompt(true);
      return;
    }

    setIsProcessing(true);

    try {
      const paystack = new window.PaystackPop();
      
      paystack.newTransaction({
        key: "pk_test_82c44f3057d7458b006f39e5cb39c15e33fedb3a",
        email: auth.currentUser.email,
        amount: numericPrice,
        currency: "NGN",
        reference: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Event",
              variable_name: "event",
              value: selectedEvent?.title || "Event"
            }
          ]
        },
        onSuccess: (transaction) => {
          console.log("✅✅✅ PAYMENT SUCCESS!", transaction);
          saveTicketToFirestore(transaction);
        },
        onCancel: () => {
          console.log("❌ Payment cancelled");
          showToast.info("Payment cancelled");
          setIsProcessing(false);
        },
        onError: (error) => {
          console.error("❌ Paystack error:", error);
          showToast.error(`Payment error: ${error.message || "Unknown error"}`);
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error("❌ Error:", error);
      showToast.error(`Error: ${error.message}`);
      setIsProcessing(false);
    }
  };

  // ✅ AUTH CHECK
  const handleBuyClick = () => {
    if (!auth.currentUser) {
      setShowAuthPrompt(true);
      return;
    }
    
    if (!paystackLoaded) {
      showToast.warning("Initializing payment...");
      return;
    }
    
    initializePayment();
  };

  // ✅ MODAL SCROLL LOCK
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedEvent]);

  if (!selectedEvent) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* ✅ Toast Container */}
      <ToastContainer 
        position={isMobile ? "bottom-center" : "bottom-right"}
        autoClose={4000}
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

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => setSelectedEvent(null)}
      />
      
      {/* Modal Container - Fully Responsive */}
      <div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl md:rounded-[3rem] border border-white/10 shadow-2xl flex flex-col md:flex-row text-white animate-modal-pop">
        
        {/* Close Button - Responsive positioning */}
        <button
          onClick={() => setSelectedEvent(null)}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 md:top-8 md:right-8 z-50 text-white/40 hover:text-white text-3xl sm:text-4xl font-light transition-colors"
          aria-label="Close modal"
        >
          <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Left Column - Image (Responsive) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="relative group">
            <img
              src={selectedEvent.img}
              alt={selectedEvent.title}
              className="w-full aspect-square object-cover rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
            />
            {/* Image overlay gradient for better text readability on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl sm:rounded-3xl md:rounded-4xl md:hidden" />
          </div>
        </div>

        {/* Right Column - Content (Responsive) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 md:pl-4 space-y-4 sm:space-y-6 md:space-y-8">
          
          {/* Event Title & Type */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-yellow-400/10 text-yellow-400 text-[10px] sm:text-xs px-3 py-1.5 rounded-full uppercase font-black tracking-wider">
                {selectedEvent.type || "EVENT"}
              </span>
              {selectedEvent.featured && (
                <span className="bg-purple-500/10 text-purple-400 text-[10px] sm:text-xs px-3 py-1.5 rounded-full uppercase font-black tracking-wider">
                  FEATURED
                </span>
              )}
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tighter mb-3">
              {selectedEvent.title}
            </h2>

            {/* Location - Clickable */}
            <div
              onClick={() => openInMaps(selectedEvent.venue, selectedEvent.state)}
              className="group/loc cursor-pointer inline-block"
            >
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white/90 group-hover/loc:text-yellow-400 transition-colors">
                {selectedEvent.venue}
              </p>
              <p className="text-[8px] sm:text-[10px] text-white/40 font-black uppercase tracking-widest mt-1 flex items-center">
                <GeoAltFill className="mr-1 text-sm sm:text-base text-white group-hover/loc:text-yellow-400" />
                Track on Google Maps
              </p>
            </div>

            {/* Date & Time */}
            <p className="text-yellow-400 font-black mt-3 sm:mt-4 text-sm sm:text-base">
              {selectedEvent.date} • {selectedEvent.time || "6:00 pm WAT"}
            </p>
          </div>

          {/* Price & Buy Section - Responsive */}
          <div className="bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-4 sm:p-5 md:p-7 rounded-2xl sm:rounded-3xl border border-white/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-[8px] sm:text-[10px] text-white/40 font-black uppercase tracking-widest">
                  Starting from
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400">
                  {formatPrice(selectedEvent.price)}
                </p>
              </div>

              {auth.currentUser ? (
                <button
                  onClick={handleBuyClick}
                  disabled={isProcessing || !paystackLoaded}
                  className={`w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all ${
                    paystackLoaded
                      ? "bg-yellow-400 text-black hover:scale-105 active:scale-95 shadow-lg shadow-yellow-400/20"
                      : "bg-gray-600 text-white/50 cursor-not-allowed"
                  } disabled:opacity-50`}
                >
                  {isProcessing ? "Processing..." : !paystackLoaded ? "Loading..." : "Get Tickets"}
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthPrompt(true)}
                  className="w-full sm:w-auto bg-yellow-400 text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition"
                >
                  Log in to Buy
                </button>
              )}
            </div>

            {/* Ticket Info - Responsive Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/5">
              <div>
                <p className="text-[8px] sm:text-[10px] text-white/30 font-black uppercase tracking-wider">TICKET TYPE</p>
                <p className="text-xs sm:text-sm font-bold">{selectedEvent.type || "General"}</p>
              </div>
              <div>
                <p className="text-[8px] sm:text-[10px] text-white/30 font-black uppercase tracking-wider">AVAILABILITY</p>
                <p className="text-xs sm:text-sm font-bold text-green-400">
                  {selectedEvent.available ? `${selectedEvent.available} left` : "Limited"}
                </p>
              </div>
            </div>
          </div>

          {/* Auth Prompt Modal */}
          {showAuthPrompt && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80">
              <div className="bg-white text-black rounded-2xl p-6 sm:p-8 max-w-xs w-full animate-modal-pop">
                <h3 className="font-bold text-lg sm:text-xl mb-2">Sign in Required</h3>
                <p className="text-sm sm:text-base mb-6 text-gray-600">
                  You must be logged in to purchase tickets.
                </p>
                <div className="space-y-3">
                  <button
                    className="w-full bg-black text-white px-6 py-3 rounded-full font-bold text-sm"
                    onClick={() => {
                      setShowAuthPrompt(false);
                      navigate("/SignUp");
                    }}
                  >
                    Log In / Sign Up
                  </button>
                  <button
                    className="w-full text-gray-500 text-xs underline py-2"
                    onClick={() => setShowAuthPrompt(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          <div className="space-y-3">
            <h4 className="text-sm sm:text-base font-black uppercase tracking-widest border-b border-white/10 pb-2">
              About This Event
            </h4>
            <p className="text-white/60 leading-relaxed text-xs sm:text-sm">
              {selectedEvent.description || 
                `${selectedEvent.state?.toUpperCase()} 2026. A premier ${selectedEvent.type?.toLowerCase()} event designed for the community.`}
            </p>
            
            {/* Refund Policy - Responsive */}
            <div className="bg-white/5 p-3 sm:p-4 rounded-xl mt-3">
              <p className="text-[10px] sm:text-xs font-bold mb-2">📋 Refund Policy:</p>
              <ul className="text-white/50 text-[10px] sm:text-xs space-y-1 list-disc list-inside">
                <li>Free cancellation within 24 hours of purchase</li>
                <li>Full refund if event is rescheduled or cancelled</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons - Responsive */}
          <div className="flex flex-col xs:flex-row gap-3 pt-2">
            <button
              onClick={() => toggleSave(selectedEvent.title)}
              className={`flex-1 border border-white/10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest transition-all ${
                savedEvents.includes(selectedEvent.title)
                  ? "bg-white text-black hover:bg-gray-100"
                  : "hover:bg-white/5"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Heart className={`w-4 h-4 ${savedEvents.includes(selectedEvent.title) ? "text-red-500 fill-red-500" : ""}`} />
                {savedEvents.includes(selectedEvent.title) ? "Saved" : "Save"}
              </span>
            </button>
            
            <button
              onClick={() => handleShare(selectedEvent)}
              className="flex-1 border border-white/10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:bg-white/5 transition"
            >
              <span className="flex items-center justify-center gap-2">
                <Share className="w-4 h-4" />
                Share
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes modalPop {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-pop {
          animation: modalPop 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EventModalDetail;