import React, { useState, useEffect } from "react";
import { usePaystackPayment } from "react-paystack";
import { db, auth } from "../FireBase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { GeoAltFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom"; // ✅ Imported

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
  const navigate = useNavigate(); // ✅ Initialized

  // ✅ HIDE SCROLL & ADD CLASS FOR LAYOUT HIDING
  useEffect(() => {
    if (selectedEvent) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden"; // Stops background scrolling
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "unset";
    };
  }, [selectedEvent]);

  if (!selectedEvent) return null;

  // Check authentication state
  const isAuthenticated = !!auth.currentUser;

  const numericPrice =
    parseInt(selectedEvent.price.replace(/[^0-9]/g, "")) * 100 || 500000;

  const config = {
    reference: new Date().getTime().toString(),
    email: auth.currentUser?.email || "customer@example.com",
    amount: numericPrice,
    publicKey: "pk_test_82c44f3057d7458b006f39e5cb39c15e33fedb3a",
    currency: "NGN",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference) => {
    setIsProcessing(true);
    try {
      // Generate unique ticket ID
      const ticketId = uuidv4();
      // Placeholder for QR/verification code (can be ticketId or a hash)
      const verificationCode = ticketId;
      await addDoc(collection(db, "tickets"), {
        eventTitle: selectedEvent.title,
        eventDate: selectedEvent.date,
        eventTime: selectedEvent.time || "6:00 pm WAT",
        eventVenue: selectedEvent.venue,
        eventLocation: selectedEvent.state,
        ticketType: selectedEvent.type || "General",
        ticketQuantity: 1, // Default to 1, can be extended for multi-quantity
        paymentRef: reference.reference,
        amountPaid: selectedEvent.price,
        customerEmail: auth.currentUser?.email || "Guest",
        userId: auth.currentUser?.uid || "anonymous",
        status: "confirmed",
        purchasedAt: serverTimestamp(),
        ticketId,
        verificationCode,
      });

      alert("Payment Successful! Your ticket has been saved.");
      setSelectedEvent(null);
      navigate("/my-tickets");
    } catch (error) {
      console.error("Firebase Error:", error);
      alert(
        "Payment successful, but ticket saving failed. Ref: " +
          reference.reference,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const onClose = () => {
    setIsProcessing(false);
    console.log("Payment cancelled");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={() => setSelectedEvent(null)}
      ></div>

      {/* MODAL WINDOW */}
      <div className="relative bg-[#0a0a0a] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] border border-white/10 shadow-2xl flex flex-col md:flex-row animate-in zoom-in duration-300 text-white">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setSelectedEvent(null)}
          className="absolute top-8 right-10 z-50 text-white/40 hover:text-white text-4xl font-light"
        >
          ×
        </button>

        {/* LEFT SIDE: IMAGE */}
        <div className="w-full md:w-1/2 p-10">
          <img
            src={selectedEvent.img}
            alt={selectedEvent.title}
            className="w-full aspect-square object-cover rounded-4xl shadow-2xl"
          />
        </div>

        {/* RIGHT SIDE: DETAILS */}
        <div className="w-full md:w-1/2 p-10 md:pl-2 md:pr-14 py-14 space-y-8">
          <div>
            <h2 className="text-5xl font-black leading-[0.9] tracking-tighter mb-4">
              {selectedEvent.title}
            </h2>

            <div
              onClick={() =>
                openInMaps(selectedEvent.venue, selectedEvent.state)
              }
              className="group/loc cursor-pointer"
            >
              <p className="text-2xl font-bold text-white/90 group-hover/loc:text-yellow-400 transition-colors">
                {selectedEvent.venue}
              </p>
              <p className="text-xs text-white/40 font-black uppercase tracking-widest mt-1">
                <GeoAltFill className="inline mr-1 text-2xl text-white group-hover/loc:text-yellow-400" />
                Track on Google Maps
              </p>
            </div>

            <p className="text-yellow-400 font-black mt-4 tracking-tight">
              Sat {selectedEvent.date}, 6:00 pm WAT
            </p>
          </div>

          <div className="bg-[#151515] p-7 rounded-3xl flex justify-between items-center border border-white/5">
            <div>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                From
              </p>
              <p className="text-3xl font-black text-white">
                {selectedEvent.price}
              </p>
            </div>

            {/* AUTH CHECK FOR BUY BUTTON */}
            {isAuthenticated ? (
              <button
                onClick={() => initializePayment(onSuccess, onClose)}
                disabled={isProcessing}
                className="bg-yellow-400 text-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition active:scale-95 shadow-lg shadow-yellow-400/20 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Buy Now"}
              </button>
            ) : (
              <button
                onClick={() => setShowAuthPrompt(true)}
                className="bg-yellow-400 text-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition active:scale-95 shadow-lg shadow-yellow-400/20"
              >
                Log in to Buy
              </button>
            )}
          </div>

          {/* AUTH PROMPT MODAL */}
          {showAuthPrompt && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80">
              <div className="bg-white text-black rounded-2xl p-8 max-w-xs w-full flex flex-col items-center">
                <h3 className="font-bold text-lg mb-2">Sign in Required</h3>
                <p className="text-sm mb-4 text-center">
                  You must be logged in to purchase tickets.
                </p>
                <button
                  className="bg-black text-white px-6 py-2 rounded-full font-bold mb-2 w-full"
                  onClick={() => {
                    setShowAuthPrompt(false);
                    navigate("/SignUp");
                  }}
                >
                  Log In / Sign Up
                </button>
                <button
                  className="text-gray-500 text-xs underline"
                  onClick={() => setShowAuthPrompt(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-lg font-black uppercase tracking-widest border-b border-white/10 pb-2">
              About
            </h4>
            <p className="text-white/60 leading-relaxed text-sm">
              {selectedEvent.state?.toUpperCase()} 2026. A premier{" "}
              {selectedEvent.type?.toLowerCase()} event designed for the
              community.
            </p>

            <ul className="list-disc list-inside text-white/60 leading-relaxed text-sm space-y-2">
              <p>You can get a refund if:</p>
              <li>It’s within 24 hours of buying tickets</li>
              <li>This event is rescheduled or cancelled</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => toggleSave(selectedEvent.title)}
              className={`flex-1 border border-white/10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                savedEvents.includes(selectedEvent.title)
                  ? "bg-white text-black"
                  : "hover:bg-white/5"
              }`}
            >
              {savedEvents.includes(selectedEvent.title) ? "♥ Saved" : "♡ Save"}
            </button>

            <button
              onClick={() => handleShare(selectedEvent)}
              className="flex-1 border border-white/10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition"
            >
              ➦ Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModalDetail;
