import axios from "axios";
export const AdminstoreuserData = (data) => {
  localStorage.setItem("AdminidToken", data);
};
export const AdmingetUserData = () => {
  return localStorage.getItem("AdminidToken");
};
export const Adminremoveuserdata = () => {
  localStorage.removeItem("AdminidToken");
};

export const AdminisAunthenticated = () => {
  return AdmingetUserData() != null;
};
export const Adminlogout = () => {
  Adminremoveuserdata();
};

export const getOobCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("oobCode");
};
// const oobCode = getOobCodeFromUrl();
// console.log("OOB Code:", oobCode);

axios.defaults.baseURL = "https://identitytoolkit.googleapis.com/v1";
const API_KEY = `${import.meta.env.VITE_API_ADMIN}`;
const registerURL = `/accounts:signUp?key=${API_KEY}`;
const loginURL = `/accounts:signInWithPassword?key=${API_KEY}`;
const adminsendOtpURL = `${import.meta.env.VITE_SERVER_URL}/otp/send-otp`; // Local API for sending OTP
const verifiOtpURL = `${import.meta.env.VITE_SERVER_URL}/otp/verify-otp`;
const Adminuserdetailsurl = `/accounts:lookup?key=${API_KEY}`;
const Adminuserpassresestmailurl = `/accounts:sendOobCode?key=${API_KEY}`;
const Adminuserpassreseturl = `/accounts:resetPassword?key=${API_KEY}`;

export const AdminregisterApi = (username, email, password) => {
  let data = { displayName: username, email: email, password: password };
  return axios.post(registerURL, data);
};

export const AdminloginApi = (email, password) => {
  let data = { email: email, password: password };
  return axios.post(loginURL, data);
};

// Function to send OTP
export const sendOtpApi = (email) => {
  let data = { email: email };
  return axios.post(adminsendOtpURL, data);
};

export const verifiOtp = (email, otp) => {
  let data = { email: email, otp: otp };
  return axios.post(verifiOtpURL, data);
};

export const Admingetuserdetails = () => {
  let data = { idToken: AdmingetUserData() };
  return axios.post(Adminuserdetailsurl, data);
};
export const Adminsendresetpassmail = (email) => {
  let data = { requestType: "PASSWORD_RESET", email: email };
  return axios.post(Adminuserpassresestmailurl, data);
};

export const AdminconfirmPasswordreset = (password) => {
  let data = { oobCode: getOobCodeFromUrl(), newPassword: password };
  return axios.post(Adminuserpassreseturl, data);
};
