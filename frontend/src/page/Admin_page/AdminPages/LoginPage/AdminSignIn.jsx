import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  AdminisAunthenticated,
  AdminloginApi,
  AdminstoreuserData,
} from "./services/Adminstorage";

export default function Adminsignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(""); // Error for email
  const [passwordError, setPasswordError] = useState(""); // Error for password
  const [loading, setLoading] = useState(false);
  const [button, setButton] = useState(true);
  //const [errors, setErrors] = useState(""); // General errors

  // Email format validation function
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setEmailError(""); // Reset error when typing
    //setErrors(""); // Reset general errors
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setPasswordError(""); // Reset error when typing
    //setErrors(""); // Reset general errors
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");
    //setErrors("");

    // Check if email format is valid
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return; // Stop the form submission
    }

    // Disable button and show loading spinner
    setButton(false);
    setLoading(true);

    // Call login API
    AdminloginApi(email, password)
      .then((response) => {
        // Handle successful login
        AdminstoreuserData(response.data.idToken);
      })
      .catch((err) => {
        // Handle errors based on the response
        if (
          err?.response?.data?.error?.message === "INVALID_LOGIN_CREDENTIALS"
        ) {
          //setErrors("Login failed. Invalid Email or Password");
          // Display specific error messages for each field
          setEmailError("Please check your email.");
          setPasswordError("Please check your password.");
        } else {
          setPasswordError("Login failed. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false);
        setButton(true); // Re-enable the button
      });
  }

  if (AdminisAunthenticated()) {
    return <Navigate to={"/donate"} />;
  }

  return (
    <>
      <div className="relative h-screen bg-myorange font-times">
        {/* Icon and admin link */}

        {/* Centered form */}
        <div className="flex items-center justify-center h-full px-6">
          <div className="bg-white w-full max-w-md sm:w-[400px] md:w-[500px] h-auto border rounded-xl p-6 sm:p-8 shadow-md sm:shadow-slate-500">
            {/* Sign in heading */}

            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="flex items-center justify-center h-12 bg-black rounded-lg w-36 sm:w-48 sm:h-14">
                <h1 className="text-xl font-bold text-white sm:text-3xl">
                 Sign In
                </h1>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label className="block mb-1 text-base font-semibold text-gray-600 sm:mb-2 sm:text-lg">
                  Email
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm font-medium border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 sm:text-base"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                {emailError && <p className="text-red-600">{emailError}</p>}
              </div>

              {/* Password Input */}
              <div>
                <label className="block mb-1 text-base font-semibold text-gray-600 sm:mb-2 sm:text-lg">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 text-sm font-medium border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 sm:text-base"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                {passwordError && (
                  <p className="text-red-600">{passwordError}</p>
                )}
              </div>

              {/* Forget Password Link */}
              <div className="flex justify-end">
                <Link
                  to={"/donate/password-reset"}
                  className="text-sm text-customBlue sm:text-base"
                >
                  Forget Password?
                </Link>
              </div>

              {/* Submit Button */}
              {button && (
                <div className="flex justify-center mt-6 sm:mt-8">
                  <button
                    type="submit"
                    className="w-full h-12 max-w-md px-6 py-2 text-xl font-bold text-white rounded-lg sm:text-4xl sm:px-8 hover:bg-slate-800 bg-black sm:h-14"
                  >
                    Login
                  </button>
                </div>
              )}
              {/* Loading Spinner */}
              {loading && (
                <div className="flex justify-center">
                  <div className="flex justify-center items-center text-xl text-white px-6 py-2 rounded-md">
                    <svg
                      className="h-8 w-8 animate-spin stroke-gray-500 text-center"
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
                  </div>
                </div>
              )}

              {/* Create Account Link */}
              <div className="mt-4 text-center">
                <p className="text-sm sm:text-base">
                  Don't have an account?{" "}
                  <Link
                    to={"/donate/sign-up"}
                    className="text-white bg-black hover:bg-slate-800 p-2 rounded-md"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
