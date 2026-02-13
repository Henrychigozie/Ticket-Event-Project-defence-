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
import { GeoAltFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // ✅ LOAD PAYSTACK SCRIPT - v2
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
      // Double-check
      if (window.PaystackPop) {
        setPaystackLoaded(true);
      }
    };
    
    document.body.appendChild(script);
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

  // ✅ SAVE TICKET TO FIRESTORE
 // ✅ FIXED: saveTicketToFirestore - WITH VERIFICATION
const saveTicketToFirestore = async (transaction) => {
  setIsProcessing(true);
  console.log("🔥🔥🔥 ATTEMPTING TO SAVE TICKET...");
  
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("❌ No user found!");
      alert("❌ User session lost. Please log in again.");
      return;
    }

    // 🚨 CRITICAL: Log everything
    console.log("✅ User:", { uid: user.uid, email: user.email });
    console.log("✅ Event:", selectedEvent);
    console.log("✅ Transaction:", transaction);
    console.log("✅ Transaction Reference:", transaction?.reference);

    if (!selectedEvent) {
      console.error("❌ No selectedEvent!");
      alert("❌ No event selected. Please try again.");
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
    console.log("🔥 Writing to Firestore collection: tickets");
    console.log("🔥 Firestore DB instance:", db);

    // ✅ WRITE TO FIRESTORE
    const docRef = await addDoc(collection(db, "tickets"), ticketData);
    console.log("✅✅✅ DOCUMENT WRITTEN! ID:", docRef.id);
    console.log("🔗 Document path:", docRef.path);
    
    // ✅ VERIFY IMMEDIATELY
    const verifyRead = await getDoc(doc(db, "tickets", docRef.id));
    if (verifyRead.exists()) {
      console.log("✅✅✅ VERIFICATION SUCCESSFUL!");
      console.log("📄 Verified data:", verifyRead.data());
      
      // Check if all fields were saved
      const savedData = verifyRead.data();
      console.log("💰 Price saved:", savedData.amountPaid);
      console.log("🎫 Event title saved:", savedData.eventTitle);
      console.log("👤 User ID saved:", savedData.userId);
    } else {
      console.error("❌❌❌ VERIFICATION FAILED - Document not found!");
    }
    
    alert(`✅ Payment Successful! Your ticket has been saved.`);
    setSelectedEvent(null);
    navigate("/my-tickets");
    
  } catch (error) {
    console.error("❌❌❌ ERROR SAVING TICKET:");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    
    // 🚨 SPECIFIC ERROR HANDLING
    if (error.code === "permission-denied") {
      alert("❌ Permission denied! Your Firestore rules are blocking writes. Click '🎫 Create' button first.");
    } else if (error.code === "not-found") {
      alert("❌ Collection 'tickets' doesn't exist! Click the GREEN '🎫 Create' button NOW.");
    } else if (error.code === "unavailable") {
      alert("❌ Firestore is unavailable. Check your internet connection.");
    } else if (error.message?.includes("quota")) {
      alert("❌ Firestore quota exceeded. Please try again later.");
    } else {
      alert(`❌ Failed to save ticket: ${error.message}`);
    }
  } finally {
    setIsProcessing(false);
  }
};

  // ✅ CORRECT PAYSTACK IMPLEMENTATION - Constructor pattern
  const initializePayment = () => {
    if (!window.PaystackPop) {
      alert("❌ Payment system not loaded. Please wait.");
      return;
    }

    if (!auth.currentUser?.email) {
      alert("❌ User email not found. Please log in again.");
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
          setIsProcessing(false);
        },
        onError: (error) => {
          console.error("❌ Paystack error:", error);
          alert(`Payment error: ${error.message || "Unknown error"}`);
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error("❌ Error:", error);
      alert(`Error: ${error.message}`);
      setIsProcessing(false);
    }
  };

  // ✅ TEST PAYSTACK FUNCTION
  const testPaystackDirectly = () => {
    if (!window.PaystackPop) {
      alert("❌ Paystack not loaded. Please wait.");
      return;
    }

    try {
      const paystack = new window.PaystackPop();
      
      paystack.newTransaction({
        key: "pk_test_82c44f3057d7458b006f39e5cb39c15e33fedb3a",
        email: auth.currentUser?.email || "test@example.com",
        amount: 5000,
        currency: "NGN",
        reference: `test-${Date.now()}`,
        onSuccess: () => {
          console.log("%c✅✅✅ TEST SUCCESS!", "font-size: 20px; color: green;");
          alert("✅ Paystack is working!");
        },
        onCancel: () => {
          console.log("❌ Test cancelled");
        },
        onError: (error) => {
          console.error("❌ Test error:", error);
          alert(`Test error: ${error.message}`);
        }
      });
    } catch (error) {
      console.error("❌ Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // ✅ TEST FIRESTORE WRITE
  const testFirestoreWrite = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("❌ You must be logged in");
        return;
      }
      
      const testData = {
        test: true,
        userId: user.uid,
        email: user.email,
        timestamp: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, "test_collection"), testData);
      alert(`✅ Firestore test successful! ID: ${docRef.id}`);
    } catch (error) {
      console.error("❌ TEST WRITE FAILED:", error);
      alert(`❌ Test failed: ${error.message}`);
    }
  };

  // ✅ CREATE TICKETS COLLECTION
  const createTicketsCollection = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("❌ Please log in first");
        return;
      }
      
      const initData = {
        _init: true,
        userId: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        message: "Test document to create tickets collection"
      };
      
      const docRef = await addDoc(collection(db, "tickets"), initData);
      alert(`✅ Tickets collection created successfully!`);
      
    } catch (error) {
      if (error.code === "already-exists") {
        alert("✅ Tickets collection already exists!");
      } else {
        alert(`❌ Failed: ${error.message}`);
      }
    }
  };

  // ✅ AUTH CHECK
  const handleBuyClick = () => {
    if (!auth.currentUser) {
      setShowAuthPrompt(true);
      return;
    }
    
    if (!paystackLoaded) {
      alert("⚠️ Payment system is loading. Please wait.");
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={() => setSelectedEvent(null)}
      />
      
      <div className="relative bg-[#0a0a0a] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] border border-white/10 shadow-2xl flex flex-col md:flex-row text-white">
        <button
          onClick={() => setSelectedEvent(null)}
          className="absolute top-8 right-10 z-50 text-white/40 hover:text-white text-4xl font-light"
        >
          ×
        </button>

        <div className="w-full md:w-1/2 p-10">
          <img
            src={selectedEvent.img}
            alt={selectedEvent.title}
            className="w-full aspect-square object-cover rounded-4xl shadow-2xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 md:pl-2 md:pr-14 py-14 space-y-8">
          <div>
            <h2 className="text-5xl font-black leading-[0.9] tracking-tighter mb-4">
              {selectedEvent.title}
            </h2>
            <div
              onClick={() => openInMaps(selectedEvent.venue, selectedEvent.state)}
              className="group/loc cursor-pointer"
            >
              <p className="text-2xl font-bold text-white/90 group-hover/loc:text-yellow-400">
                {selectedEvent.venue}
              </p>
              <p className="text-xs text-white/40 font-black uppercase tracking-widest mt-1">
                <GeoAltFill className="inline mr-1 text-2xl text-white group-hover/loc:text-yellow-400" />
                Track on Google Maps
              </p>
            </div>
            <p className="text-yellow-400 font-black mt-4">
              {selectedEvent.date}, {selectedEvent.time || "6:00 pm WAT"}
            </p>
          </div>

          <div className="bg-[#151515] p-7 rounded-3xl flex justify-between items-center">
            <div>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">From</p>
              <p className="text-3xl font-black text-white">{selectedEvent.price}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={testFirestoreWrite}
                disabled={!auth.currentUser}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-4 rounded-full font-black uppercase text-xs tracking-widest disabled:opacity-50"
              >
                🔧 Test DB
              </button>

              <button
                onClick={createTicketsCollection}
                disabled={!auth.currentUser}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-4 rounded-full font-black uppercase text-xs tracking-widest disabled:opacity-50"
              >
                🎫 Create
              </button>

              <button
                onClick={testPaystackDirectly}
                disabled={!paystackLoaded}
                className={`px-4 py-4 rounded-full font-black uppercase text-xs tracking-widest ${
                  paystackLoaded 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-gray-600 text-white/50 cursor-not-allowed"
                }`}
              >
                {paystackLoaded ? "💰 Test Pay" : "⏳ Loading..."}
              </button>

              {auth.currentUser ? (
                <button
                  onClick={handleBuyClick}
                  disabled={isProcessing || !paystackLoaded}
                  className={`px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all ${
                    paystackLoaded
                      ? "bg-yellow-400 text-black hover:scale-105 active:scale-95 shadow-lg shadow-yellow-400/20"
                      : "bg-gray-600 text-white/50 cursor-not-allowed"
                  } disabled:opacity-50`}
                >
                  {isProcessing ? "Processing..." : !paystackLoaded ? "Loading..." : "Buy Now"}
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthPrompt(true)}
                  className="bg-yellow-400 text-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105"
                >
                  Log in
                </button>
              )}
            </div>
          </div>

          {showAuthPrompt && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80">
              <div className="bg-white text-black rounded-2xl p-8 max-w-xs w-full">
                <h3 className="font-bold text-lg mb-2">Sign in Required</h3>
                <p className="text-sm mb-4">You must be logged in to purchase tickets.</p>
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
                  className="text-gray-500 text-xs underline w-full"
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
              {selectedEvent.type?.toLowerCase()} event.
            </p>
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
              className="flex-1 border border-white/10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5"
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