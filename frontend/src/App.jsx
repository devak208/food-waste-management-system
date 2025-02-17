import { BrowserRouter, Route, Routes } from "react-router-dom";
import Usersignin from "./page/User_page/login_pages/UserSignIn";
import Userpassforget from "./page/User_page/login_pages/UserPassForget";
import Usersignup from "./page/User_page/login_pages/UserSignUp";
import Cartpage from "./page/User_page/cart_pages/UserCartPage";
import Landing from "./page/User_page/home_page/Landing";
import Adminhome from "./page/Admin_page/AdminPages/AdminHome";
import AdminDetails from "./page/Admin_page/AdminPages/AdminDetails";
import { DataProviderUser } from "./page/Context/DataContextUser";
import { DataProviderAdmin } from "./page/Context/DataContextAdmin";
import Adminsignin from "./page/Admin_page/AdminPages/LoginPage/AdminSignIn";
import Adminsignup from "./page/Admin_page/AdminPages/LoginPage/AdminSignUp";
import Adminpassforget from "./page/Admin_page/AdminPages/LoginPage/AdminPassForget";
import { Userpassreset } from "./page/User_page/login_pages/userpassreset";
import Missing from "./page/User_page/home_page/Missing";
import { Adminpassreset } from "./page/Admin_page/AdminPages/LoginPage/adminpassreset";
import History from "./page/User_page/home_page/History";
import UserDetailPage from "./page/Admin_page/components/userDetails";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        transition={Zoom}
        autoClose={1500}
        closeOnClick
        hideProgressBar={true}
        limit={1}
        newestOnTop={true}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable={true}
      />
      <Routes>
        <Route path="/" element={<Usersignin />} />
        <Route path="*" element={<Missing />} />
        <Route path="/password-reset" element={<Userpassforget />} />
        <Route path="/New-account" element={<Usersignup />} />
        <Route path="/reset-password" element={<Userpassreset />} />
        <Route
          path="/home"
          element={
            <DataProviderUser>
              <DataProviderAdmin>
                <Landing />
              </DataProviderAdmin>
            </DataProviderUser>
          }
        />
        <Route
          path="/home/cart-page"
          element={
            <DataProviderUser>
              <DataProviderAdmin>
                <Cartpage />
              </DataProviderAdmin>
            </DataProviderUser>
          }
        />
        <Route
          path="/home/History&Orders"
          element={
            <DataProviderUser>
              <DataProviderAdmin>
                <History />
              </DataProviderAdmin>
            </DataProviderUser>
          }
        />
        <Route path="/admin/sign-in" element={<Adminsignin />} />
        <Route path="/admin/sign-up" element={<Adminsignup />} />
        <Route path="/admin/password-reset" element={<Adminpassforget />} />
        <Route path="/admin/reset-password" element={<Adminpassreset />} />
        <Route
          path="/admin"
          element={
            <DataProviderUser>
              <DataProviderAdmin>
                <Adminhome />
              </DataProviderAdmin>
            </DataProviderUser>
          }
        />
        <Route
          path="/admin/order-details"
          element={
            <DataProviderUser>
              <DataProviderAdmin>
                <AdminDetails />
              </DataProviderAdmin>
            </DataProviderUser>
          }
        />
        <Route path="/user/:userId" element={<UserDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
