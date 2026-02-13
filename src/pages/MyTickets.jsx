import React, { useEffect, useState } from "react";
import { db, auth } from "../FireBase/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { QrCode, Ticket as TicketIcon, Calendar, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("🎫 FETCHING TICKETS FOR USER:", user.uid);
        
        try {
          // Query tickets for this user
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
        } catch (error) {
          console.error("Error fetching tickets:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <TicketIcon className="text-yellow-400 w-10 h-10" />
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">
            My <span className="text-yellow-400">Tickets</span>
          </h1>
          {tickets.length > 0 && (
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-black">
              {tickets.length}
            </span>
          )}
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-24 border border-white/5 rounded-3xl bg-[#0a0a0a]">
            <QrCode className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 mb-8">No tickets yet.</p>
            <button 
              onClick={() => navigate("/")} 
              className="bg-yellow-400 text-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-yellow-400/50 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-400/10 text-yellow-400 text-xs px-2 py-1 rounded-full">
                        {ticket.ticketType || "General"}
                      </span>
                      <span className="text-green-400 text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        Confirmed
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-black mb-2">
                      {ticket.eventTitle}
                    </h2>
                    
                    <div className="space-y-2 text-white/60 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                        <span>{ticket.eventDate} • {ticket.eventTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <span>{ticket.eventVenue}</span>
                      </div>
                    </div>
                    
                    <p className="text-yellow-400 font-black text-2xl mt-4">
                      {ticket.amountPaid}
                    </p>
                    <p className="text-xs text-white/30 mt-1">
                      Purchased: {ticket.purchaseDate}
                    </p>
                  </div>
                  
                  <div className="ml-4 text-center">
                    <div className="bg-white p-2 rounded-lg">
                      <QRCodeSVG 
                        value={ticket.verificationCode || ticket.id} 
                        size={100} 
                        level="H"
                      />
                    </div>
                    <p className="text-[10px] text-white/40 mt-2 font-mono">
                      {ticket.verificationCode}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;