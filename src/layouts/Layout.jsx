import { Outlet, useLocation } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Watch for the class we added in the Modal
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsModalOpen(document.body.classList.contains("modal-open"));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const isSignUp = location.pathname === "/SignUp";
  const shouldHide = isSignUp || isModalOpen;

  return (
    <>
      {!shouldHide && <Header />}
      <Outlet />
      {!shouldHide && <Footer />}
    </>
  );
};

export default Layout;