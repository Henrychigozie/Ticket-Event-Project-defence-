import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import GetHelp from "./pages/GetHelp";
import Footer from "./components/Footer";
import Layout from "./layouts/Layout";
import ScrollToTop from "./components/ScrollToTop";
import SignUp from "./pages/SignUp";
import { LogIn, Sidebar } from "lucide-react";

import EventForm from './pages/EventForm'
import EventsDashboard from "./pages/EventsDashboard";
import DashboardLayout from "./layouts/DashboardLayout";


function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/BrowseEvents" element={< />} /> */}
          <Route path="/GetHelp" element={<GetHelp />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/LogIn" element={<LogIn />} />

        </Route>

          {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path=""   element={<EventsDashboard />}/>
      </Route>
      </Routes>
    </>
  );
}

export default App;
