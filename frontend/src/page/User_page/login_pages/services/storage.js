export const storeUserData = (data) => {
    localStorage.setItem("useridToken", data);
  };
  
  export const getUserData = () => {
    return localStorage.getItem("useridToken");
  };
  
  export const removeUserData = () => {
    localStorage.removeItem("useridToken");
  };
  
  export const storeUserIdData = (data) => {
    localStorage.setItem("user_id", data);
  };
  
  export const getUserIdData = () => {
    return localStorage.getItem("user_id");
  };
  
  export const removeUserIdData = () => {
    localStorage.removeItem("user_id");
  };
  