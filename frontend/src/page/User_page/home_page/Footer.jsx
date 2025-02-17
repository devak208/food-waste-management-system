import React, { useEffect, useRef } from "react";
import Feedback from "./Feedback";
import Contact from "./Contact";
import Copyright from "./Copyright";
import { useLocation } from "react-router-dom";
const Footer = () => {
  const footerRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#footer") {
      footerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);
  return (
    <footer>
      <div
        ref={footerRef}
        id="footer"
        className="flex flex-col lg:flex-row justify-between p-5 md:p-10 items-start min-h-72 bg-white border-y"
      >
        <Feedback />
        <Contact />
      </div>
      <Copyright />
    </footer>
  );
};

export default Footer;
