import { useState, useEffect, useRef } from "react";
import { RiAccountCircleFill } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import {
  Admingetuserdetails,
  AdminisAunthenticated,
  Adminlogout,
} from "../AdminPages/LoginPage/services/Adminstorage";
import { IoMdCloseCircle } from "react-icons/io";


export default function AdminProfile() {
  const navigate = useNavigate();
  const [isProfilePanelVisible, setIsProfilePanelVisible] = useState(false);
  const panelRef = useRef(null);
  const [admindetails,setadmindetails]=useState({
    Adminname: "",
    Adminemail: "",
  });

  useEffect(() => {
    const AdminfetchUserDetails = async () => {
      if (AdminisAunthenticated()) {
        try {
          const response = await Admingetuserdetails();
          setadmindetails({
            Adminname: response.data.users[0].displayName,
            Adminemail: response.data.users[0].email,
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    AdminfetchUserDetails();
  }, [setadmindetails]); // Added setUser as a dependency

  const togglePanel = () => {
    setIsProfilePanelVisible((prev) => !prev);
  };

  const handleSignin = () => {
    navigate("/donate/sign-in");
  };

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isProfilePanelVisible) {
        setIsProfilePanelVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isProfilePanelVisible]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsProfilePanelVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logoutUser = () => {
    Adminlogout();
    navigate("/donate/sign-in");
  };

  return (
    <div className="relative">
      {isProfilePanelVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40"
          onClick={togglePanel}
        ></div>
      )}
      {AdminisAunthenticated() ? (
        <>
          <RiAccountCircleFill
            className="h-10 w-10 cursor-pointer text-gray-800"
            onClick={togglePanel}
          />
          {/* Sliding Panel */}
          <div
            ref={panelRef}
            className={`${
              isProfilePanelVisible ? "translate-x-0" : "translate-x-full"
            } fixed top-0 right-0 w-2/4 sm:w-1/3 h-full bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50`}
          >
            <button
              className="absolute top-4 right-4 text-4xl text-gray-600 hover:text-gray-800  font-semibold "
              onClick={togglePanel}
            >
              <IoMdCloseCircle />
            </button>
            <div className="flex flex-col items-center gap-6 p-6">
              {/* User Information */}
              <h2 className="font-bold text-2xl">Account Details</h2>
              <div className="flex flex-col items-center text-center bg-gray-100 rounded w-full p-5 ">
                <div className="text-2xl font-semibold text-gray-800">
                  {admindetails?.Adminname}
                </div>
                <div className="text-lg text-gray-500">{admindetails?.Adminemail}</div>
              </div>

              {/* Links */}
              <ul className="flex flex-col gap-4 w-full text-lg text-gray-700">
                <Link to="/password-reset">
                  <li className="hover:text-blue-600 flex items-center gap-2">
                    <span>Change Password</span>
                  </li>
                </Link>
                <li
                  className="hover:text-red-600 flex items-center gap-2 cursor-pointer"
                  onClick={logoutUser}
                >
                  <IoLogOutOutline className="text-xl" />
                  <span>Log Out</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="flex gap-4">
          <button
            className="bg-black text-white text-sm w-20 md:text-lg px-3 py-2 rounded-md hover:bg-slate-800"
            onClick={handleSignin}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}
