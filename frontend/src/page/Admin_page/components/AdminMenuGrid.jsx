import React, { useContext, useState } from "react";
import { AdminMenuCard } from "./AdminMenuCard";
import DataContextAdmin from "../../Context/DataContextAdmin";
import AdminNoItems from "./AdminNoItems";
import { IoIosAddCircle } from "react-icons/io";
import Popup from "./PopupComponents/popup";

const AdminMenuGrid = () => {
  const allergensList = [
    "Gluten",
    "Milk",
    "Eggs",
    "Nuts",
    "Peanuts",
    "Soybeans",
    "Fish",
    "Crustaceans",
    "Molluscs",
    "Celery",
    "Lupin",
    "Sesame",
    "Mustard",
    "Sulphites",
    "None",
  ];

  const [allergensError, setAllergensError] = useState("");
  const {
    searchItems,
    handleAddItem,
    setFoodName,
    setFoodPrice,
    foodveg_non_veg,
    setfoodcategory,
    foodcategory,
    setFoodveg_non_veg,
    setFoodTotal,
    setFoodAllergens,
    setFoodIngredients,
    isProductAddPopupVisible,
    setProductAddPopupVisible,
    handleClosePopup,
    foodExists,
    addloding,
    addpbut,
    selectedAllergens,
    setSelectedAllergens,
  } = useContext(DataContextAdmin);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    setSelectedAllergens((prevState) => {
      const updatedAllergens = checked
        ? [...prevState, value] // Add allergen
        : prevState.filter((allergen) => allergen !== value); // Remove allergen
      return updatedAllergens;
    });

    setFoodAllergens((prevState) => {
      if (!Array.isArray(prevState)) prevState = []; // Ensure it's an array
      const updatedAllergens = checked
        ? [...prevState, value]
        : prevState.filter((allergen) => allergen !== value);
      return updatedAllergens;
    });

    // Clear the error when at least one checkbox is selected
    if (selectedAllergens.length > 0 || checked) {
      setAllergensError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate allergens
    if (selectedAllergens.length === 0) {
      setAllergensError("Please select at least one allergen.");
      return;
    }

    // Proceed with adding the item
    handleAddItem();
  };

  return (
    <div className="pb-20">
      {searchItems.length > 0 && (
        <div className="container grid gap-10 md:gap-5 rounded-md bg-customLightGray4 px-3 py-7 shadow-lg grid-cols-1 md:grid-cols-2 ">
          {searchItems.map((item) => (
            <div key={item.id} className="flex">
              <AdminMenuCard item={item} />
            </div>
          ))}
          <div className="bg-white rounded-md p-2 basis-full shadow-lg sm:shadow-none sm:hover:shadow-lg border-0.5 border-customLightGray4">
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
      )}
      {searchItems.length === 0 && <AdminNoItems />}

      <Popup trigger={isProductAddPopupVisible} onClose={handleClosePopup}>
        <div className="flex-col gap-5 justify-center border-2 border-customLightGray4 p-5 shadow-lg shadow-customLightGray4">
          <h1 className="text-center font-bold text-4xl py-5">Add Food</h1>
          <form
            action=""
            className="flex-col space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-3 items-center">
              <label htmlFor="foodName" className="w-1/4">
                Name:
              </label>
              <div className="flex flex-col">
                <input
                  required
                  id="foodName"
                  type="text"
                  placeholder="Enter the food name"
                  onChange={(e) => setFoodName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                />
                {foodExists && (
                  <span>
                    <h1 className="text-red-500">Food already exists</h1>
                  </span>
                )}
              </div>
            </div>

            {/* Food Price */}
            <div className="flex gap-3 items-center">
              <label htmlFor="foodPrice" className="w-1/4">
                Price:
              </label>
              <input
                required
                id="foodPrice"
                type="number"
                placeholder="Enter the food price"
                min={0.01}
                step={0.01}
                onChange={(e) => setFoodPrice(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-3 items-center">
              <label htmlFor="foodveg_non_veg" className="w-1/4">
                Dietary Choice:
              </label>
              <select
                required
                id="foodveg_non_veg"
                value={foodveg_non_veg}
                onChange={(e) => setFoodveg_non_veg(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="0">NON-VEG</option>
                <option value="1">VEG</option>
                <option value="2">VEGAN</option>
              </select>
            </div>
            <div className="flex gap-3 items-center">
              <label htmlFor="foodcategory" className="w-1/4">
                Category:
              </label>
              <select
                required
                id="foodcategory"
                value={foodcategory}
                onChange={(e) => setfoodcategory(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="0">STARTERS</option>
                <option value="1">MAIN COURSE</option>
                <option value="2">DESSERTS</option>
              </select>
            </div>
            <div className="flex gap-3 items-center">
              <label htmlFor="foodQuantity" className="w-1/4">
                Total Quantity:
              </label>
              <input
                required
                id="foodQuantity"
                type="number"
                placeholder="Enter the food quantity"
                onChange={(e) => setFoodTotal(e.target.value)}
                min={1}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-3 items-center">
              <label htmlFor="foodIngredients" className="w-1/4">
                Address:
              </label>
              <textarea
                required
                id="foodIngredients"
                placeholder="Enter the Address"
                onChange={(e) => setFoodIngredients(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md h-24"
              />
            </div>
            <div className="flex gap-3 items-center">
              <label htmlFor="foodAllergens" className="w-1/4">
                Allergens:
              </label>
              <div className="flex flex-wrap gap-2">
                {allergensList.map((allergen) => (
                  <label key={allergen}>
                    <input
                      type="checkbox"
                      value={allergen}
                      checked={selectedAllergens.includes(allergen)}
                      onChange={handleCheckboxChange}
                    />
                    {allergen}
                  </label>
                ))}
              </div>
              {allergensError && (
                <p className="text-red-500">{allergensError}</p>
              )}
            </div>
            <div className="flex gap-4 justify-end">
              {addpbut && (
                <div className="flex gap-4 justify-end">
                  <button
                    type="reset"
                    className="text-xl bg-slate-950 text-white w-32 h-10 rounded-sm hover:bg-customGray"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="text-xl bg-slate-950 text-white w-32 h-10 rounded-sm hover:bg-customGray"
                  >
                    Add
                  </button>
                </div>
              )}
              {addloding && (
                <div className="flex justify-center">
                  <svg
                    className="h-10 animate-spin stroke-black text-center"
                    viewBox="0 0 256 256"
                  >
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      strokeWidth="16"
                      stroke="black"
                      fill="none"
                      strokeDasharray="314"
                      strokeDashoffset="0"
                    ></circle>
                  </svg>
                </div>
              )}
            </div>
          </form>
        </div>
      </Popup>
    </div>
  );
};

export default AdminMenuGrid;
