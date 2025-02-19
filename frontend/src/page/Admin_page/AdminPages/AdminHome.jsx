import { useContext, useEffect } from "react";
import AdminFooter from "../components/AdminFooter";
/* import AdminMenuBanner from "../components/AdminMenuBanner"; */
import AdminMenuGrid from "../components/AdminMenuGrid";
import AdminNavbar from "../components/AdminNavbar";
import AdminLoading from "../components/AdminLoading";
import DataContextUser from "../../Context/DataContextUser";
import { AdminisAunthenticated } from "./LoginPage/services/Adminstorage";
import { Navigate } from "react-router-dom";

export default function Adminhome() {
  useEffect(() => {
    document.title = "SLC donate";
    return () => {
      document.title = "SLC";
    };
  }, []);
  const { isLoading, err } = useContext(DataContextUser);
  if (!AdminisAunthenticated()) {
    return <Navigate to={"/"} />;
  } else {
    return (
      <>
        <div className="bg-white">
          <AdminNavbar />
          {!isLoading && err === null && (
            <div>
              {/* <AdminMenuBanner /> */}
              <AdminMenuGrid />
            </div>
          )}

          {isLoading && <AdminLoading />}

          {!isLoading && err !== null && (
            <div className="h-screen bg-customLightGray3 flex items-center justify-center">
              <div className="text-3xl md:text-5xl">
                <div className="flex text-center text-red-700 flex-col items-center justify-center gap-3 p-4 md:p-0">
                  <h1>{err}</h1>
                  <h1>Try reloading again</h1>
                </div>
              </div>
            </div>
          )}
          <AdminFooter />
        </div>
      </>
    );
  }
}
