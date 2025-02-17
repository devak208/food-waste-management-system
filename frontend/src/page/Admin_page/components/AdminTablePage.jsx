import React, { useContext, useState } from "react";
import { IoMdDownload, IoMdSync } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import DataContextAdmin from "../../Context/DataContextAdmin";
import { useNavigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import axios from "axios";
import { AdmingetUserData } from "../AdminPages/LoginPage/services/Adminstorage";

const AdminTablePage = () => {
  const {
    updateLoad,
    handleUpdateClick,
    setSearchVal,
    isTableLoading,
    isErr,
    searchDetails,
    details,
    handlePaymentCheckboxChange,
    handleDeliveryCheckboxChange,
    checkedPayment,
    checkedDelivery,
  } = useContext(DataContextAdmin);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Helper function to convert string to array buffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  // Function to download total history(0) and current phase(1)
  const handleDownload = async (val) => {
    const excelDownloads = async (values, excelType) => {
      try {
        if (values.length === 0) {
          toast.error("No order history available to download!");
          setLoading(false);
          return;
        }

        // Transform the data
        const formattedDetails = values.map((item) => {
          const formattedOrders = item.orders
            .map(
              (order) =>
                `${order.name} (x${order.quantity}, € ${(
                  order.quantity * order.price
                ).toFixed(2)})`
            )
            .join("; ");

          return {
            "Order ID": item.orderid,
            Name: item.username,
            Email: item.email,
            Timing: new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
              .format(new Date(item.timing))
              .replace(",", " at"),
            "Orders Details": formattedOrders,
            "Total Price": `€ ${parseFloat(item.totalPrice).toFixed(2)}`,
            "Delivery Status": item.deliveryStatus
              ? "Delivered"
              : "Not Delivered",
            "Payment Status": item.paymentStatus ? "Paid" : "Pending",
          };
        });

        // Create a worksheet from the data
        const worksheet = XLSX.utils.json_to_sheet(formattedDetails);

        // Bold the header row
        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell_address = { r: range.s.r, c: col }; // First row, all columns
          const cell_ref = XLSX.utils.encode_cell(cell_address);
          if (!worksheet[cell_ref]) continue;
          worksheet[cell_ref].s = {
            font: {
              bold: true,
            },
          };
        }

        // Auto-fit columns based on the longest cell content in each column
        const columnWidths = {};
        for (let row = range.s.r; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cell_address = { r: row, c: col };
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            if (!worksheet[cell_ref]) continue;

            // Get the cell's string value and calculate the width
            const cellValue = worksheet[cell_ref].v;
            const cellLength = cellValue ? cellValue.toString().length : 0;

            // Update the column width if this value is longer than the current max
            if (
              columnWidths[col] === undefined ||
              cellLength > columnWidths[col]
            ) {
              columnWidths[col] = cellLength;
            }
          }
        }

        // Apply the calculated widths to the columns
        worksheet["!cols"] = Object.keys(columnWidths).map((colIndex) => ({
          wch: columnWidths[colIndex] + 2, // Add some extra padding to the column width
        }));

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, excelType);

        // Convert the workbook to a binary Excel file
        const excelFile = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "binary",
        });

        // Convert binary string to a Blob for download
        const blob = new Blob([s2ab(excelFile)], {
          type: "application/octet-stream",
        });

        // Create a link element to download the file
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${excelType}.xlsx`; // Set the download filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`${excelType} is ready to be downloaded!`);
      } catch (error) {
        console.error(`Error downloading ${excelType} :`, error);
        toast.error(`Failed to download ${excelType}. Please try again later!`);
      } finally {
        setLoading(false);
      }
    };

    if (loading) return;
    setLoading(true);

    if (val === 0) {
      try {
        const allResponse = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/orders/all?idToken=${AdmingetUserData()}`
        );
        excelDownloads(allResponse.data, "Total-History");
      } catch (error) {
        console.log(error.message);
      }
    } else {
      excelDownloads(details, "Current-Phase");
    }
  };

  return (
    <>
      {/* PC view */}
      <div className="hidden xl:flex flex-col-reverse justify-end container my-10">
        <div className="flex flex-col rounded-md shadow-lg">
          {/* Search Bar section */}
          <div className="flex bg-customLightGray3 gap-10 items-center h-20 w-full rounded-t-md px-3">
            <form className="flex items-center basis-1/2 p-2 rounded-full border bg-white">
              <label htmlFor="searchBar">
                <IoSearchSharp className="ml-2 h-6 w-6 text-black" />
              </label>
              <input
                className="pl-4 w-full text-xl outline-none"
                type="text"
                username="searchBar"
                onChange={(e) => setSearchVal(e.target.value.toLowerCase())}
                orderid="searchBar"
                placeholder="Search by Order ID / Name"
              />
            </form>
            {/* Buttons section */}
            <div className="flex items-center basis-1/2 justify-end gap-5">
              <button
                onClick={() => handleDownload(0)}
                className="btn space-x-2 my-0 p-0 px-2 h-10"
              >
                <span className="tracking-tight text-sm">
                  {loading ? "LOADING" : "TOTAL HISTORY"}
                </span>{" "}
                {loading ? (
                  <svg
                    className="h-5 animate-spin stroke-gray-500 text-center"
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
                ) : (
                  <IoMdDownload className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => handleDownload(1)}
                className="btn space-x-2 my-0 p-0 px-2 h-10"
              >
                <span className="tracking-tight text-sm">CURRENT PHASE</span>

                <IoMdDownload className="h-5 w-5" />
              </button>
              <button
                className="btn space-x-2 my-0 p-0 px-2 h-10"
                onClick={() => handleUpdateClick()}
              >
                {!updateLoad ? (
                  <>
                    <span className="tracking-tight text-sm">UPDATE</span>{" "}
                    <TiTick className="h-6 w-6" />
                  </>
                ) : (
                  <>
                    <span className="tracking-tight text-sm">UPDATING</span>
                    <svg
                      className="h-5 animate-spin stroke-gray-500 text-center"
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
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Table section */}
          <div className="p-3 bg-customLightGray4 rounded-b-md border-x border-b border-customLightGray3 min-h-[31.25rem] max-h-fit">
            <div className="relative max-h-[500px] custom-scroll">
              <table className="w-full border-separate border-spacing-y-5">
                <thead className="sticky top-0 z-10 h-14 bg-customLightGray4">
                  <tr className="text-2xl text-left text-customGray tracking-tighter">
                    <th className="border-b border-black">ORDER ID</th>
                    <th className="border-b border-black">NAME</th>
                    <th className="border-b border-black">TIMING</th>
                    <th className="border-b border-black">ORDERS</th>
                    <th className="border-b border-black">QUANTITY</th>
                    <th className="border-b border-black">PRICE</th>
                    <th className="border-b border-black">TOTAL PRICE</th>
                    <th className="border-b border-black">DELIVERED</th>
                    <th className="border-b border-black">PAYMENT</th>
                  </tr>
                </thead>

                <tbody className="text-left text-xl">
                  {isTableLoading ? (
                    // Loading State
                    <tr>
                      <td colSpan={9} className="text-center">
                        <div className="flex flex-col gap-3 justify-center items-center min-h-80">
                          <ThreeDot
                            variant="bounce"
                            color="#000000"
                            size="large"
                          />
                          <div className="text-xl">Loading your history</div>
                        </div>
                      </td>
                    </tr>
                  ) : isErr !== null ? (
                    // Error State
                    <tr>
                      <td
                        colSpan={9}
                        className="text-5xl text-red-600 text-center h-64"
                      >
                        <div className="flex flex-col gap-10">
                          <h1>Server is busy</h1>
                        </div>
                      </td>
                    </tr>
                  ) : Array.isArray(searchDetails) &&
                    searchDetails.length > 0 ? (
                    // Data Display
                    searchDetails.map((item, index) => (
                      <tr className="bg-gray-50" key={index}>
                        <td className="pl-2">
                          {item.orderid.length <= 10
                            ? item.orderid
                            : `${item.orderid}`}
                        </td>
                        <td>
                          <h1
                            className="text-2xl font-semibold text-blue-600 underline cursor-pointer"
                            onClick={() => navigate(`/user/${item.user_id}`)}
                          >
                            {item.username.length <= 11
                              ? item.username
                              : `${item.username.slice(0, 11)}...`}
                          </h1>
                        </td>
                        <td>
                          {new Intl.DateTimeFormat("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                            .format(new Date(item.timing))
                            .replace(",", " at")}
                        </td>
                        <td>
                          <ul className="space-y-2">
                            {(item.orders || []).map((food, idx) => (
                              <li key={idx}>{food.name}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="text-center space-y-2">
                          {(item.orders || []).map((food, idx) => (
                            <div key={idx}>{food.quantity}</div>
                          ))}
                        </td>
                        <td className="space-y-2">
                          {(item.orders || []).map((food, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-left gap-0.5"
                            >
                              <FaRupeeSign  className="text-gray-700" />
                              <div>{food.quantity * food.price}</div>
                            </div>
                          ))}
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-0.5">
                            <FaRupeeSign  className="text-gray-700" />
                            {item.totalPrice}
                          </div>
                        </td>
                        <td>
                          <form onSubmit={(e) => e.preventDefault()}>
                            <div className="flex items-center justify-center gap-0.5">
                              <input
                                checked={
                                  item.deliveryStatus ||
                                  checkedDelivery.includes(item.orderid)
                                }
                                onChange={() =>
                                  handleDeliveryCheckboxChange(item.orderid)
                                }
                                disabled={item.deliveryStatus}
                                className={`h-7 w-7 ${
                                  item.deliveryStatus ||
                                  checkedDelivery.includes(item.orderid)
                                    ? "bg-blue-500"
                                    : "bg-white"
                                } ${
                                  item.deliveryStatus
                                    ? "cursor-not-allowed border-gray-500"
                                    : "cursor-pointer border-blue-500"
                                } border-2`}
                                type="checkbox"
                                orderid={`deliveryStatus-${item.orderid}`}
                              />
                            </div>
                          </form>
                        </td>
                        <td>
                          <form onSubmit={(e) => e.preventDefault()}>
                            <div className="flex items-center justify-center gap-0.5">
                              <input
                                checked={
                                  item.paymentStatus ||
                                  checkedPayment.includes(item.orderid)
                                }
                                onChange={() =>
                                  handlePaymentCheckboxChange(item.orderid)
                                }
                                disabled={item.paymentStatus}
                                className={`h-7 w-7 ${
                                  item.paymentStatus ||
                                  checkedPayment.includes(item.orderid)
                                    ? "bg-blue-500"
                                    : "bg-white"
                                } ${
                                  item.paymentStatus
                                    ? "cursor-not-allowed border-gray-500"
                                    : "cursor-pointer border-blue-500"
                                } border-2`}
                                type="checkbox"
                                orderid={`paymentStatus-${item.orderid}`}
                              />
                            </div>
                          </form>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // No Details State
                    <tr>
                      <td colSpan={9} className="text-3xl text-center h-96">
                        No Details
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block xl:hidden px-5 py-16">
        <div className="h-96 flex flex-col bg-customLightGray3 border-black border-0.5 rounded-md pt-2">
          <div className="flex flex-row items-center justify-center gap-5">
            <button
              onClick={() => handleDownload(0)}
              className="btn space-x-2 my-0 p-0 px-1 h-9"
              disabled={loading}
            >
              <span className="tracking-tight text-xs">
                {loading ? "LOADING" : "TOTAL HISTORY"}
              </span>{" "}
              {loading ? (
                <IoMdSync className="h-5 animate-spin" />
              ) : (
                <IoMdDownload className="h-5" />
              )}
            </button>
            <button
              onClick={() => handleDownload(1)}
              className="btn space-x-2 my-0 p-0 px-1 h-9"
            >
              <span className="tracking-tight text-xs">CURRENT PHASE</span>
              <IoMdDownload className="h-5" />
            </button>
          </div>
          <div className="flex items-center justify-center p-5">
            <div className="text-center font-bold text-xl">
              Open on Desktop for a better view of the order details.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTablePage;
