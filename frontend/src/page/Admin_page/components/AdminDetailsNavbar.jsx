import React, { useContext, useEffect, useRef, useState } from "react";
import { RiAccountCircleFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import AdminProfile from "./Adminprofile";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Timer from "../../User_page/home_page/Timer";
import { RxLapTimer } from "react-icons/rx";
import DataContextAdmin from "../../Context/DataContextAdmin";
import Popup from "./PopupComponents/popup";
import { FaEdit } from "react-icons/fa";

const AdminNavbar = () => {
  const { timeErr, loading, setNewOpenTime, setNewCloseTime, currentPhase } =
    useContext(DataContextAdmin);

  const [istimePopupVisible, settimePopupVisible] = useState(false);

  const handleClosePopup = () => {
    settimePopupVisible(false);
  };

  const [dateOpen, setDateOpen] = useState("");
  const [timeOpen, setTimeOpen] = useState("");
  const [dateClose, setDateClose] = useState("");
  const [timeClose, setTimeClose] = useState("");

  const handleUpdate = () => {
    // Get current time for validation
    const currentTime = new Date();

    // Convert the open and close date/time inputs into Date objects
    const openTime = new Date(`${dateOpen}T${timeOpen}:00`);
    const closeTime = new Date(`${dateClose}T${timeClose}:00`);

    // Validate empty fields
    if (!dateOpen || !timeOpen || !dateClose || !timeClose) {
      alert("Please fill in both date and time fields.");
    }
    // Check if the open time is in the past
    else if (openTime < currentTime) {
      alert("Open time cannot be in the past.");
    }
    // Check if the open time is before close time
    else if (openTime >= closeTime) {
      alert("Open time must be before close time.");
    }
    // Check if the gap between open time and close time is more than 48 hours
    else if (closeTime - openTime > 48 * 60 * 60 * 1000) {
      alert(
        "The time gap between open and close cannot be more than 2 days (48 hours)."
      );
    }
    // If all validations pass, set the times
    else {
      setNewOpenTime(openTime.toISOString());
      setNewCloseTime(closeTime.toISOString());
      handleClosePopup();
    }
  };

  const headerRef = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);

    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 w-full z-20 border-t-0.5 border-black shadow-lg bg-white"
    >
      {/* PC View */}
      <div className="hidden lg:flex md:flex-row gap-4 md:gap-0 justify-between items-center py-2 container bg-transparent">
        <div className="flex flex-row items-center gap-2 basis-1/2">
          <button className="px-2 py-1 rounded-lg">
            <Link
              to={"/admin"}
              className="flex text-2xl justify-center items-center gap-1"
            >
              <IoArrowBackCircleSharp className="h-9 w-9" />
            </Link>
          </button>
          <div className="flex text-4xl tracking-tight items-center font-semibold">
            Order Details
          </div>
        </div>

        {/* total */}
        <div className="flex flex-row justify-end items-center gap-7 lg:gap-14 basis-1/3 lg:basis-1/4  ">
          {/* timer */}
          <div className="flex items-center justify-center px-2 gap-2 rounded-lg text-gray-700 w-56">
            <div className="flex gap-2 items-center">
              <RxLapTimer className="h-9 w-9" />
              <Timer className="text-xl text-blue-500" />
            </div>
            {!timeErr.length && !loading && currentPhase !== "load" ? (
              <button
                className="bg-customGray p-2 items-center justify-centers rounded-md border-1 border-black "
                onClick={() => settimePopupVisible(true)}
              >
                <FaEdit className="text-xl text-white bg-customGray" />
              </button>
            ) : (
              <></>
            )}
          </div>
          {/* Profile */}
          <div className="flex items-center justify-center">
            <AdminProfile />
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex lg:hidden flex-col gap-1 justify-between items-center pt-1 container bg-transparent">
        <div className="flex justify-between items-center px-1 w-full">
          <div className="flex flex-row items-center">
            <button className="flex h-9 items-center px-2 py-1 rounded-lg">
              <Link
                to={"/admin"}
                className="flex text-xl justify-center items-center gap-1"
              >
                <IoArrowBackCircleSharp className="h-9 w-9" />
              </Link>
            </button>
            <div className="flex text-2xl tracking-tighter items-center font-semibold">
              Order Details
            </div>
          </div>

          <div className="flex items-center justify-center">
            <RiAccountCircleFill className="h-11 w-11" />
          </div>
        </div>
      </div>

      {/* Time edit pop up */}
      <div>
        <div>
          <Popup trigger={istimePopupVisible} onClose={handleClosePopup}>
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-lg shadow-lg p-5">
                <h1 className="text-center font-bold text-4xl py-5">
                  PHASE DURATION
                </h1>
                <div className="flex flex-col md:flex-row md:justify-center md:space-x-8">
                  {/* Opens At Section */}
                  <div className="flex flex-col items-center mb-4 md:mb-0 gap-4">
                    <p className="text-xl">Opens at</p>
                    <form className="flex flex-col items-center space-y-4">
                      <div className="flex flex-col md:flex-row md:space-x-4 gap-4 mb-4">
                        <input
                          type="date"
                          id="dateOpen"
                          placeholder="Date"
                          className="outline-none border-slate-600 border rounded-lg p-2"
                          value={dateOpen}
                          onChange={(e) => setDateOpen(e.target.value)}
                          required
                        />
                        <input
                          type="time"
                          id="timeOpen"
                          className="outline-none border-slate-600 border w-24 md:w-32 rounded-lg p-2"
                          value={timeOpen}
                          onChange={(e) => setTimeOpen(e.target.value)}
                          required
                        />
                      </div>
                    </form>
                  </div>

                  {/* "To" Section */}
                  <div className="flex items-end mb-4 md:mb-0">
                    <p className="mx-4 mb-4 font-bold text-3xl">To</p>
                  </div>

                  {/* Closes At Section */}
                  <div className="flex flex-col items-center mb-4 md:mb-0 gap-4">
                    <p className="text-xl">Closes at</p>
                    <form
                      id="timeEditForm"
                      className="flex flex-col items-center space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:space-x-4 gap-4 mb-4">
                        <input
                          type="date"
                          id="dateClose"
                          className="outline-none border-slate-600 border rounded-lg p-2"
                          value={dateClose}
                          onChange={(e) => setDateClose(e.target.value)}
                          required
                        />
                        <input
                          type="time"
                          id="timeClose"
                          className="outline-none border-slate-600 border w-24 md:w-32 rounded-lg p-2"
                          value={timeClose}
                          onChange={(e) => setTimeClose(e.target.value)}
                          required
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-center gap-10 mt-4">
                <button className="btn" onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </div>
          </Popup>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
