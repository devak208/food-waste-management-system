import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Timer from "./Timer";
import { IoArrowDownOutline } from "react-icons/io5";
import DataContextAdmin from "../../Context/DataContextAdmin";
import Image from "./Image";

const Intro = () => {
  const { currentPhase } = useContext(DataContextAdmin);

  return (
    <div className="totalDiv ">
      {/* PC VIEW */}
      <div className="container hidden lg:flex h-fit mt-10 flex-row justify-normal items-center pb-7 pl-2 pr-7 border-b">
        <div className="flex flex-col h-0 lg:h-fit justify-between basis-1/2 lg:basis-3/5 gap-0 lg:gap-3 p-1 border-r">
          <h1
            className="text-5xl sm:text-4xl md:text-7xl xl:w-ninety leading-2 font-semibold text-center lg:text-left text-green-700"
          >
            Reduce Food Waste, Save the Planet
          </h1>
          <div className="flex lg:justify-start justify-center">
            <p className="text-base sm:text-xl text-center lg:text-left font-medium w-4/5 text-gray-500">
              Every action counts. Join us in reducing food waste and protecting our environment for future generations.
            </p>
          </div>
          <div className="mt-0 lg:mt-5 flex justify-start gap-9">
            {currentPhase === "closed" ||
            currentPhase === "opens" ||
            currentPhase === "load" ? (
              <></>
            ) : (
              <Link role="button" to={"#menuPage"} className="btn">
                GET FOOD
              </Link>
            )}
            <div className="flex items-center">
              {currentPhase === "opens" ? (
                <span
                  className="border-2 font-semibold text-gray-600 rounded text-xl h-12 py-2 px-4 flex items-center justify-center w-fit"
                  style={{ borderColor: "#B0BEC5" }}
                >
                  <Timer />
                </span>
              ) : currentPhase === "closes" ? (
                <span
                  className="border-2 font-semibold text-gray-600 rounded text-xl h-12 py-2 px-4 flex items-center justify-center gap-2"
                  style={{ borderColor: "#B0BEC5" }}
                >
                  Event Ongoing <IoArrowDownOutline className="h-6 w-6" />
                </span>
              ) : currentPhase === "closed" || currentPhase === "load" ? (
                <span
                  className="border-2 font-semibold text-gray-600 rounded text-xl h-12 py-2 px-4 flex items-center justify-center"
                  style={{ borderColor: "#B0BEC5" }}
                >
                  <Timer />
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <Image />
      </div>

      {/* MOBILE VIEW */}
      <div className="container py-10 px-2 lg:hidden flex flex-col border-b">
        <div className="flex flex-col gap-5">
          <div className="flex justify-center px-2">
            <h1
              className="md:text-6xl text-3xl tracking-tight text-center leading-2 font-semibold text-green-700"
             /*  style={{ color: "#2D2D2D" }} */
            >
              Reduce Food Waste, Save the Planet
            </h1>
          </div>
          <div className="w-full flex justify-center">
            <p className="md:text-base text-sm text-center font-medium md:w-3/5 w-4/5 text-gray-500">
              Every action counts. Join us in reducing food waste and protecting our environment for future generations.
            </p>
          </div>
          <div className="mt-5 flex flex-col justify-center gap-4 border-b pb-5">
            <div className="flex justify-center items-center">
              {currentPhase === "opens" ? (
                <span
                  className="border-2 font-semibold text-gray-600 rounded text-xl h-16 py-2 px-4 flex items-center justify-center w-fit"
                  style={{ borderColor: "#B0BEC5" }}
                >
                  <Timer />
                </span>
              ) : currentPhase === "closes" ? (
                <span
                  className="border-2 font-semibold text-gray-600 rounded text-xl h-12 py-2 px-4 flex items-center justify-center gap-2"
                  style={{ borderColor: "#B0BEC5" }}
                >
                  Event Ongoing <IoArrowDownOutline className="h-6 w-6" />
                </span>
              ) : currentPhase === "closed" || currentPhase === "load" ? (
                <span
                  className="border-2 rounded text-lg text-gray-600 h-12 py-2 px-4 flex items-center justify-center"
                  style={{ borderColor: "#B0BEC5" }}
                >
                  <Timer />
                </span>
              ) : null}
            </div>
            <div className="flex justify-center items-center">
              {currentPhase === "closed" ||
              currentPhase === "opens" ||
              currentPhase === "load" ? (
                <></>
              ) : (
                <Link role="button" to={"#menuPage"} className="btn mt-2">
                  GET FOOD
                </Link>
              )}
            </div>
          </div>
          <Image />
        </div>
      </div>
      
    </div>
  );
};

export default Intro;
