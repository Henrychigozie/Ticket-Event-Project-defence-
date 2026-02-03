import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GetHelp from "./pages/GetHelp";
import Layout from "./layouts/Layout";
import ScrollToTop from "./components/ScrollToTop";
// import ScrollToTopButton from "./components/ScrollToTopButton";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/LogIn" element={<SignUp />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
