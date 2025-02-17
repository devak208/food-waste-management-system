import React, { useContext, useState, useEffect, useCallback } from "react";
import DataContextAdmin from "../../Context/DataContextAdmin";

// calculate time left
const calculateTimeLeft = (endTime) => {
  const difference = +new Date(endTime) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const CountDownTimer = () => {
  const { openTime, closeTime, currentPhase, setCurrentPhase, formatTime } =
    useContext(DataContextAdmin);

  const [timeLeft, setTimeLeft] = useState({});

  // Update the timer
  const updateTimer = useCallback(() => {
    if (!openTime || !closeTime) return;

    const now = new Date();

    if (now < new Date(openTime)) {
      setCurrentPhase("opens");
      setTimeLeft(calculateTimeLeft(openTime));
    } else if (now < new Date(closeTime)) {
      setCurrentPhase("closes");
      setTimeLeft(calculateTimeLeft(closeTime));
    } else if (now > new Date(closeTime)) {
      setCurrentPhase("closed");
      setTimeLeft({});
    } else {
      setCurrentPhase("load");
    }
  }, [openTime, closeTime, setCurrentPhase]);

  useEffect(() => {
    if (!openTime || !closeTime) return;

    updateTimer(); // Immediate update
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [updateTimer, openTime, closeTime]);

  // Format the remaining time
  const formattedTime = useCallback(
    () =>
      `${formatTime(timeLeft.hours || 0)}:${formatTime(
        timeLeft.minutes || 0
      )}:${formatTime(timeLeft.seconds || 0)}`,
    [timeLeft, formatTime]
  );

  // Early return for loading state
  if (!openTime || !closeTime) {
    return null;
  }

  return (
    <div className="flex flex-col items-center -space-y-1.5">
      {currentPhase === "opens" ? (
        <p className="text-base md:text-xl tracking-tight">Opens in :</p>
      ) : currentPhase === "closes" ? (
        <p className="text-base md:text-xl tracking-tighter sm:tracking-tight">
          Closes in :
        </p>
      ) : null}

      {currentPhase === "closed" ? (
        <div className="text-lg w-fit md:w-fit md:text-xl font-semibold tracking-tighter md:leading-4">
          Menu Closed
        </div>
      ) : currentPhase === "load" ? (
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
      ) : (
        <div className="text-lg md:text-2xl font-semibold">
          {formattedTime()}
        </div>
      )}
    </div>
  );
};

export default CountDownTimer;
