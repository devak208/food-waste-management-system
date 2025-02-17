import { getUserData, getUserIdData, removeUserData } from "./storage";

export const isAunthenticated = () => {
  return getUserData() != null && getUserIdData() != null;
};

export const logout = () => {
  removeUserData();
};
export const getOobCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("oobCode");
};
// const oobCode = getOobCodeFromUrl();
// console.log("OOB Code:", oobCode);
