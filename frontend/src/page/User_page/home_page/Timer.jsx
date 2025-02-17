import React, { useContext } from "react";
import CountDownTimer from "./CountDownTimer";
import DataContextAdmin from "../../Context/DataContextAdmin";

const Timer = () => {
  const { openTime, closeTime, serverTime, loading, timeErr } =
    useContext(DataContextAdmin);

  if (loading) {
    return (
      <div className="text-xl font-semibold tracking-tight leading-6">
        <span className="flex items-center gap-1">
          Loading
          <svg
            className="h-5 animate-spin stroke-gray-500 text-center"
            viewBox="0 0 256 256"
          >
            <circle
              cx="128"
              cy="128"
              r="100"
              strokeWidth="17"
              stroke="black"
              fill="none"
              strokeDasharray="314"
              strokeDashoffset="0"
            ></circle>
          </svg>
        </span>
      </div>
    );
  }

  if (timeErr) {
    return (
      <div className="text-xl font-semibold tracking-tight leading-6">
        Network Error
      </div>
    );
  }

  if (serverTime && openTime && closeTime) {
    return (
      <div className="flex flex-col items-center justify-center">
        <CountDownTimer />
      </div>
    );
  }

  return null;
};

export default Timer;
