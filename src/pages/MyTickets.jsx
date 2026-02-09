import React, { useEffect, useState } from "react";
import { db, auth } from "../FireBase/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
// import QRCode from "qrcode.react"; // Uncomment if using qrcode.react
import {
  TicketPerforatedFill,
  CalendarEvent,
  GeoAltFill,
  ShareFill,
} from "react-bootstrap-icons";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!auth.currentUser) return;

      try {
    const q = query(
  collection(db, "tickets"),
  where("userId", "==", auth.currentUser.uid), // This matches the rule!
  orderBy("purchasedAt", "desc")
);

        const querySnapshot = await getDocs(q);
        const ticketList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTickets(ticketList);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading)
    return (
      <div className="text-white p-20 text-center">Loading your tickets...</div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 pt-24">
      <h1 className="text-4xl font-black mb-10 tracking-tighter">MY TICKETS</h1>

      {tickets.length === 0 ? (
        <div className="border border-white/10 rounded-3xl p-20 text-center">
          <TicketPerforatedFill className="text-6xl text-white/20 mx-auto mb-4" />
          <p className="text-white/40">
            You haven't purchased any tickets yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden relative"
            >
              {/* Ticket Top Design */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">
                    {ticket.status}
                  </span>
                  <p className="text-[10px] text-white/40 font-mono uppercase">
                    {ticket.paymentRef}
                  </p>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-white/30 font-mono">
                    Ticket ID: {ticket.ticketId}
                  </span>
                </div>

                <h3 className="text-2xl font-bold leading-tight">
                  {ticket.eventTitle}
                </h3>
                <div className="text-xs text-white/40 mb-1">
                  {ticket.eventVenue} • {ticket.eventLocation}
                </div>
                <div className="text-xs text-white/40 mb-1">
                  {ticket.eventDate}{" "}
                  {ticket.eventTime ? `• ${ticket.eventTime}` : ""}
                </div>
                <div className="text-xs text-white/40 mb-1">
                  Type: {ticket.ticketType} | Qty: {ticket.ticketQuantity || 1}
                </div>

                <div className="space-y-2 text-white/60 text-sm">
                  <p className="flex items-center gap-2">
                    <CalendarEvent /> Confirmed Order
                  </p>
                  <p className="text-xs text-white/30">
                    Purchased:{" "}
                    {ticket.purchasedAt?.toDate
                      ? ticket.purchasedAt.toDate().toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>

              {/* Perforated Line Effect */}
              <div className="border-t border-dashed border-white/20 relative my-2">
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-[#050505] rounded-full"></div>
                <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#050505] rounded-full"></div>
              </div>

              {/* Ticket Bottom Design (QR Code Placeholder & Sharing) */}
              <div className="p-6 bg-white/5 flex flex-col gap-2 items-center">
                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-black">
                      Paid Amount
                    </p>
                    <p className="text-xl font-black">{ticket.amountPaid}</p>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    {/* QR code placeholder. To enable, install and use qrcode.react or similar. */}
                    {/* <QRCode value={ticket.verificationCode || ticket.ticketId || ''} size={48} /> */}
                    <div className="w-12 h-12 bg-black flex items-center justify-center text-white text-[8px] text-center p-1">
                      QR
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-white/30 font-mono text-center">
                  Code: {ticket.verificationCode || ticket.ticketId}
                </div>
                {/* Sharing Buttons */}
                <div className="flex gap-2 justify-center mt-2">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out my event ticket for ${ticket.eventTitle} on Tix-PH!\nEvent: ${ticket.eventTitle}\nDate: ${ticket.eventDate} ${ticket.eventTime ? "at " + ticket.eventTime : ""}\nVenue: ${ticket.eventVenue}, ${ticket.eventLocation}\nTicket ID: ${ticket.ticketId}\nVerification Code: ${ticket.verificationCode || ticket.ticketId}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share via WhatsApp"
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 flex items-center"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.52 3.48A12 12 0 0 0 3.48 20.52l-1.32 4.84a1 1 0 0 0 1.22 1.22l4.84-1.32A12 12 0 1 0 20.52 3.48zm-8.52 17.02a9.01 9.01 0 0 1-4.77-1.36l-.34-.2-2.87.78.77-2.8-.22-.36A9.01 9.01 0 1 1 12 20.5zm5.2-6.2c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 4.93 4.23.69.28 1.23.45 1.65.58.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                    </svg>
                  </a>
                  {/* Email */}
                  <a
                    href={`mailto:?subject=My Event Ticket for ${ticket.eventTitle}&body=${encodeURIComponent(`Here is my ticket for ${ticket.eventTitle} on Tix-PH!%0AEvent: ${ticket.eventTitle}%0ADate: ${ticket.eventDate} ${ticket.eventTime ? "at " + ticket.eventTime : ""}%0AVenue: ${ticket.eventVenue}, ${ticket.eventLocation}%0ATicket ID: ${ticket.ticketId}%0AVerification Code: ${ticket.verificationCode || ticket.ticketId}`)}`}
                    title="Share via Email"
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 flex items-center"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z" />
                    </svg>
                  </a>
                  {/* Social (copy to clipboard) */}
                  <button
                    onClick={() => {
                      const shareText = `Check out my event ticket for ${ticket.eventTitle} on Tix-PH!\nEvent: ${ticket.eventTitle}\nDate: ${ticket.eventDate} ${ticket.eventTime ? "at " + ticket.eventTime : ""}\nVenue: ${ticket.eventVenue}, ${ticket.eventLocation}\nTicket ID: ${ticket.ticketId}\nVerification Code: ${ticket.verificationCode || ticket.ticketId}`;
                      navigator.clipboard.writeText(shareText);
                      alert("Ticket info copied to clipboard!");
                    }}
                    title="Copy ticket info"
                    className="bg-gray-700 hover:bg-gray-900 text-white rounded-full p-2 flex items-center"
                  >
                    <ShareFill />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
