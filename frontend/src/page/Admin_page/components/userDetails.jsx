import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ThreeDot } from "react-loading-indicators";

const UserDetailPage = () => {
  const { userId } = useParams();
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/orders/user/${userId}`
        );

        // Sort orders by timing in descending order (most recent first)
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.timing) - new Date(a.timing)
        );

        setUserOrders(sortedOrders);
      } catch (err) {
        setError(err.response?.data?.error || "User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  if (loading)
    return (
      <div className="flex flex-col gap-3 justify-center items-center h-screen">
        <ThreeDot variant="bounce" color="#000000" size="large" />
        <div className="text-xl :text-3xl">Loading user details</div>
      </div>
    );
  if (error) return <p className="text-center text-lg text-red-600">{error}</p>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        User Details
      </h1>
      {userOrders.length > 0 ? (
        <div className="bg-white shadow-lg rounded-lg px-8 py-6">
          {/* Displaying shared user info from the first order */}
          <div className="text-center mb-6 bg-slate-300 rounded-md p-4 shadow-inner">
            <h2 className="text-2xl font-semibold text-gray-800">
              Name: {userOrders[0]?.username}
            </h2>
            <p className="text-gray-600">Email: {userOrders[0]?.email}</p>
            <p className="text-gray-600">
              Phone Number: {userOrders[0]?.phone_number || "N/A"}
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Order History
          </h3>
          <hr className="border-gray-300" />
          <ul>
            {userOrders.map((order) => (
              <li
                key={order.orderid}
                className="border-b-2 border-gray-200 py-5 bg-green-50 hover:bg-green-100 transition duration-200 ease-in-out"
              >
                <p className="text-lg font-semibold">
                  Order ID:{" "}
                  <span className="text-gray-700">{order.orderid}</span>
                </p>
                <p>
                  Total Price:{" "}
                  <span className="text-green-600 font-semibold">
                    {`€ ${order.totalPrice}`}
                  </span>
                </p>
                <p>
                  Timing:{" "}
                  <span className="text-gray-700">
                    {new Date(order.timing).toLocaleString()}
                  </span>
                </p>

                {/* Delivery Status Badge */}
                <p className="mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      order.deliveryStatus
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {order.deliveryStatus ? "Delivered" : "Pending"}
                  </span>
                </p>

                {/* Payment Status Badge */}
                <p className="mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      order.paymentStatus
                        ? "bg-blue-200 text-blue-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {order.paymentStatus ? "Paid" : "Pending"}
                  </span>
                </p>

                {/* Order items */}
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-700">
                    Items Ordered:
                  </h4>
                  <ul className="ml-5 list-disc">
                    {order.orders.map((item, index) => (
                      <li key={index} className="text-gray-600">
                        {item.name} - Quantity:{" "}
                        <span className="font-semibold">{item.quantity}</span>,
                        Price:{" "}
                        <span className="font-semibold">
                          {`€ ${item.quantity * item.price}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-red-500 text-lg">
          No orders found for this user.
        </p>
      )}
    </div>
  );
};

export default UserDetailPage;
