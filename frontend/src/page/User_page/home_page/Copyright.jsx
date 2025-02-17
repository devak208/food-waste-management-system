import React from "react";

const Copyright = () => {
  return (
    <div className="flex flex-row items-center gap-2 p-1 justify-center bg-gray-100">
      <h1 className="flex flex-row items-center gap-1 lg:text-xl font-medium">
        <span>
          <svg
            width="31"
            height="31"
            viewBox="0 0 31 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 27.6094C22.1878 27.6094 27.6094 22.1878 27.6094 15.5C27.6094 8.81218 22.1878 3.39062 15.5 3.39062C8.81218 3.39062 3.39062 8.81218 3.39062 15.5C3.39062 22.1878 8.81218 27.6094 15.5 27.6094Z"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.375 13.0781C19.375 13.0781 17.9219 11.1406 15.5 11.1406C13.0781 11.1406 11.1406 13.0781 11.1406 15.5C11.1406 17.9219 13.0781 19.8594 15.5 19.8594C17.9219 19.8594 19.375 17.9219 19.375 17.9219"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {new Date().getFullYear()}
      </h1>
      <span className="lg:text-xl font-medium border-r-3 border-r-black pr-2">
        SLC
      </span>
      <span className="lg:text-xl font-medium"> All rights reserved.</span>
    </div>
  );
};

export default Copyright;
