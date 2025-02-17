import React from "react";
import { ThreeDot } from "react-loading-indicators";

const Loading = () => {
  return (
    <div className="flex flex-col gap-3 justify-center items-center h-screen">
      <ThreeDot variant="bounce" color="#000000" size="large" />
      <div className="text-xl md:text-3xl">Loading your Menu</div>
    </div>
  );
};
export default Loading;
