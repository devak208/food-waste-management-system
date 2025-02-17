import React, { useEffect } from "react";
import AdminDetailsNavbar from "../components/AdminDetailsNavbar";
import AdminTablePage from "../components/AdminTablePage";
import AdminFooter from "../components/AdminFooter";
import { AdminisAunthenticated } from "./LoginPage/services/Adminstorage";
import { Navigate } from "react-router-dom";
const AdminDetails = () => {
  useEffect(() => {
    document.title = "Order Details";
    return () => {
      document.title = "Admin Home";
    };
  }, []);
  if (!AdminisAunthenticated()) {
    return <Navigate to={"/"} />;
  } else {
    return (
      <div className="bg-white">
        <AdminDetailsNavbar />
        <AdminTablePage />
        <AdminFooter />
      </div>
    );
  }
};
export default AdminDetails;
