import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  addinguserdetails,
  registerApi,
  sendOtpApi,

  verifiOtp,

} from "./services/API";
import { storeUserData, storeUserIdData } from "./services/storage";
import { isAunthenticated } from "./services/auth";

export default function UserSignup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendButton, setSendButton] = useState(true);
  const [otpVisible, setOtpVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitButton, setSubmitButton] = useState(false);
  const [verifyButton, setVerifyButton] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [resendOtp, setResendOtp] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
    const newErrors = {};

    if (username.trim() === "") {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      try {
        setLoading(true);
        setSendButton(false);
        await sendOtpApi(email);
        setOtpVisible(true);
        setSendButton(false);
        setResendOtp(false);
        setOtpTimer(60);
        setVerifyButton(true);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          custom_error: "Failed to send OTP. Please try again.",
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOtp = async () => {
    setVerifyButton(false);
    setLoading(true);
    if (otp.trim() === "") {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return;
    }
    try {
      await verifiOtp(email, otp);
      setLoading(false);
      setVerifyButton(false);
      setOtpVisible(false);
      setPasswordVisible(true);
      setSubmitButton(true);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        otp: "OTP verification failed. Please try again.",
      }));
      setVerifyButton(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendOtp(false)
      setLoading(true)
      await sendOtpApi(email);
      setOtp("");
      setOtpTimer(60);
      setResendOtp(false);
      setLoading(false)
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        custom_error: "Failed to resend OTP. Please try again.",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitButton(false);
    setLoading(true);

    // Validate password match
    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, password: "Passwords do not match" }));
      return;
    }

    try {
      // Register the user
      const response = await registerApi(username, email, password);
      storeUserData(response.data.idToken);  // Save the user's ID token

      // Add user details to your backend and send welcome email
      const userDetailsResponse = await addinguserdetails(username, email, phone);

      // Store the user ID for later use
      storeUserIdData(userDetailsResponse.data.user_id);

      // Redirect to home page
      navigate("/home");
    } catch (err) {
      const errorCode = err?.response?.data?.error?.message;
      let message = "Registration failed. Please try again.";
      if (errorCode === "EMAIL_EXISTS") {
        message = "Email already exists.";
      } else if (errorCode === "OPERATION_NOT_ALLOWED") {
        message = "Password sign-in is disabled.";
      } else if (errorCode === "TOO_MANY_ATTEMPTS_TRY_LATER") {
        message = "Too many attempts. Please try again later.";
      }
      setErrors((prev) => ({ ...prev, custom_error: message }));
      setSubmitButton(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (isAunthenticated()) {
    return <Navigate to={"/home"} />;
  }

  return (
    <div className="relative min-h-screen bg-myorange font-times flex items-center justify-center">
      <div className="flex items-center justify-center h-full px-6 py-8 overflow-auto">
        <div className="bg-white  w-[400px] max-w-md sm:w-[400px] md:w-[500px] h-full border rounded-xl p-6 sm:p-8 shadow-md sm:shadow-slate-500">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex flex-col items-center justify-center py-4 sm:py-6">
              <div className="relative w-fit">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-black bg-gradient-to-r  bg-clip-text  drop-shadow-md">
                  Register
                </h1>
                <div className="absolute inset-x-0 -bottom-2 sm:-bottom-3 h-1 sm:h-2 bg-gradient-to-r bg-black rounded-full"></div>
              </div>
            </div>

          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block mb-2 text-md font-semibold text-gray-600"
              >
                Username:
              </label>
              <input
                type="text"
                id="name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                placeholder="Your username"
              />
              {errors.username && (
                <p className="text-xs italic text-red-500 mt-2">
                  {errors.username}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-md font-semibold text-gray-600"
              >
                Email:
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                placeholder="Your email"
              />
              {errors.email && (
                <p className="text-xs italic text-red-500 mt-2">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block mb-2 text-md font-semibold text-gray-600"
              >
                Phone Number:
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                placeholder="Your phone number"
              />
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
                    placeholder="Enter OTP Sent To Mail"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  {errors.otp && (
                    <span className="text-red-500">{errors.otp}</span>
                  )}
                </div>
                <div className="flex items-center justify-between py-3">
                  {verifyButton && (
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
            {submitButton && (
              <div className="flex justify-end my-5">
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
                <div className="flex justify-center items-center text-x text-white px-6 py-2 rounded-md">
                  <svg
                    className="h-8 w-8 animate-spin stroke-black text-center"
                    viewBox="0 0 256 256"
                  >
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      strokeWidth="17"
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
                  to={"/"}
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
