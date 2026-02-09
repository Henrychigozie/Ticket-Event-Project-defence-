import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 50% of the screen height
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
      className={`
        fixed bottom-6 right-6 z-50 
        flex items-center justify-center 
        w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] 
        rounded-full bg-black text-white 
        shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]
        transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-[0_20px_30px_-10px_rgba(0,0,0,0.4)]
        active:scale-95
        ${isVisible 
          ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto" 
          : "opacity-0 invisible translate-y-8 scale-75 pointer-events-none"}
      `}
      aria-label="Back to top"
    >
      <ArrowUp size={24} strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTopButton;