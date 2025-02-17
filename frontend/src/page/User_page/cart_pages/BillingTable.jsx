import React, { useState, useContext } from "react";
import { MdEuro } from "react-icons/md";
import Popup from "../../Admin_page/components/PopupComponents/popup";
import DataContextUser from "../../Context/DataContextUser";
import { isAunthenticated } from "../login_pages/services/auth";
import { Link } from "react-router-dom";
import DataContextAdmin from "../../Context/DataContextAdmin";

const Guestdetails = ({ showGuestDetails, onClose }) => (
  <Popup trigger={showGuestDetails} onClose={onClose}>
    <div className="flex flex-col gap-5 px-4 py-8">
      <div className="text-slate-600 text-sm text-center">
        To proceed with your order
        <p>You Need To</p>
      </div>
      <div className="flex gap-4 justify-center items-center">
        <Link to={"/"}>
          <div className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-md">
            Sign In
          </div>
        </Link>
        <Link to={"/New-account"}>
          <div className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-md">
            Sign Up
          </div>
        </Link>
      </div>
    </div>
  </Popup>
);

const ConfirmPopup = ({
  confirmOrder,
  onClose,
  onConfirm,
  loading,
  confirmbut,
  cancel,
  orderComplete,
  totalPrice,
  onBillPaid,
}) => (
  <Popup trigger={confirmOrder} onClose={onClose}>
    <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto w-full bg-white rounded-lg shadow-lg">
      {!orderComplete ? (
        <>
          <div className="text-center text-slate-600 text-sm leading-6">
            <p>
              After placing the order, please proceed to payment via the Tiki
              Pay link below.
            </p>
            <p className="mt-2 font-semibold text-red-500">
              Note: If you do not pay, an additional fine of €2 will be charged.
            </p>
            <p>
              Upload a screenshot of the payment as proof to avoid penalties.
            </p>
            <p className="mt-4 font-bold">
              Are you sure to proceed with your order?
            </p>
          </div>
          <div className="flex justify-evenly items-center gap-4">
            {!loading && cancel && (
              <div
                className="bg-red-600 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-red-700 transition-colors"
                onClick={onClose}
              >
                Cancel
              </div>
            )}
            {!loading && confirmbut && (
              <div
                className="bg-blue-900 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-blue-800 transition-colors"
                onClick={onConfirm}
              >
                Confirm Order
              </div>
            )}
            {loading && (
              <div className="flex justify-center items-center text-xl bg-blue-900 text-white px-6 py-2 rounded-md">
                <svg
                  className="h-8 w-8 animate-spin stroke-gray-500 text-center"
                  viewBox="0 0 256 256"
                >
                  <circle
                    cx="128"
                    cy="128"
                    r="100"
                    strokeWidth="16"
                    stroke="white"
                    fill="none"
                    strokeDasharray="314"
                    strokeDashoffset="0"
                  ></circle>
                </svg>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="text-center text-slate-600 text-sm leading-6">
            <p>Your order has been placed successfully!</p>
            <p className="mt-2">
              Please proceed to payment via the Tiki Pay link below.
            </p>
            <p className="mt-2 font-semibold text-red-500">
              Note: If you do not pay, an additional fine of €2 will be charged.
            </p>
            <p>
              Upload a screenshot of the payment as proof to avoid penalties.
            </p>
            <div className="flex items-center justify-center mt-4">
              <MdEuro className="mr-1" />
              <span className="text-lg font-semibold">
                {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <a
              href="https://www.tiki-pay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-2 rounded-md w-full text-center hover:bg-green-700 transition-colors"
            >
              Pay Bill via Tiki Pay
            </a>
            <button className="bg-gray-600 text-white px-6 py-2 rounded-md w-full text-center hover:bg-gray-700 transition-colors">
              Upload Payment Screenshot
            </button>
            <div
              className="bg-blue-600 text-white px-6 py-2 rounded-md w-full text-center cursor-pointer hover:bg-blue-800 transition-colors"
              onClick={onBillPaid}
            >
              Yes, I Paid the Bill
            </div>
          </div>
        </>
      )}
    </div>
  </Popup>
);

const BillingTable = () => {
  const {
    cartItems,
    totalPrice,
    order,
    setLoading,
    loading,
    setConfirmbut,
    confirmbut,
    confirmorder,
    setconfirmorder,
    setcancel,
    incToServer,
    decToServer,
    removeItemFromServer,
  } = useContext(DataContextUser);
  const { currentPhase } = useContext(DataContextAdmin);
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleOrder = () => {
    if (isAunthenticated()) {
      setconfirmorder(true);
      setConfirmbut(true);
    } else {
      setShowGuestDetails(true);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setcancel(false);
      setConfirmbut(false);

      // Attempt to place the order
      const result = await order(); // Call the order function from context

      if (result.success) {
        setOrderComplete(true); // Mark the order as complete
      } else {
        // Handle failure if the result doesn't indicate success
        throw new Error("Failed to place the order.");
      }
    } catch (error) {
      console.error("Error in processing the order:", error.message);
      setconfirmorder(false); // Close the popup if the order fails
    } finally {
      setLoading(false);
    }
  };

  const hasInvalidItems = (cartItems) => {
    return cartItems.some((item) => item.quantity === 0 || item.serving === 0);
  };

  return (
    <>
      {!incToServer && !decToServer && !removeItemFromServer ? (
        <div className="flex flex-col items-center px-4">
          <div className="w-full max-w-4xl bg-white rounded-md shadow-md">
            <div className="text-2xl font-bold text-center py-4">BILLING</div>
            <div className="w-full border-y border-dashed border-gray-600"></div>
            <div className="w-full overflow-hidden">
              <table className="w-full table-auto text-sm sm:text-base">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-2 text-center text-sm">S.No</th>
                    <th className="py-2 px-2 text-center text-sm">Name</th>
                    <th className="py-2 px-2 text-center text-sm">Quantity</th>
                    <th className="py-2 px-2 text-center text-sm">
                      Price (<MdEuro className="inline-block align-middle" />)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cartItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={
                        item.serving === 0 ? "bg-red-100 text-red-600" : ""
                      }
                    >
                      <td className="py-2 px-2 text-center">{index + 1}</td>
                      <td className="py-2 px-2 text-center">{item.name}</td>
                      <td className="py-2 px-2 text-center">{item.serving}</td>
                      <td className="py-2 px-6 sm:px-2 text-center">
                        {item.serving * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-gray-100">
                  <tr>
                    <td
                      colSpan="3"
                      className="py-4 px-2 text-left font-semibold text-lg"
                    >
                      TOTAL PRICE
                    </td>
                    <td className="py-4 px-6 sm:px-2 text-center font-semibold text-lg flex items-center justify-center">
                      <MdEuro className="mr-1" />
                      {totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex-col pt-2 pb-4">
              {hasInvalidItems(cartItems) && (
                <div className="text-center text-red-600 text-sm mt-2">
                  Some items in your cart are no longer available or have a
                  quantity of 0. Please check your cart.
                </div>
              )}
              <div className="flex justify-center py-4">
                {currentPhase === "closes" ? (
                  <button
                    onClick={handleOrder}
                    disabled={hasInvalidItems(cartItems)}
                    className={`px-4 sm:px-8 max-w-md py-2 text-lg font-bold text-white rounded-lg transition-all ${
                      hasInvalidItems(cartItems)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                    }`}
                  >
                    PLACE ORDER
                  </button>
                ) : (
                  <button
                    disabled
                    className={`px-4 sm:px-8 max-w-md py-2 text-lg font-bold text-white rounded-lg transition-all bg-gray-400 cursor-not-allowed`}
                  >
                    MENU CLOSED
                  </button>
                )}
              </div>
            </div>
          </div>
          <Guestdetails
            showGuestDetails={showGuestDetails}
            onClose={() => setShowGuestDetails(false)}
          />
          <ConfirmPopup
            confirmOrder={confirmorder}
            onClose={() => setconfirmorder(false)}
            onConfirm={handleConfirm}
            loading={loading}
            confirmbut={confirmbut}
            cancel={true}
            orderComplete={orderComplete}
            totalPrice={totalPrice}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center px-4 opacity-50">
          <div className="w-full max-w-4xl bg-white rounded-md shadow-md">
            <div className="text-2xl font-bold text-center py-4">BILLING</div>
            <div className="w-full border-y border-dashed border-gray-600"></div>
            <div className="w-full overflow-hidden">
              <table className="w-full table-auto text-sm sm:text-base">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-2 text-center text-sm">S.No</th>
                    <th className="py-2 px-2 text-center text-sm">Name</th>
                    <th className="py-2 px-2 text-center text-sm">Quantity</th>
                    <th className="py-2 px-2 text-center text-sm">
                      Price (<MdEuro className="inline-block align-middle" />)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cartItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={
                        item.serving === 0 ? "bg-red-100 text-red-600" : ""
                      }
                    >
                      <td className="py-2 px-2 text-center">{index + 1}</td>
                      <td className="py-2 px-2 text-center">{item.name}</td>
                      <td className="py-2 px-2 text-center">{item.serving}</td>
                      <td className="py-2 px-6 sm:px-2 text-center">
                        {item.serving * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-gray-100">
                  <tr>
                    <td
                      colSpan="3"
                      className="py-4 px-2 text-left font-semibold text-lg"
                    >
                      TOTAL PRICE
                    </td>
                    <td className="py-4 px-6 sm:px-2 text-center font-semibold text-lg flex items-center justify-center">
                      <MdEuro className="mr-1" />
                      {totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex-col pt-2 pb-4">
              {hasInvalidItems(cartItems) && (
                <div className="text-center text-red-600 text-sm mt-2">
                  Some items in your cart are no longer available or have a
                  quantity of 0. Please check your cart.
                </div>
              )}
              <div className="flex justify-center py-4">
                {currentPhase === "closes" ? (
                  <div
                    disabled={hasInvalidItems(cartItems)}
                    className={`px-4 sm:px-8 max-w-md py-2 text-lg font-bold text-white rounded-lg transition-all ${
                      hasInvalidItems(cartItems)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black"
                    }`}
                  >
                    PLACE ORDER
                  </div>
                ) : (
                  <button
                    disabled
                    className={`px-4 sm:px-8 max-w-md py-2 text-lg font-bold text-white rounded-lg transition-all bg-gray-400 cursor-not-allowed`}
                  >
                    MENU CLOSED
                  </button>
                )}
              </div>
            </div>
          </div>
          <Guestdetails
            showGuestDetails={showGuestDetails}
            onClose={() => setShowGuestDetails(false)}
          />
          <ConfirmPopup
            confirmOrder={confirmorder}
            onClose={() => setconfirmorder(false)}
            onConfirm={handleConfirm}
            loading={loading}
            confirmbut={confirmbut}
            cancel={true}
            orderComplete={orderComplete}
            totalPrice={totalPrice}
          />
        </div>
      )}
    </>
  );
};

export default BillingTable;
