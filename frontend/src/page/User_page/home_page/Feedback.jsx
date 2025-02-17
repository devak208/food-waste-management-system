import React, { useState } from "react";
import FeedbackPopup from "./PopupComponents/feedbackPopup";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Feedback = () => {
  const [feedBack, setFeedBack] = useState("");
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [sendFeedback, setSendFeedback] = useState(false);

  const containsLetters = (str) => /[a-zA-Z]/.test(str);

  const handleBtnClick = (e) => {
    e.preventDefault();

    if (feedBack && containsLetters(feedBack)) {
      setConfirmPopup(true);
    } else {
      toast.warn("Please enter a valid feedback.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    setSendFeedback(true);
    try {
      const newFeedback = {
        message: feedBack,
      };

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/feedback`,
        newFeedback
      );

      // Show success toaster message
      toast.success("Feedback sent successfully!");
    } catch (error) {
      console.log(error.message);

      // Show error toaster message
      toast.error("Failed to send feedback. Please try again.");
    } finally {
      setConfirmPopup(false);
      setSendFeedback(false);
    }
  };

  return (
    <>
      <div className="lg:basis-1/2 w-full">
        <h1 className="flex justify-start items-center gap-2 text-5xl md:text-6xl font-semibold text-center lg:text-left">
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
          <Link to={"#SLCheader"}>SLC</Link>
        </h1>
        <form onSubmit={handleBtnClick}>
          <div className="px-4 py-6 mt-2 flex flex-col gap-5 bg-customLightGray1 border-0.5 border-customLightGray2 rounded-lg">
            <h1 className="text-white text-xl md:text-2xl font-medium">
              We'll need your valuable Feedback!
            </h1>
            <textarea
              className="border-0.5 border-black outline-none p-3 rounded-lg max-h-28 min-h-28"
              id="feedBack"
              cols="30"
              rows="4"
              onChange={(e) => setFeedBack(e.target.value.trim())} // Update feedback
              placeholder="Enter your thoughts...."
              required
            ></textarea>
          </div>
          <div className="flex justify-center lg:justify-end">
            <button type="submit" className="btn mt-3 lg:my-4">
              SEND
            </button>
          </div>
        </form>
      </div>

      {/* Popup Component */}

      <FeedbackPopup trigger={confirmPopup}>
        {!sendFeedback && (
          <div className="flex gap-3 flex-col px-2">
            <div className="text-base sm:text-xl">
              Are you sure to send this feedback?
            </div>

            <div className="flex flex-row justify-center items-center gap-4">
              <button
                className="text-base sm:text-xl w-32 h-9 sm:h-10 rounded-sm border border-customLightGray3 hover:border-black"
                onClick={() => setConfirmPopup(false)}
              >
                Cancel
              </button>
              <button
                onClick={(e) => handleSend(e)}
                className="text-base sm:text-xl bg-slate-700 text-white w-32 h-9 sm:h-10 rounded-sm hover:bg-slate-600"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* loading */}
        {sendFeedback && (
          <div className="flex gap-3 flex-col px-2">
            <div className="text-xl">Sending your feedback...</div>

            {/* loading animation*/}
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center text-xl text-white px-3 py-2 rounded-md">
                <svg
                  className="h-9 animate-spin stroke-slate-700 text-center"
                  viewBox="0 0 256 256"
                >
                  <circle
                    cx="128"
                    cy="128"
                    r="100"
                    strokeWidth="16"
                    stroke="#334155"
                    fill="none"
                    strokeDasharray="314"
                    strokeDashoffset="0"
                  ></circle>
                </svg>
              </div>
            </div>
          </div>
        )}
      </FeedbackPopup>
    </>
  );
};

export default Feedback;
