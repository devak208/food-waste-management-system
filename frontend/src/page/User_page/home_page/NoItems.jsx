import React from "react";

const NoItems = () => {
  return (
    <div className="container flex rounded-md py-1 mt-1">
      <div className="flex w-full justify-center items-center rounded-md bg-customLightGray4 min-h-72 max-h-72 shadow-lg">
        <div className="text-4xl">No Items</div>
      </div>
    </div>
  );
};

export default NoItems;
