import React, { useContext, useEffect, useRef, useState } from "react";
import { LuFilter, LuFilterX } from "react-icons/lu";
import DataContextUser from "../../Context/DataContextUser";
import { RiCloseCircleFill } from "react-icons/ri";

const Filter = () => {
  const { setFilter, filter, setFoodCategory, foodCategory } =
    useContext(DataContextUser);
  const [isFilterPopup, setIsFilterPopup] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleFilterPopup = () => {
    setIsFilterPopup((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsFilterPopup(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isFilterPopup) {
        setIsFilterPopup(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFilterPopup]);

  return (
    <div className="relative flex gap-1 md:gap-2 items-center py-2 md:pb-2 md:pt-0 container bg-transparent">
      {/* Filter Button */}
      <div
        ref={buttonRef}
        className="flex items-center justify-evenly h-8 md:h-10 gap-2 px-2 md:px-5 text-base md:text-xl rounded-md font-bold tracking-tight border-2 cursor-pointer bg-white bg-opacity-50"
        onClick={(e) => {
          e.stopPropagation();
          toggleFilterPopup();
        }}
      >
        <>
          <span className="hidden sm:block">Filter</span>
        </>
        {!isFilterPopup ? (
          <LuFilter className="sm:h-5 sm:w-5 h-7 w-7" />
        ) : (
          <LuFilterX className="sm:h-5 sm:w-5 h-7 w-7" />
        )}
      </div>
      {filter !== 3 && (
        <div
          role="button"
          onClick={() => setFilter(3)}
          style={{ backgroundColor: "#374151", color: "white" }}
          className="filterPopup border-none hover:ring-0 "
        >
          {filter === 0 ? (
            <>
              <span className="hidden sm:block">Non-Veg</span>
              <span className="block text-xs sm:hidden">N-Veg</span>
            </>
          ) : filter === 1 ? (
            <>
              <span className="hidden sm:block">Veg</span>
              <span className="block text-xs sm:hidden">Veg</span>
            </>
          ) : (
            <>
              <span className="hidden sm:block">Vegan</span>
              <span className="block text-xs sm:hidden">Vegan</span>
            </>
          )}
          <RiCloseCircleFill className="h4 w-4 md:h-5 md:w-5 ml-1 md:ml-2" />
        </div>
      )}
      {foodCategory !== 3 && (
        <div
          role="button"
          onClick={() => setFoodCategory(3)}
          style={{ backgroundColor: "#374151", color: "white" }}
          className="filterPopup border-none hover:ring-0 "
        >
          {foodCategory === 0 ? (
            <>
              <span className="hidden sm:block">Starters</span>
              <span className="block text-xs sm:hidden">Start..</span>
            </>
          ) : foodCategory === 1 ? (
            <>
              <span className="hidden sm:block">Main Course</span>
              <span className="block text-xs sm:hidden">M-Course</span>
            </>
          ) : (
            <>
              <span className="hidden sm:block">Desserts</span>
              <span className="block text-xs sm:hidden">Dess..</span>
            </>
          )}
          <RiCloseCircleFill className="h4 w-4 md:h-5 md:w-5 ml-1 md:ml-2" />
        </div>
      )}

      {/* FilterPopup */}
      {isFilterPopup && (
        <div
          ref={popupRef}
          className="absolute top-full mt-2 w-full md:w-3/4 z-10 bg-white border border-customLightGray2 rounded-lg shadow-lg"
        >
          <div className="space-y-5 rounded-lg p-3 md:p-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">Dietary Choice :</h1>
              <div className="flex flex-row flex-wrap ml-0 md:ml-7 gap-1 md:gap-3">
                <div
                  role="button"
                  onClick={() => setFilter(3)}
                  style={
                    filter === 3
                      ? { backgroundColor: "#374151", color: "white" }
                      : null
                  }
                  className="filterPopup"
                >
                  All
                </div>
                <div
                  role="button"
                  onClick={() => setFilter(1)}
                  style={
                    filter === 1
                      ? { backgroundColor: "#374151", color: "white" }
                      : null
                  }
                  className="filterPopup"
                >
                  Veg
                </div>
                <div
                  role="button"
                  onClick={() => setFilter(0)}
                  style={
                    filter === 0
                      ? { backgroundColor: "#374151", color: "white" }
                      : null
                  }
                  className="filterPopup"
                >
                  Non-Veg
                </div>
                <div
                  role="button"
                  onClick={() => setFilter(2)}
                  style={
                    filter === 2
                      ? { backgroundColor: "#374151", color: "white" }
                      : null
                  }
                  className="filterPopup"
                >
                  Vegan
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">Category :</h1>
              <div className="flex flex-row flex-wrap ml-0 md:ml-7 gap-1 md:gap-3">
                <div
                  role="button"
                  onClick={() => setFoodCategory(3)}
                  style={
                    foodCategory === 3
                      ? { backgroundColor: "#374151", color: "white" }
                      : null
                  }
                  className="filterPopup"
                >
                  All
                </div>
                <div
                  role="button"
                  onClick={() => setFoodCategory(0)}
                  style={
                    foodCategory === 0
                      ? { backgroundColor: "#374151", color: "white" }
                      : null
                  }
                  className="filterPopup"
                >
                  Starters
                </div>
                <div
                  role="button"
                  onClick={() => setFoodCategory(1)}
                  style={
                    foodCategory === 1
                      ? { backgroundColor: "#374151", color: "white" }
                      : null
                  }
                  className="filterPopup"
                >
                  Main Course
                </div>
                <div
                  role="button"
                  onClick={() => setFoodCategory(2)}
                  style={
                    foodCategory === 2
                      ? { backgroundColor: "#374151", color: "white" }
                      : null
                  }
                  className="filterPopup"
                >
                  Desserts
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
