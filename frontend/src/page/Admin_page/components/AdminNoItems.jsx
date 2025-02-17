import React, { useContext } from "react";
import { IoIosAddCircle } from "react-icons/io";
import DataContextAdmin from "../../Context/DataContextAdmin";

const AdminNoItems = () => {
  const { setProductAddPopupVisible } = useContext(DataContextAdmin);
  return (
    <div className="pb-20">
      <div className="container grid gap-10 md:gap-5 rounded-md bg-customLightGray4 p-3 grid-cols-1 md:grid-cols-2 ">
        <div className="bg-white rounded-md p-2 basis-full hover:shadow-lg border-0.5 border-customLightGray4">
          <div className="h-full flex justify-center items-center">
            <div
              onClick={() => {
                setProductAddPopupVisible(true);
              }}
              className="flex-col justify-center items-center hover:cursor-pointer"
            >
              <IoIosAddCircle className="text-8xl text-customGreen2 " />
              <p className="text-lg font-bold">ADD FOOD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNoItems;
