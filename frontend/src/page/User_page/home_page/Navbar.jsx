import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import DataContextUser from "../../Context/DataContextUser";
import { isAunthenticated, logout } from "../login_pages/services/auth";
import { removeUserIdData } from "../login_pages/services/storage";
import { IoLogOutOutline } from "react-icons/io5";
import Profile from "./Profile";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setIsAuthenticated } =
    useContext(DataContextUser);
  const menuIconRef = useRef(null);
  const slideRef = useRef(null);
  const headerRef = useRef(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Close slide when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuIcon = menuIconRef.current;
      const slideMenu = slideRef.current;

      if (
        slideMenu &&
        !slideMenu.contains(event.target) &&
        menuIcon &&
        !menuIcon.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close slide when scrolling
  useEffect(() => {
    const handleScroll = () => {
      closeMenu();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#SLCheader" && headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const handleSignin = () => navigate("/");

  const logoutUser = () => {
    logout();
    removeUserIdData();
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav
      ref={headerRef}
      id="SLCheader"
      className="totalDiv flex-col px-1 bg-white border-b relative"
    >
      <div className="mt-2 py-3 px-2 rounded-lg flex justify-between items-center bg-white">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg
            className="h-10 w-10"
            viewBox="0 0 47 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="23.5" cy="23.5" r="22.5" fill="#8F8F8F" />
            <circle cx="23.5" cy="23.5" r="17.5" fill="#5D5D5D" />
            <circle cx="23.5" cy="23.5" r="12.5" fill="#4D4D4D" />
            <g clipPath="url(#clip0_1255_3626)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23.5 12.1398C23.7699 12.1398 24.0288 12.247 24.2197 12.4379C24.4106 12.6288 24.5179 12.8877 24.5179 13.1576V14.5691C26.848 14.8202 29.0031 15.9237 30.5688 17.6676C32.1345 19.4114 33.0004 21.6725 33 24.0161C33 24.556 33.0001 25.091 33 25.5714C33 26.0518 33 26.0518 30.9643 26.0518H14.2292C13.6893 26.0518 14 26.25 14 25.5714C14 24.8928 14 24.556 14 24.0161C13.9999 21.6727 14.8659 19.412 16.4316 17.6684C17.9973 15.9249 20.1522 14.8215 22.4821 14.5704V13.159C22.482 13.0252 22.5082 12.8927 22.5592 12.7691C22.6103 12.6454 22.6852 12.533 22.7798 12.4384C22.8743 12.3437 22.9866 12.2686 23.1102 12.2174C23.2337 12.1661 23.3662 12.1398 23.5 12.1398ZM15.0586 27.9464C14.7886 27.9464 14.5297 28.0537 14.3388 28.2445C14.1479 28.4354 14.0407 28.6943 14.0407 28.9643C14.0407 29.2342 14.1479 29.4931 14.3388 29.684C14.5297 29.8749 14.7886 29.9821 15.0586 29.9821H31.9414C32.2114 29.9821 32.4703 29.8749 32.6612 29.684C32.852 29.4931 32.9593 29.2342 32.9593 28.9643C32.9593 28.6943 32.852 28.4354 32.6612 28.2445C32.4703 28.0537 32.2114 27.9464 31.9414 27.9464H15.0586Z"
                fill="#F2F2F2"
              />
              <path
                d="M15.3571 24.8929C15.3571 20.1429 17.3928 17.4286 21.4643 16.0714"
                stroke="#444444"
              />
              <path d="M36.925 24.8929H25.05" stroke="#444444" />
              <path
                d="M26.2143 21.5V25.5714"
                stroke="#F2F2F2"
                strokeWidth="0.5"
              />
            </g>
            <defs>
              <clipPath id="clip0_1255_3626">
                <rect
                  width="19"
                  height="19"
                  fill="white"
                  transform="translate(14 12)"
                />
              </clipPath>
            </defs>
          </svg>

          <h1 className="text-4xl font-semibold text-slate-800">SLC</h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex items-center gap-5 text-lg">
          <Link
            className="text-gray-700 hover:text-blue-600"
            to={"/home/History&Orders"}
          >
            <li>History</li>
          </Link>
          <Link className="text-gray-700 hover:text-blue-600" to={"#footer"}>
            <li>About</li>
          </Link>
          <Profile />
        </ul>

        {/* Mobile Menu Toggle Icon */}
        <div className="sm:hidden flex items-center gap-3">
          <div
            ref={menuIconRef}
            className="menu-icon cursor-pointer mr-3"
            onClick={toggleMenu}
          >
            <span className="block h-1 w-6 bg-gray-700 mb-1"></span>
            <span className="block h-1 w-6 bg-gray-700 mb-1"></span>
            <span className="block h-1 w-6 bg-gray-700"></span>
          </div>
        </div>
      </div>

      {menuOpen && (
        <>
          {/* Background Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMenu}
            aria-hidden="true"
          ></div>

          {/* Slide Menu */}
          <div
            ref={slideRef}
            className="sm:hidden fixed top-0 right-0 w-3/4 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
            aria-modal="true"
            role="dialog"
            aria-labelledby="account-details-heading"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-black text-4xl font-semibold hover:opacity-75"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              &times;
            </button>

            <div className="flex flex-col items-start gap-6 p-6">
              <h2
                id="account-details-heading"
                className="font-bold text-xl mt-8"
              >
                Account Details
              </h2>

              {/* User Information */}
              {isAunthenticated() ? (
                <>
                  <div className="flex flex-col items-start text-left w-full p-4 bg-gray-100 rounded">
                    <div className="text-xl font-medium text-black">
                      {user?.name}
                    </div>
                    <div className="text-sm text-gray-700">{user?.email}</div>
                  </div>
                  <ul className="flex flex-col items-start gap-3 mt-4 text-lg w-full">
                    <Link to="/home/History&Orders" onClick={closeMenu}>
                      <li className="py-2 w-full hover:opacity-75">
                        Order History
                      </li>
                    </Link>
                    <Link to="/password-reset" onClick={closeMenu}>
                      <li className="py-2 w-full hover:opacity-75">
                        Change Password
                      </li>
                    </Link>
                    <Link to="#footer" onClick={closeMenu}>
                      <li className="py-2 w-full hover:opacity-75">About Us</li>
                    </Link>
                    <li
                      className="py-2 w-full cursor-pointer hover:opacity-75 flex items-center"
                      onClick={logoutUser}
                    >
                      <IoLogOutOutline className="text-lg mr-2" />
                      Logout
                    </li>
                  </ul>
                </>
              ) : (
                <div className="flex justify-start w-full mt-4">
                  <button
                    onClick={handleSignin}
                    className="py-2 px-4  rounded font-medium bg-black hover:bg-slate-800 text-white"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
