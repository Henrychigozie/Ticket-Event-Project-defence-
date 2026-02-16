import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GetHelp from "./pages/GetHelp";
import Events from "./pages/events";
import Layout from "./layouts/Layout";
import ScrollToTop from "./components/ScrollToTop";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import MyTickets from "./pages/MyTickets";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes basename="/Ticket-Event-Project-defence-"> 
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/GetHelp" element={<GetHelp />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/LogIn" element={<SignUp />} />
          <Route path="/my-tickets" element={<MyTickets />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;