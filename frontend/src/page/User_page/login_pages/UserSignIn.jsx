import { useState, useEffect } from "react";
import { RiAccountCircleFill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import { loginApi, userloginApi } from "./services/API";
import { storeUserData, storeUserIdData } from "./services/storage";
import { isAunthenticated } from "./services/auth";
import { toast } from "react-toastify";

export default function Usersignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(""); // Error for email
  const [passwordError, setPasswordError] = useState(""); // Error for password
  const [loading, setLoading] = useState(false);
  const [button, setButton] = useState(true);
  const [redirect, setRedirect] = useState(false); // New state for redirect

  // Email format validation function
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setEmailError(""); // Reset error when typing
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setPasswordError(""); // Reset error when typing
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    setButton(false);
    setLoading(true);

    try {
      const response = await loginApi(email, password);
      storeUserData(response.data.idToken);

      const userDetailsResponse = await userloginApi(email);
      storeUserIdData(userDetailsResponse.data.user_id);

      setRedirect(true);
    } catch (err) {
      const errorCode = err?.response?.data?.error?.message;

      if (errorCode === "EMAIL_NOT_FOUND") {
        setEmailError("No account found with this email.");
      } else if (errorCode === "INVALID_PASSWORD") {
        setPasswordError("Incorrect password. Please try again.");
      } else {
        setPasswordError("Login failed. Please check your email and password.");
      }
    } finally {
      setLoading(false);
      setButton(true);
    }
  };

  // Use useEffect to handle redirection logic
  useEffect(() => {
    if (isAunthenticated()) {
      setRedirect(true);
    }
  }, []);

  if (redirect) {
    return <Navigate to={"/home"} />;
  }

  return (
    <>
      <div className="relative h-screen bg-myorange font-times">
        {/* Icon and admin link */}
        <div className="fixed flex flex-col items-end space-y-2 top-4 right-4">
          <RiAccountCircleFill className="text-4xl sm:text-5xl" />
          <Link
            to={"/admin/sign-in"}
            className="text-sm font-bold underline text-customBlue underline-offset-1 sm:text-base"
          >
            Admin
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex items-center justify-center h-full px-6">
          <div className="bg-white w-full max-w-md sm:w-[400px] md:w-[500px] h-auto border rounded-xl p-6 sm:p-8 shadow-md sm:shadow-slate-500 opacity-90">
            {/* Sign in heading */}
            <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
  <div className="flex flex-col items-center justify-center h-auto px-4 py-6 text-black rounded-lg w-80 sm:w-96">
    <h1 className="text-2xl sm:text-4xl font-extrabold text-center  mb-2">
      Welcome Back
    </h1>
    <p className="text-center text-gray-700 text-sm sm:text-base">
      Please log in to continue
    </p>
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
                  to={"/password-reset"}
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
                  <div className="flex justify-center items-center text-xl text-white px-4 py-1 sm:py-2 rounded-md">
                    <svg
                      className="h-10 animate-spin stroke-black text-center"
                      viewBox="0 0 256 256"
                    >
                      <circle
                        cx="128"
                        cy="128"
                        r="100"
                        strokeWidth="18"
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
                <p className="text-sm sm:text-base text-customBlue">
                  Don't have an account?{" "}
                  <Link
                    to={"/New-account"}
                    className=" text-white bg-black hover:bg-slate-800 p-2 rounded-md"
                  >
                    Sign up
                  </Link>
                </p>
                <div className="py-8">
                  <Link
                    to={"/home"}
                    onClick={() => {
                      toast.info("Logged in as Guest");
                    }}
                    className="text-white bg-black hover:bg-slate-800 p-2 rounded-md"
                  >
                    Login as guest
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
