import React, { useContext, useRef } from "react";
import { Menu } from "./MenuCard"; // Ensure this is correctly imported
import DataContextUser from "../../Context/DataContextUser";
import NoItems from "./NoItems";

const MenuGrid = () => {
  const { searchItems } = useContext(DataContextUser);

  // Create refs for each category
  const startersRef = useRef(null);
  const mainCourseRef = useRef(null);
  const dessertsRef = useRef(null);

  return (
    <div className={`pb-20 ${searchItems.length === 0 ? "p-4" : "p-0"}`}>
      {searchItems.length > 0 ? (
        <div className="container mx-auto p-4 pt-6">
          <div className="grid gap-10 md:gap-5 rounded-md bg-customLightGray4 p-4 shadow-md">
            <Menu
              items={searchItems}
              startersRef={startersRef}
              mainCourseRef={mainCourseRef}
              dessertsRef={dessertsRef}
            />
          </div>
        </div>
      ) : (
        <NoItems />
      )}
    </div>
  );
};

export default MenuGrid;
