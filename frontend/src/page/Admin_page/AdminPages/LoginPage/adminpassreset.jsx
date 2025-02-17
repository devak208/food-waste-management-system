
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AdminconfirmPasswordreset } from "./services/Adminstorage";

export function Adminpassreset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); // Initialize navigate
  const [resetbut, setResetbut] = useState(true);

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleConfirmPasswordChange(e) {
    setConfirmPassword(e.target.value);
  }

  async function handleResetClick() {
    if (password === confirmPassword) {
      setResetbut(false);
      setLoading(true); 
      setMessage(""); 
      try {
        await AdminconfirmPasswordreset(confirmPassword); 
        setMessage("Password reset successful!"); 
        console.log("Password reset");
        navigate("/"); // Navigate to home after successful reset
      } catch (error) {
        setMessage("Link expired!"); 
        console.error("Password reset failed", error);
      } finally {
        setLoading(false); 
        setResetbut(true);
      }
    } else {
      setMessage("Passwords do not match. Please try again."); 
    }
  }

  return (
    <div className="relative h-screen bg-myorange font-times">
      <div className="flex items-center justify-center h-full px-6">
        <div className="bg-white w-full max-w-md sm:w-[400px] md:w-[500px] h-auto border rounded-xl p-6 sm:p-8 shadow-md sm:shadow-slate-500">
          <form className="space-y-4 sm:space-y-6">
            {/* New Password Input */}
            <div>
              <label className="block mb-1 text-base font-semibold text-gray-600 sm:mb-2 sm:text-lg">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 text-sm font-medium border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 sm:text-base"
                placeholder="Enter New Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block mb-1 text-base font-semibold text-gray-600 sm:mb-2 sm:text-lg">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 text-sm font-medium border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 sm:text-base"
                placeholder="Confirm Your Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>

            {/* Display message to user */}
            {message && (
              <div className="text-red-500 mt-4">
                {message}
              </div>
            )}

            {/* Loading spinner and Reset Button */}
            {resetbut && (
            <div className="flex justify-end">
            <button
              type="button"
              onClick={handleResetClick}
              className="w-32 h-12 py-2 my-4 text-xl font-bold text-white rounded-lg sm:text-4xl hover:bg-slate-800 bg-black sm:h-14"i // Disable button when loading
            >
              Reset
            </button>

          </div>
            )}

            {loading && (
                    <div className="flex justify-center">
              <div className="flex justify-center items-center text-xl bg-black text-white px-6 py-2 rounded-md">
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
        </div>
      </div>
    </div>
  );
}
