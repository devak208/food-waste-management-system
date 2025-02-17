import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import Intro from "./Intro";
import Description from "./Description";
import MenuPage from "./MenuPage";
import Footer from "./Footer";
import DataContextAdmin from "../../Context/DataContextAdmin";

const Landing = () => {
  const { currentPhase } = useContext(DataContextAdmin);

  useEffect(() => {
    document.title = "SLC Home";
    return () => {
      document.title = "SLC";
    };
  }, []);

  return (
    <>
      <Navbar />
      <Intro />
      <Description />
      {currentPhase === "closes" && <MenuPage />}
      <Footer />
    </>
  );
};

export default Landing;
