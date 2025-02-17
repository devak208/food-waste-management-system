import axios from "axios";
import { getUserData } from "./storage";
import { getOobCodeFromUrl } from "./auth";

axios.defaults.baseURL = "https://identitytoolkit.googleapis.com/v1";
const API_KEY = `${import.meta.env.VITE_API_USER}`;
const registerURL = `/accounts:signUp?key=${API_KEY}`;
const loginURL = `/accounts:signInWithPassword?key=${API_KEY}`;
const sendOtpURL = `${import.meta.env.VITE_SERVER_URL}/otp/send-otp`;
const verifiOtpURL = `${import.meta.env.VITE_SERVER_URL}/otp/verify-otp`;
const userdetailsurl = `/accounts:lookup?key=${API_KEY}`;
const userpassresestmailurl = `/accounts:sendOobCode?key=${API_KEY}`;
const userpassreseturl = `/accounts:resetPassword?key=${API_KEY}`;
const addusertoserver = `${import.meta.env.VITE_SERVER_URL}/users`;
const getuseriddetails = `${import.meta.env.VITE_SERVER_URL}/users/login`;
export const userregistermail = `${import.meta.env.VITE_SERVER_URL}/email/send-welcome-email`;

export const registerApi = (username, email, password) => {
  let data = { displayName: username, email: email, password: password };
  return axios.post(registerURL, data);
};

export const loginApi = (email, password) => {
  let data = { email: email, password: password };
  return axios.post(loginURL, data);
};

// Function to send OTP
export const sendOtpApi = (email) => {
  let data = { email: email };
  return axios.post(sendOtpURL, data);
};

export const verifiOtp = (email, otp) => {
  let data = { email: email, otp: otp };
  return axios.post(verifiOtpURL, data);
};

export const getuserdetails = () => {
  let data = { idToken: getUserData() };
  return axios.post(userdetailsurl, data);
};

export const sendresetpassmail = (email) => {
  let data = { requestType: "PASSWORD_RESET", email: email };
  return axios.post(userpassresestmailurl, data);
};

export const confirmPasswordreset = (password) => {
  let data = { oobCode: getOobCodeFromUrl(), newPassword: password };
  return axios.post(userpassreseturl, data);
};

// Function to add user details to the backend and send welcome email
export const addinguserdetails = async (username, email, phone) => {
  let data = { username, email, phone }; // Properly structuring data as an object with all fields
  console.log(data); // Verify the structure in the console

  try {
    // Add user details to the backend (your server database)
    const userDetailsResponse = await axios.post(addusertoserver, data, {
      headers: { "Content-Type": "application/json" },
    });

    // Send a welcome email after successfully adding the user to the database
    let emailData = { email: email, username: username };
    console.log("Sending welcome email:", emailData);

    await axios.post(userregistermail, emailData, {
    });

    return userDetailsResponse; // Return the user details response for further handling
  } catch (error) {
    console.error("Error adding user details or sending email:", error);
  }
};

export const userloginApi = (email) => {
  let data = { email };
  return axios.post(getuseriddetails, data);
};
