import { useEffect, useState } from "react";

import { Link, Navigate } from "react-router-dom";
import {
  AdminisAunthenticated,
  AdminregisterApi,
  AdminstoreuserData,
  sendOtpApi,
  verifiOtp,
} from "./services/Adminstorage";

export default function Adminsignup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [Otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendButton, setSendButton] = useState(true);
  const [otpVisible, setOtpVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitbut, setsubmitbut] = useState(false);
  const [verifybut, setverifybut] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [resendOtp, setResendOtp] = useState(false);
  const [errors, setErrors] = useState({
    username: null,
    email: null,
    otp: null,
    password: null,
    custom_error: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (otpVisible && otpTimer > 0) {
      const timer = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (otpTimer === 0) {
      setResendOtp(true);
    }
  }, [otpVisible, otpTimer]);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleNameEmail = async (event) => {
    event.preventDefault();
    let isValid = true;

    if (username.trim() === "") {
      setErrors((prev) => ({ ...prev, username: "Username is required" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, username: null }));
    }

    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, email: null }));
    }

    if (isValid) {
      try {
        setSendButton(false);
        setLoading(true);
        await sendOtpApi(email); // Send OTP to admin email

        setOtpVisible(true);
        setSendButton(false);
        setResendOtp(false);
        setOtpTimer(60);
        setLoading(false);

        setverifybut(true);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          custom_error: "Failed to send OTP. Please try again.",
        }));
      }
    }
  };

  const handleVerifyOtp = async () => {
    setverifybut(false);
    setLoading(true);
    if (Otp.trim() === "") {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return;
    }

    try {
      await verifiOtp(email, Otp); // Verify OTP with admin email

      setResendOtp(false);
      setverifybut(false);
      setOtpVisible(false);
      setLoading(false);
      setPasswordVisible(true);
      setsubmitbut(true);

      setErrors((prev) => ({ ...prev, otp: null }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        otp: "OTP verification failed. Please try again.",
      }));
      setverifybut(true);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await sendOtpApi(email); // Resend OTP to admin email
      setOtp(""); // Clear OTP input
      setOtpTimer(60); // Reset the OTP timer to 60 seconds
      setResendOtp(false); // Hide the resend button after OTP is resent
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        custom_error: "Failed to resend OTP. Please try again.",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, password: "Passwords do not match" }));
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, password: null }));

    try {
      setSendButton(false);
      setsubmitbut(false);
      setLoading(true);

      // Register the user with their email and provided credentials
      await AdminregisterApi(username, email, password).then((response) => {
        AdminstoreuserData(response.data.idToken);
      });
      return <Navigate to={"/donate"} />;
    } catch (err) {
      const errorCode = err?.response?.data?.error?.message;
      let message = "Registration failed. Please try again.";
      if (errorCode === "EMAIL_EXISTS") {
        message = "Registration failed. Email already exists.";
      } else if (errorCode === "OPERATION_NOT_ALLOWED") {
        message = "Registration failed. Password sign-in is disabled.";
      } else if (errorCode === "TOO_MANY_ATTEMPTS_TRY_LATER") {
        message = "Too many attempts. Please try again later.";
      }
      setsubmitbut(true);
      setErrors((prev) => ({ ...prev, custom_error: message }));
    } finally {
      setLoading(false);
      setSendButton(false);
    }
  };

  if (AdminisAunthenticated()) {
    return <Navigate to={"/donate"} />;
  }
  return (
    <div className="relative min-h-screen bg-myorange font-times flex items-center justify-center">
      <div className="flex items-center justify-center h-full px-6 py-8 overflow-auto">
        <div className="bg-white  w-[400px] max-w-md sm:w-[400px] md:w-[500px] h-full border rounded-xl p-6 sm:p-8 shadow-md sm:shadow-slate-500">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center h-12 bg-black rounded-lg w-36 sm:w-52 sm:h-14">
              <h1 className="text-xl font-bold text-center text-white sm:text-3xl">
              donate Sign Up
              </h1>
            </div>
          </div>
          <form
            className="flex flex-col justify-between h-full space-y-4 sm:space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block mb-1 text-base font-semibold text-gray-600 sm:mb-2 sm:text-lg">
                Username
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm font-medium border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 sm:text-base"
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {errors.username && (
                <span className="text-red-500">{errors.username}</span>
              )}
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
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && (
                <span className="text-red-500">{errors.email}</span>
              )}
            </div>
            {sendButton && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNameEmail}
                  className="w-24 font-bold text-white rounded-lg h-9 hover:bg-slate-800 bg-black  lg:text-xl"
                >
                  Next
                </button>
              </div>
            )}

            {otpVisible && (
              <div>
                <div>
                  <label className="block mb-1 text-base font-semibold text-gray-600 sm:mb-2 sm:text-lg">
                    OTP
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-sm font-medium border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 sm:text-base"
                    placeholder="Enter OTP Send to donate Mail"
                    value={Otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  {errors.otp && (
                    <span className="text-red-500">{errors.otp}</span>
                  )}
                </div>
                <div className="flex items-center justify-between py-3">
                  {verifybut && (
                    <div className="flex justify-between gap-7 sm:gap-32">
                      <p className="w-[180px]">
                        <b>Resend OTP in :</b>{" "}
                        <span className="text-customOrange">
                          {otpTimer} sec
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="w-20 font-bold text-white rounded-lg h-9 hover:bg-customGray bg-black lg:text-xl"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                </div>
                {resendOtp && (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="w-20 font-bold text-white rounded-lg h-9 hover:bg-customGray bg-black lg:text-xl"
                  >
                    Re-send
                  </button>
                )}
              </div>
            )}
            {passwordVisible && (
              <>
                <div>
                  <label className="block mb-1 text-base font-semibold text-gray-600 sm:mb-2 sm:text-lg">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 text-sm font-medium border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 sm:text-base"
                    placeholder="Create Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && (
                    <span className="text-red-500">{errors.password}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-base font-semibold text-gray-600 sm:mb-2 sm:text-lg">
                    Re-enter Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 text-sm font-medium border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 sm:text-base"
                    placeholder="Re-enter Your Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            {errors.custom_error && (
              <p className="text-red-500">{errors.custom_error}</p>
            )}
            {submitbut && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-20 font-bold text-white rounded-lg h-9 hover:bg-customGray bg-black lg:text-xl"
                >
                  Submit
                </button>
              </div>
            )}

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
            <div className="mt-4 text-center">
              <p className="text-sm sm:text-base">
                Already have account?{" "}
                <Link
                  to={"/donate/sign-in"}
                  className="text-white bg-black hover:bg-slate-800 p-2 rounded-md"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
