import React, { useContext } from "react";
import DataContextUser from "../../Context/DataContextUser";
import { ThreeDot } from "react-loading-indicators";

const Loading = () => {
  const { err } = useContext(DataContextUser);
  return (
    <>
      {err === null && (
        <div className="flex flex-col gap-3 justify-center items-center h-screen border-t-2 border-black">
          <ThreeDot variant="bounce" color="#000000" size="large" />
          <div className="text-xl md:text-3xl">Loading your Menu</div>
        </div>
      )}
      {err !== null && (
        <div className="h-screen bg-customLightGray3 border-t-2 border-black flex w-full justify-center items-center">
          <div className="text-4xl text-red-700 flex flex-col items-center">
            <div>{err}</div>
            <div>Try reloading again </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Loading;
