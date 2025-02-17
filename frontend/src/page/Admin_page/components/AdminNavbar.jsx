import React, { useContext, useState } from "react";
import { RxLapTimer } from "react-icons/rx";
import { IoSearchSharp } from "react-icons/io5";
import DataContextAdmin from "../../Context/DataContextAdmin";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import Popup from "./PopupComponents/popup";
import Timer from "../../User_page/home_page/Timer";
import AdminProfile from "./Adminprofile";

const AdminNavbar = () => {
  const {
    setSearchValue,
    timeErr,
    loading,
    setNewOpenTime,
    setNewCloseTime,
    currentPhase,
    timeUpdateLoad,
    settimePopupVisible,
    handleTimeEditClosePopup,
    istimePopupVisible,
  } = useContext(DataContextAdmin);

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
    // Check if the gap between open time and close time is more than 96 hours
    else if (closeTime - openTime > 96 * 60 * 60 * 1000) {
      alert(
        "The time gap between open and close cannot be more than 4 days (96 hours)."
      );
    }
    // If all validations pass, set the times
    else {
      setNewOpenTime(openTime.toISOString());
      setNewCloseTime(closeTime.toISOString());
    }
  };

  return (
    <header className="bg-white sticky top-0 w-full z-10 border-t-0.5 border-black shadow-lg">
      {/* PC View */}
      <div className="hidden md:flex md:flex-row gap-4 justify-between items-center py-2 container bg-transparent">
        <div className="flex text-4xl tracking-tight items-end font-semibold">
          Admin
        </div>
        {/* Search Bar */}
        <div className="flex gap-10 items-center basis-1/2">
          <form className="flex items-center w-full p-2 rounded-full border-2">
            <label htmlFor="searchBar">
              <IoSearchSharp className="h-6 w-6 text-black" />
            </label>
            <input
              className="pl-10 w-full text-xl outline-none bg-transparent placeholder-gray-500 text-black"
              type="text"
              name=""
              id="searchBar"
              onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
              placeholder="Search for dish"
            />
          </form>
        </div>
        <div>
          <button className="shadow-lg px-2 py-1 rounded-lg border-0.5 border-black bg-white bg-opacity-50">
            <Link
              to={"/admin/order-details"}
              className="flex text-2xl justify-center items-center gap-1"
            >
              Details
              <svg
                width="20"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.7995 15.889C20.4814 15.889 23.4661 12.9042 23.4661 9.22233C23.4661 5.54043 20.4814 2.55566 16.7995 2.55566C13.1176 2.55566 10.1328 5.54043 10.1328 9.22233C10.1328 12.9042 13.1176 15.889 16.7995 15.889Z"
                  fill="black"
                />
                <path
                  d="M18.7671 35.3557C18.3999 34.9925 18.1603 34.5201 18.0842 34.0093C18.0081 33.4985 18.0995 32.9768 18.3449 32.5223L18.9338 31.4112L17.7227 31.0446C17.2288 30.89 16.7988 30.5785 16.498 30.1574C16.1972 29.7363 16.042 29.2285 16.056 28.7112V26.4334C16.0551 25.9184 16.2198 25.4167 16.526 25.0026C16.8321 24.5884 17.2633 24.2837 17.756 24.1334L18.9671 23.7668L18.3893 22.6557C18.1512 22.2074 18.0605 21.6955 18.1304 21.1927C18.2002 20.6899 18.4269 20.222 18.7782 19.8557C17.9234 19.7438 17.0625 19.6845 16.2004 19.6779C13.6541 19.6179 11.126 20.1206 8.79626 21.1501C6.46655 22.1795 4.39271 23.7104 2.72266 25.6334V34.2446C2.72266 34.5392 2.83972 34.8219 3.04809 35.0302C3.25647 35.2386 3.53908 35.3557 3.83377 35.3557H18.7671Z"
                  fill="black"
                />
                <path
                  d="M37.9439 26.0667L35.7216 25.4C35.5679 24.8511 35.3517 24.3218 35.0772 23.8222L36.1883 21.7556C36.2313 21.6789 36.2469 21.5899 36.2328 21.5031C36.2187 21.4163 36.1756 21.3369 36.1105 21.2778L34.4994 19.6556C34.4374 19.5952 34.3582 19.5553 34.2728 19.5414C34.1873 19.5275 34.0996 19.5402 34.0216 19.5778L31.9661 20.6889C31.4602 20.4138 30.9279 20.1904 30.3772 20.0222L29.6994 17.8C29.6696 17.7181 29.6151 17.6474 29.5435 17.5976C29.4719 17.5479 29.3866 17.5216 29.2994 17.5222H26.9883C26.9017 17.5246 26.8179 17.5537 26.7483 17.6054C26.6787 17.657 26.6268 17.7289 26.5994 17.8111L25.9328 20.0333C25.372 20.198 24.8315 20.4254 24.3216 20.7111L22.3105 19.6C22.2323 19.5585 22.1431 19.5425 22.0553 19.5545C21.9676 19.5665 21.8858 19.6057 21.8216 19.6667L20.1883 21.2667C20.124 21.3287 20.0816 21.4099 20.0676 21.4981C20.0536 21.5863 20.0686 21.6767 20.1105 21.7556L21.2216 23.7778C20.9237 24.2795 20.6815 24.8123 20.4994 25.3667L18.2772 26.0445C18.1931 26.0688 18.1194 26.1199 18.0672 26.1902C18.015 26.2604 17.9873 26.3458 17.9883 26.4333V28.7111C17.9873 28.7986 18.015 28.884 18.0672 28.9543C18.1194 29.0245 18.1931 29.0757 18.2772 29.1L20.4994 29.7778C20.6661 30.3219 20.8895 30.8471 21.1661 31.3445L20.055 33.4556C20.0131 33.5344 19.998 33.6248 20.012 33.713C20.0261 33.8012 20.0684 33.8825 20.1328 33.9445L21.7883 35.5556C21.8525 35.6165 21.9343 35.6558 22.022 35.6677C22.1097 35.6797 22.199 35.6638 22.2772 35.6222L24.355 34.5111C24.8491 34.7778 25.3707 34.9901 25.9105 35.1445L26.5772 37.4222C26.6052 37.5062 26.6588 37.5793 26.7306 37.6312C26.8024 37.683 26.8887 37.711 26.9772 37.7111H29.255C29.3416 37.7087 29.4254 37.6797 29.495 37.628C29.5645 37.5763 29.6165 37.5045 29.6439 37.4222L30.3105 35.1445C30.8436 34.9911 31.3579 34.7787 31.8439 34.5111L33.9439 35.6222C34.0221 35.6638 34.1113 35.6797 34.1991 35.6677C34.2868 35.6558 34.3685 35.6165 34.4328 35.5556L36.055 33.9445C36.1159 33.8802 36.1552 33.7985 36.1672 33.7108C36.1791 33.623 36.1632 33.5338 36.1216 33.4556L35.0105 31.3667C35.2757 30.8796 35.488 30.3656 35.6439 29.8333L37.8661 29.1556C37.9496 29.1287 38.0229 29.0772 38.0765 29.0077C38.1301 28.9383 38.1613 28.8542 38.1661 28.7667V26.4667C38.1688 26.3861 38.1495 26.3063 38.1104 26.2359C38.0713 26.1654 38.0137 26.1069 37.9439 26.0667ZM28.1328 31.3111C27.3983 31.3133 26.6797 31.0975 26.068 30.6911C25.4562 30.2846 24.9788 29.7058 24.6962 29.0279C24.4136 28.35 24.3386 27.6035 24.4805 26.8828C24.6224 26.1622 24.975 25.4999 25.4936 24.9798C26.0121 24.4597 26.6734 24.1051 27.3935 23.961C28.1137 23.8169 28.8605 23.8898 29.5392 24.1703C30.218 24.4509 30.7983 24.9265 31.2065 25.5371C31.6148 26.1476 31.8327 26.8655 31.8328 27.6C31.8328 28.5823 31.4433 29.5246 30.7497 30.2202C30.0562 30.9159 29.1151 31.3082 28.1328 31.3111Z"
                  fill="black"
                />
              </svg>
            </Link>
          </button>
        </div>

        {/* total */}
        <div className="flex flex-row justify-end items-center gap-7 lg:gap-40 basis-1/3 lg:basis-1/4  ">
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
      <div className="flex md:hidden flex-col justify-between items-center pt-2 container bg-transparent">
        <div className="flex justify-between items-center gap-3 px-1 w-full">
          <div className="flex text-3xl tracking-tighter items-end font-semibold">
            Admin
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center w-[70%] p-1 rounded-full border-2"
          >
            <label htmlFor="searchBar">
              <IoSearchSharp className="h-5 w-5 text-black" />
            </label>
            <input
              className="ml-4 w-full text-lg outline-none bg-transparent placeholder-gray-500 text-black"
              type="text"
              name=""
              id="searchBar"
              onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
              placeholder="Search"
            />
          </form>
          <div className="flex items-center justify-center">
            <AdminProfile />
          </div>
        </div>

        <div className="flex items-center justify-between px-1 w-full">
          <button className="flex items-center shadow-lg h-9 px-2 py-1 rounded-lg border-0.5 border-black bg-white bg-opacity-50">
            <Link
              to={"/admin/order-details"}
              className="flex text-xl justify-center items-center gap-1"
            >
              Details
              <svg
                width="20"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.7995 15.889C20.4814 15.889 23.4661 12.9042 23.4661 9.22233C23.4661 5.54043 20.4814 2.55566 16.7995 2.55566C13.1176 2.55566 10.1328 5.54043 10.1328 9.22233C10.1328 12.9042 13.1176 15.889 16.7995 15.889Z"
                  fill="black"
                />
                <path
                  d="M18.7671 35.3557C18.3999 34.9925 18.1603 34.5201 18.0842 34.0093C18.0081 33.4985 18.0995 32.9768 18.3449 32.5223L18.9338 31.4112L17.7227 31.0446C17.2288 30.89 16.7988 30.5785 16.498 30.1574C16.1972 29.7363 16.042 29.2285 16.056 28.7112V26.4334C16.0551 25.9184 16.2198 25.4167 16.526 25.0026C16.8321 24.5884 17.2633 24.2837 17.756 24.1334L18.9671 23.7668L18.3893 22.6557C18.1512 22.2074 18.0605 21.6955 18.1304 21.1927C18.2002 20.6899 18.4269 20.222 18.7782 19.8557C17.9234 19.7438 17.0625 19.6845 16.2004 19.6779C13.6541 19.6179 11.126 20.1206 8.79626 21.1501C6.46655 22.1795 4.39271 23.7104 2.72266 25.6334V34.2446C2.72266 34.5392 2.83972 34.8219 3.04809 35.0302C3.25647 35.2386 3.53908 35.3557 3.83377 35.3557H18.7671Z"
                  fill="black"
                />
                <path
                  d="M37.9439 26.0667L35.7216 25.4C35.5679 24.8511 35.3517 24.3218 35.0772 23.8222L36.1883 21.7556C36.2313 21.6789 36.2469 21.5899 36.2328 21.5031C36.2187 21.4163 36.1756 21.3369 36.1105 21.2778L34.4994 19.6556C34.4374 19.5952 34.3582 19.5553 34.2728 19.5414C34.1873 19.5275 34.0996 19.5402 34.0216 19.5778L31.9661 20.6889C31.4602 20.4138 30.9279 20.1904 30.3772 20.0222L29.6994 17.8C29.6696 17.7181 29.6151 17.6474 29.5435 17.5976C29.4719 17.5479 29.3866 17.5216 29.2994 17.5222H26.9883C26.9017 17.5246 26.8179 17.5537 26.7483 17.6054C26.6787 17.657 26.6268 17.7289 26.5994 17.8111L25.9328 20.0333C25.372 20.198 24.8315 20.4254 24.3216 20.7111L22.3105 19.6C22.2323 19.5585 22.1431 19.5425 22.0553 19.5545C21.9676 19.5665 21.8858 19.6057 21.8216 19.6667L20.1883 21.2667C20.124 21.3287 20.0816 21.4099 20.0676 21.4981C20.0536 21.5863 20.0686 21.6767 20.1105 21.7556L21.2216 23.7778C20.9237 24.2795 20.6815 24.8123 20.4994 25.3667L18.2772 26.0445C18.1931 26.0688 18.1194 26.1199 18.0672 26.1902C18.015 26.2604 17.9873 26.3458 17.9883 26.4333V28.7111C17.9873 28.7986 18.015 28.884 18.0672 28.9543C18.1194 29.0245 18.1931 29.0757 18.2772 29.1L20.4994 29.7778C20.6661 30.3219 20.8895 30.8471 21.1661 31.3445L20.055 33.4556C20.0131 33.5344 19.998 33.6248 20.012 33.713C20.0261 33.8012 20.0684 33.8825 20.1328 33.9445L21.7883 35.5556C21.8525 35.6165 21.9343 35.6558 22.022 35.6677C22.1097 35.6797 22.199 35.6638 22.2772 35.6222L24.355 34.5111C24.8491 34.7778 25.3707 34.9901 25.9105 35.1445L26.5772 37.4222C26.6052 37.5062 26.6588 37.5793 26.7306 37.6312C26.8024 37.683 26.8887 37.711 26.9772 37.7111H29.255C29.3416 37.7087 29.4254 37.6797 29.495 37.628C29.5645 37.5763 29.6165 37.5045 29.6439 37.4222L30.3105 35.1445C30.8436 34.9911 31.3579 34.7787 31.8439 34.5111L33.9439 35.6222C34.0221 35.6638 34.1113 35.6797 34.1991 35.6677C34.2868 35.6558 34.3685 35.6165 34.4328 35.5556L36.055 33.9445C36.1159 33.8802 36.1552 33.7985 36.1672 33.7108C36.1791 33.623 36.1632 33.5338 36.1216 33.4556L35.0105 31.3667C35.2757 30.8796 35.488 30.3656 35.6439 29.8333L37.8661 29.1556C37.9496 29.1287 38.0229 29.0772 38.0765 29.0077C38.1301 28.9383 38.1613 28.8542 38.1661 28.7667V26.4667C38.1688 26.3861 38.1495 26.3063 38.1104 26.2359C38.0713 26.1654 38.0137 26.1069 37.9439 26.0667ZM28.1328 31.3111C27.3983 31.3133 26.6797 31.0975 26.068 30.6911C25.4562 30.2846 24.9788 29.7058 24.6962 29.0279C24.4136 28.35 24.3386 27.6035 24.4805 26.8828C24.6224 26.1622 24.975 25.4999 25.4936 24.9798C26.0121 24.4597 26.6734 24.1051 27.3935 23.961C28.1137 23.8169 28.8605 23.8898 29.5392 24.1703C30.218 24.4509 30.7983 24.9265 31.2065 25.5371C31.6148 26.1476 31.8327 26.8655 31.8328 27.6C31.8328 28.5823 31.4433 29.5246 30.7497 30.2202C30.0562 30.9159 29.1151 31.3082 28.1328 31.3111Z"
                  fill="black"
                />
              </svg>
            </Link>
          </button>
          {/* timer */}
          <div className="flex items-center justify-center py-1 px-2 gap-2 rounded-lg text-gray-700">
            <div className="flex gap-2 items-center">
              <RxLapTimer className="h-8 w-8" />
              <Timer />
              {!timeErr.length && !loading && currentPhase !== "load" ? (
                <button
                  className="bg-customGray p-1 items-center justify-centers rounded-sm border-1 border-black"
                  onClick={() => settimePopupVisible(true)}
                >
                  <FaEdit className="text-xl text-white bg-customGray" />
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Time edit pop up */}
      <div>
        <div>
          <Popup
            trigger={istimePopupVisible}
            onClose={handleTimeEditClosePopup}
          >
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
                {!timeUpdateLoad ? (
                  <button className="btn" onClick={handleUpdate}>
                    Update
                  </button>
                ) : (
                  <svg
                    className="h-10 animate-spin stroke-black text-center"
                    viewBox="0 0 256 256"
                  >
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      strokeWidth="16"
                      stroke="black"
                      fill="none"
                      strokeDasharray="314"
                      strokeDashoffset="0"
                    ></circle>
                  </svg>
                )}
              </div>
            </div>
          </Popup>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
