import React from "react";
import { RxLapTimer } from "react-icons/rx";
import { Link } from "react-router-dom";
import Timer from "../home_page/Timer";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const CartHeader = ({ title, homeRoute }) => {
  return (
    <div className="w-full border drop-shadow-md bg-white transition-all duration-300">
      {/* PC View */}
      <div className="hidden md:flex md:flex-row gap-2 md:gap-0 justify-between items-center py-1 px-1 container bg-transparent">
        {/* SLC's Menu */}
        <div className="flex text-3xl md:text-4xl basis-1/5 tracking-tight gap-3 items-center font-semibold">
          <Link to={homeRoute}>
            <IoArrowBackCircleSharp className="h-8 w-8" />
          </Link>
          <div className="flex justify-center items-center">
            <h1 className="text-3xl tracking-normal">{title}</h1>
          </div>
        </div>

        {/* total */}
        <div className="flex flex-row justify-end items-center gap-5 xl:gap-7 basis-1/3 lg:basis-1/4">
          {/* timer */}
          <div className="flex items-center justify-center p-1 gap-2 rounded-lg text-gray-700">
            <div className="flex gap-2 items-center">
              <RxLapTimer className="h-7 w-7" />
              <Timer />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden flex-col gap-1 items-center pt-1 container bg-transparent">
        <div className="flex justify-around items-center px-1 w-full">
          <div className="flex flex-row items-center justify-center gap-1 basis-full">
            <Link
              to={homeRoute}
              className="flex text-2xl tracking-tight items-center font-semibold"
            >
              <IoArrowBackCircleSharp className="h-8 w-8" />
            </Link>
            <div className="flex text-xl tracking-tight font-semibold justify-center items-center w-full">
              <h1 className="text-xl w-full">{title}</h1>
            </div>
          </div>
          <div className="flex items-center justify-end px-1 w-full">
            {/* timer */}
            <div className="flex items-center py-1 px-2 gap-2 rounded-lg text-gray-700">
              <div className="flex gap-2 items-center">
                <RxLapTimer className="h-6 w-6" />
                <Timer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
