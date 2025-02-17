import React, { useContext } from "react";
import { RxLapTimer } from "react-icons/rx";
import { IoSearchSharp } from "react-icons/io5";
import DataContextUser from "../../Context/DataContextUser";
import Filter from "./Filter";
import Timer from "./Timer";
import { Link } from "react-router-dom";
import { MdHistory } from "react-icons/md";

const MenuHeader = () => {
  const { setSearchValue } = useContext(DataContextUser);

  return (
    <header className="bg-white sticky -top-1 w-full z-10 border-t drop-shadow-md">
      {/* PC View */}
      <div className="hidden md:flex md:flex-row gap-4 md:gap-0 justify-between items-center pt-1 px-0 lg:px-0 xl:px-1 container bg-transparent">
        {/* SLC's Menu */}
        <div className="flex basis-full tracking-tight gap-10 items-center">
          <Link to={"#menuPage"} className="text-4xl font-semibold">
            Menu
          </Link>

          {/* Search Bar */}
          <div className="flex gap-10 items-center basis-1/2">
            <form className="flex items-center w-full p-2 rounded-full border-2 bg-white bg-opacity-40">
              <label htmlFor="searchBar">
                <IoSearchSharp className="h-6 w-6 text-black" />
              </label>
              <input
                className="pl-4 pr-2 w-full text-xl text-black outline-none bg-transparent placeholder-gray-500"
                type="text"
                name="searchBar"
                id="searchBar"
                onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
                placeholder="Search for dish"
              />
            </form>
          </div>
        </div>

        {/* total */}
        <div className="flex flex-row justify-end items-center gap-7 xl:gap-10 basis-1/3 lg:basis-1/4">
          {/* timer */}
          <div className="flex items-center justify-center p-2 gap-2 rounded-lg text-gray-700">
            <div className="flex gap-2 items-center">
              <RxLapTimer className="h-9 w-9" />
              <Timer />
            </div>
          </div>
          {/* Profile */}
          <Link
            to={"/home/History&Orders"}
            className="flex items-center justify-center text-black hover:text-slate-700"
          >
            <MdHistory className="h-11 w-11" />
          </Link>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden flex-col gap-1 justify-between items-center pt-1 container bg-transparent">
        <div className="flex gap-3 justify-between items-center pt-2 pb-1 px-1 sm:px-0 w-full">
          <Link
            to={"#menuPage"}
            className="flex text-2xl  tracking-tight items-center font-semibold"
          >
            Menu
          </Link>
          <div className="flex items-center justify-between w-full">
            <form className="flex items-center w-[100%] p-1 rounded-full border-2 bg-white bg-opacity-40">
              <label htmlFor="searchBar">
                <IoSearchSharp className="ml-1 h-5 w-5 text-black" />
              </label>
              <input
                className="ml-4 mr-2 w-full text-lg outline-none bg-transparent placeholder-gray-500 text-black"
                type="text"
                id="searchBar"
                onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
                placeholder="Search"
              />
            </form>
          </div>

          <Link
            to={"/home/History&Orders"}
            className="flex items-center justify-center"
          >
            <MdHistory className="h-9 w-9" />
          </Link>
        </div>
      </div>

      {/* filter section*/}
      <div className="flex px-1 md:px-2">
        <Filter />
        {/* timer */}
        <div className="md:hidden flex items-center justify-center gap-2 rounded-lg text-gray-700">
          <div className="flex gap-2 items-center">
            <RxLapTimer className="h-7 w-7" />
            <Timer />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MenuHeader;
