import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
// import "./index.css"; // Make sure this path is correct

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 1 full screen height
      if (window.scrollY > window.innerHeight * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top-btn ${isVisible ? "visible" : ""}`}
      aria-label="Back to top"
    >
      <ArrowUp size={24} strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTopButton;