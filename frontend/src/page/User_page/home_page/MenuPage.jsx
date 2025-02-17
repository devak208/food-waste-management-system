import React, { useRef, useEffect, useContext } from "react";
import MenuHeader from "./MenuHeader";
/* import MenuBanner from "./MenuBanner"; */
import MenuGrid from "./MenuGrid";
import { useLocation } from "react-router-dom";
import DataContextUser from "../../Context/DataContextUser";
import Loading from "./Loading";

const MenuPage = () => {
  const { isLoading, err } = useContext(DataContextUser);
  const menuRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#menuPage") {
      menuRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);
  return (
    <div ref={menuRef} id="menuPage" className="bg-white">
      {!isLoading && err === null && (
        <div>
          <MenuHeader />
          {/* <MenuBanner /> */}
          <MenuGrid />
        </div>
      )}
      {(err !== null || isLoading) && <Loading />}
    </div>
  );
};

export default MenuPage;
