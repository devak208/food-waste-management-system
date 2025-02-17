import React, { useContext, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import Contact from "../../User_page/home_page/Contact";
import Copyright from "../../User_page/home_page/Copyright";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import DataContextAdmin from "../../Context/DataContextAdmin";

const AdminFooter = () => {
  const { fetchServerAndPhaseTime, serverTime } = useContext(DataContextAdmin);

  const [loading, setLoading] = useState(false);

  // Helper function to convert string to array buffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  // Function to handle the download
  const handleDownloadFeedback = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // Fetch server time
      fetchServerAndPhaseTime();

      // Fetch the feedback data from the API
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/feedback`
      );
      const feedbackData = response.data;

      // Check if the feedback data is empty
      if (feedbackData.length === 0) {
        toast.error("No feedback data available to download!");
        setLoading(false);
        return;
      }

      // Transform the data
      const formattedFeedback = feedbackData.map((item) => ({
        Feedback: item.comments,
        Timing: new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
          .format(new Date(item.timestamp))
          .replace(",", " at"),
      }));

      // Create a worksheet from the transformed feedback data
      const worksheet = XLSX.utils.json_to_sheet(formattedFeedback);

      // Auto-fit columns based on the longest cell content
      const columnWidths = Object.keys(formattedFeedback[0]).map((key) => {
        const maxLength = Math.max(
          key.length, // Header length
          ...formattedFeedback.map((item) =>
            item[key] ? item[key].toString().length : 0
          )
        );
        return { wch: maxLength + 2 }; // Add padding
      });
      worksheet["!cols"] = columnWidths;

      // Bold the header row
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = { r: range.s.r, c: col }; // First row, all columns
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = {
            font: { bold: true },
          };
        }
      }

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");

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
      link.download = `feedback-${serverTime}.xlsx`; // Set the download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Feedback downloaded successfully!");
    } catch (error) {
      console.error("Error downloading feedback data:", error);
      toast.error("Failed to download feedback. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer>
      <div
        id="footer"
        className="flex flex-col lg:flex-row justify-between p-5 md:p-10  min-h-72 bg-white border-2 border-black items-center"
      >
        <div>
          <div className="flex-col items-center lg:items-start flex gap-8 ">
            <h1 className="flex justify-start gap-2 items-center text-6xl font-bold lg:text-left text-center">
              <svg
                className="h-14 w-14"
                viewBox="0 0 47 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="23.5" cy="23.5" r="22.5" fill="#8F8F8F" />
                <circle cx="23.5" cy="23.5" r="17.5" fill="#5D5D5D" />
                <circle cx="23.5" cy="23.5" r="12.5" fill="#4D4D4D" />
                <g clipPath="url(#clip0_1255_3626)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23.5 12.1398C23.7699 12.1398 24.0288 12.247 24.2197 12.4379C24.4106 12.6288 24.5179 12.8877 24.5179 13.1576V14.5691C26.848 14.8202 29.0031 15.9237 30.5688 17.6676C32.1345 19.4114 33.0004 21.6725 33 24.0161C33 24.556 33.0001 25.091 33 25.5714C33 26.0518 33 26.0518 30.9643 26.0518H14.2292C13.6893 26.0518 14 26.25 14 25.5714C14 24.8928 14 24.556 14 24.0161C13.9999 21.6727 14.8659 19.412 16.4316 17.6684C17.9973 15.9249 20.1522 14.8215 22.4821 14.5704V13.159C22.482 13.0252 22.5082 12.8927 22.5592 12.7691C22.6103 12.6454 22.6852 12.533 22.7798 12.4384C22.8743 12.3437 22.9866 12.2686 23.1102 12.2174C23.2337 12.1661 23.3662 12.1398 23.5 12.1398ZM15.0586 27.9464C14.7886 27.9464 14.5297 28.0537 14.3388 28.2445C14.1479 28.4354 14.0407 28.6943 14.0407 28.9643C14.0407 29.2342 14.1479 29.4931 14.3388 29.684C14.5297 29.8749 14.7886 29.9821 15.0586 29.9821H31.9414C32.2114 29.9821 32.4703 29.8749 32.6612 29.684C32.852 29.4931 32.9593 29.2342 32.9593 28.9643C32.9593 28.6943 32.852 28.4354 32.6612 28.2445C32.4703 28.0537 32.2114 27.9464 31.9414 27.9464H15.0586Z"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M15.3571 24.8929C15.3571 20.1429 17.3928 17.4286 21.4643 16.0714"
                    stroke="#444444"
                  />
                  <path d="M36.925 24.8929H25.05" stroke="#444444" />
                  <path
                    d="M26.2143 21.5V25.5714"
                    stroke="#F2F2F2"
                    strokeWidth="0.5"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1255_3626">
                    <rect
                      width="19"
                      height="19"
                      fill="white"
                      transform="translate(14 12)"
                    />
                  </clipPath>
                </defs>
              </svg>
              SLC
            </h1>

            <button
              className={`btn ${
                loading ? "w-28" : "w-fit"
              } space-x-2 my-0 p-0 px-2 h-10`}
              onClick={handleDownloadFeedback}
              disabled={loading}
            >
              <span className="tracking-tight text-sm">
                {loading ? "LOADING" : "FEEDBACK"}
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
          </div>
        </div>
        <Contact />
      </div>
      <Copyright />
    </footer>
  );
};

export default AdminFooter;
