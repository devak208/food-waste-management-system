import { useState } from "react";
import "../../../index.css";
import Popup from "../../Admin_page/components/PopupComponents/popup";
import { sendresetpassmail } from "./services/API";

export default function Userpassforget() {
  const [email, setEmail] = useState(""); // Email state
  const sendButton = true; // Initialize send button state to true
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [showPopup, setShowPopup] = useState(false); // State for showing Popup
  const [popupMessage, setPopupMessage] = useState(""); // State to control popup message
  const [loading, setLoading] = useState(false); // State for loading spinner

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setErrorMessage(""); // Reset error when user types again
  }

  function handleSendClick() {
    if (email.trim()) {
      console.log("Sending reset email to:", email);
      setLoading(true); // Start loading
      sendresetpassmail(email)
        .then((response) => {
          // Handle success response
          console.log("Reset email sent:", response);
          setErrorMessage(""); // Clear error message on success
          setPopupMessage("Check your mail to reset the password.");
          setShowPopup(true); // Show success popup
        })
        .catch((error) => {
          // Handle error response
          console.error("Error sending reset email:", error);
          if (error.response && error.response.status === 404) {
            setErrorMessage("Email not found. Please try again.");
          } else {
            setErrorMessage("Enter a valid email.");
          }
        })
        .finally(() => {
          setLoading(false); // Stop loading
        });
    } else {
      console.log("Please enter a valid email.");
      setErrorMessage("Please enter a valid email.");
    }
  }

  function closePopup() {
    setShowPopup(false); // Close the popup when the user dismisses it
  }

  return (
    <div className="relative h-screen bg-myorange font-times">
      <div className="flex items-center justify-center h-full px-6">
        <div className="bg-white w-full max-w-md sm:w-[400px] md:w-[500px] h-auto border rounded-xl p-6 sm:p-8 shadow-md sm:shadow-slate-500">
          <form className="space-y-2 sm:space-y-3">
            {" "}
            {/* Reduced space */}
            <div className="flex justify-left mb-4 sm:mb-6">
              <div className="flex items-center justify-left h-12 ">
                <h1 className="text-xl font-bold sm:text-3xl px-2">
                  Forgot Password
                </h1>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-base font-semibold text-gray-600 sm:mb-2 sm:text-lg">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 text-sm font-medium border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 sm:text-base"
                placeholder="Enter Your Email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            {/* Error message under input */}
            {errorMessage && (
              <div className="text text-red-500 mt-1">{errorMessage}</div>
            )}
            {sendButton && !loading && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSendClick}
                  className="w-28 h-10 my-2 text-sm font-bold text-white rounded-lg hover:bg-slate-800 bg-black sm:text-2xl sm:h-14 sm:w-36"
                >
                  Send Link
                </button>
              </div>
            )}
            {loading && (
              <div className="flex justify-center">
              <div className="flex justify-center items-center text-xl bg-customGray text-white px-6 py-2 rounded-md">
                <svg
                  className="h-8 w-8 animate-spin stroke-gray-500 text-center"
                  viewBox="0 0 256 256"
                >
                  <circle
                    cx="128"
                    cy="128"
                    r="100"
                    strokeWidth="16"
                    stroke="white"
                    fill="none"
                    strokeDasharray="314"
                    strokeDashoffset="0"
                  ></circle>
                </svg>
              </div>
              </div>
            )}
          </form>

          {/* Popup Component */}
          {showPopup && (
            <Popup trigger={showPopup} onClose={closePopup}>
              <div className="flex flex-col items-center">
                {/* Tick animation */}
                <svg
                  width="70" // Width of the SVG
                  height="70" // Height of the SVG
                  className="mb-2 w-16 h-16 sm:w-20 sm:h-20" // Smaller icon with reduced margin
                  style={{ maxWidth: "90%", maxHeight: "90%" }} // Limit size to prevent overlap
                >
                  <circle
                    fill="none"
                    stroke="#68E534"
                    strokeWidth="6" // Stroke width
                    cx="35"
                    cy="35"
                    r="28" // Radius
                    className="circle"
                    strokeLinecap="round"
                    transform="rotate(-90 35 35)" // Centered rotation
                  />
                  <polyline
                    fill="none"
                    stroke="#68E534"
                    strokeWidth="6" // Stroke width for the tick
                    points="20,35 30,45 50,25" // Points for the smaller tick
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="tick"
                  />
                </svg>

                {/* Popup message */}
                <h1 className="text-green-500 text-center text-lg sm:text-xl font-bold">
                  {popupMessage}
                </h1>
              </div>
            </Popup>
          )}
        </div>
      </div>
    </div>
  );
}
