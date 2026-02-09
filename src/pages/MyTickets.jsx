import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../FireBase/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { TicketPerforatedFill, CalendarEvent, ShareFill } from "react-bootstrap-icons";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // We use onAuthStateChanged to ensure the user is fully loaded before querying
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        navigate("/SignUp");
        return;
      }

      const ticketsRef = collection(db, "tickets");
      // IMPORTANT: This query requires an Index in Firebase
      const q = query(
        ticketsRef,
        where("userId", "==", user.uid),
        orderBy("purchasedAt", "desc")
      );

      const unsubscribeTickets = onSnapshot(q, (querySnapshot) => {
        const ticketList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTickets(ticketList);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching tickets:", error);
        // If you see a link in the browser console error, CLICK IT to create the index
        setLoading(false);
      });

      return () => unsubscribeTickets();
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  if (loading) {
    return <div className="text-white p-20 text-center">Loading your tickets...</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 pt-24">
      <h1 className="text-4xl font-black mb-10 tracking-tighter">MY TICKETS</h1>

      {tickets.length === 0 ? (
        <div className="border border-white/10 rounded-3xl p-20 text-center">
          <TicketPerforatedFill className="text-6xl text-white/20 mx-auto mb-4" />
          <p className="text-white/40">You haven't purchased any tickets yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden relative">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">
                    {ticket.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold leading-tight">{ticket.eventTitle}</h3>
                <p className="text-xs text-white/40">{ticket.eventVenue} • {ticket.eventLocation}</p>
                <div className="pt-4 border-t border-white/10">
                   <p className="text-[10px] text-white/40 uppercase font-black">Ticket ID</p>
                   <p className="text-sm font-mono text-yellow-400">{ticket.ticketId}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// THIS IS THE LINE YOU WERE LIKELY MISSING:
export default MyTickets;