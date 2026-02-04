import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const signUp = location.pathname === "/SignUp";

  return (
    <>
      {!signUp && <Header />}

      <Outlet />

      {!signUp && <Footer />}
    </>
  );
};
export default Layout;
