import {
  createContext,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import api from "../API/DataStore";
import DataContextUser from "./DataContextUser";
import axios from "axios";
import { toast } from "react-toastify";
import {
  AdmingetUserData,
  AdminisAunthenticated,
} from "../Admin_page/AdminPages/LoginPage/services/Adminstorage";
import { initializeAbly } from "./websocket/ws";

const DataContextAdmin = createContext({});

export const DataProviderAdmin = ({ children }) => {
  const {
    menuItems,
    setMenuItems,
    handleDeleteItem,
    deleteloading,
    setdeleteloading,
    setdeletebut,
    deletebut,
  } = useContext(DataContextUser);
  const [searchItems, setSearchItems] = useState(menuItems);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState(3);
  const [foodID, setFoodID] = useState(-1);
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodveg_non_veg, setFoodveg_non_veg] = useState("");
  const [foodcategory, setfoodcategory] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");
  const [foodTotal, setFoodTotal] = useState("");
  const [foodAllergens, setFoodAllergens] = useState("");
  const [foodIngredients, setFoodIngredients] = useState("");
  const [foodExists, setFoodExists] = useState(false);
  const [isProductAddPopupVisible, setProductAddPopupVisible] = useState(false);
  const [isProductEditPopupVisible, setProductEditPopupVisible] =
    useState(false);
  const [editFoodName, setEditFoodName] = useState("");
  const [editFoodExists, setEditFoodExists] = useState(false);
  const [invalidQuantity, setInvalidQuantity] = useState(false);
  const [checkedDelivery, setCheckedDelivery] = useState([]);
  const [checkedPayment, setCheckedPayment] = useState([]);
  const [editbut, seteditbut] = useState(true);
  const [editloding, seteditloding] = useState(false);
  const [addpbut, setaddbut] = useState(true);
  const [addloding, setaddloding] = useState(false);
  const [selectedAllergens, setSelectedAllergens] = useState([]);

  // Function for search and filtering
  useEffect(() => {
    const filterFunc = (filterVal) => {
      const filtItems = menuItems.filter((item) =>
        item.veg_non_veg === filterVal ? item : null
      );
      const newItem = filtItems.filter(
        (item) =>
          item.name && // Check if item.name exists
          typeof item.name === "string" && // Check if item.name is a string
          item.name.toLowerCase().includes(searchValue.trim())
      );
      setSearchItems(newItem);
    };

    if (filter === 3) {
      const newItem = menuItems.filter(
        (item) =>
          item.name && // Check if item.name exists
          typeof item.name === "string" && // Check if item.name is a string
          item.name.toLowerCase().includes(searchValue.trim())
      );
      setSearchItems(newItem);
    } else if (filter === 2 || filter === 1) {
      filterFunc(filter);
    } else {
      filterFunc(filter);
    }
  }, [menuItems, filter, searchValue]);

  //closing popups
  const handleClosePopup = () => {
    setFoodExists(false);
    setEditFoodExists(false);
    setProductAddPopupVisible(false);
    setProductEditPopupVisible(false);
    setInvalidQuantity(false);
  };

  //function for adding items
  const handleAddItem = async () => {
    const allergensArray = Array.isArray(foodAllergens)
      ? foodAllergens
      : foodAllergens.split(", ").map((allergen) => allergen.trim());
    const allergensString = allergensArray.join(", ");
    if (
      foodExists === false &&
      foodName.trim() &&
      allergensString.trim() &&
      foodIngredients.trim() &&
      Number.isFinite(Number(foodPrice)) &&
      Number(foodveg_non_veg) >= 0 &&
      Number(foodveg_non_veg) < 3 &&
      Number(foodcategory) >= 0 &&
      Number(foodcategory) < 3 &&
      Number.isFinite(Number(foodTotal)) &&
      Number(foodTotal) > 0
    ) {
      try {
        const addItem = {
          // No need to manually assign an id; let MySQL auto-increment handle it
          name: foodName.trim(),
          veg_non_veg: Number(foodveg_non_veg),
          category: Number(foodcategory),
          price: Number(foodPrice),
          ingredients: foodIngredients.trim(),
          quantity: Number(foodTotal),
          serving: 0,
          total: Number(foodTotal),
          allergens: allergensString.trim(),
          cartStatus: false,
        };
        setaddbut(false);
        setaddloding(true);
        const response = await api.post(
          `food?idToken=${AdmingetUserData()}`,
          addItem
        );
        const changeItems = [...menuItems, response.data];
        setMenuItems(changeItems);
        setaddloding(false);
        setaddbut(true);
        toast.success("Food added");
      } catch (error) {
        console.log(error.message);
        setaddloding(false);
        setaddbut(true);
        toast.error("something went wrong");
      } finally {
        // Reset form values and close popup
        setFoodID("");
        setFoodName("");
        setFoodPrice("");
        setFoodveg_non_veg("");
        setfoodcategory("");
        setFoodTotal("");
        setFoodAllergens("");
        setSelectedAllergens([]);
        setFoodIngredients("");
        handleClosePopup();
      }
    }
  };

  //Handling edit click
  const handleEditClick = (itemID) => {
    setProductEditPopupVisible(true);
    const selectedItem = menuItems.find((item) => item.id === itemID);
    // console.log(itemID);

    if (selectedItem) {
      setFoodID(itemID);
      setEditFoodName(selectedItem.name);
      setFoodPrice(selectedItem.price);
      setFoodveg_non_veg(selectedItem.veg_non_veg);
      setfoodcategory(selectedItem.category);
      setFoodQuantity(selectedItem.quantity);
      setFoodTotal(selectedItem.total);
      setFoodAllergens(selectedItem.allergens);
      setFoodIngredients(selectedItem.ingredients);
    }
  };

  //function for editing items
  const handleEditItem = async () => {
    // Ensure foodAllergens is an array
    const allergensArray = Array.isArray(foodAllergens)
      ? foodAllergens
      : foodAllergens.split(", ").map((allergen) => allergen.trim());

    const allergensString = allergensArray.join(", ");

    if (
      editFoodExists === false &&
      editFoodName.trim() &&
      Number(foodQuantity) >= 0 &&
      Number(foodQuantity) <= Number(foodTotal) &&
      allergensString.trim() &&
      foodIngredients.trim() &&
      Number(foodPrice) > 0 &&
      Number(foodveg_non_veg) >= 0 &&
      Number(foodveg_non_veg) < 3 &&
      Number(foodcategory) >= 0 &&
      Number(foodcategory) < 3 &&
      Number.isInteger(Number(foodTotal)) &&
      Number(foodTotal) > 0
    ) {
      const editItem = {
        id: foodID.toString(),
        name: editFoodName.trim(),
        veg_non_veg: Number(foodveg_non_veg),
        category: Number(foodcategory),
        price: Number(foodPrice),
        ingredients: foodIngredients.trim(),
        quantity: Number(foodQuantity),
        serving: 0,
        total: Number(foodTotal),
        allergens: allergensString.trim(),
        cartStatus: false,
      };
      console.log(editItem);

      try {
        if (!foodID) {
          console.error("foodID is undefined");
          return;
        }
        console.log("Sending request to edit food item:", editItem);
        seteditbut(false);
        seteditloding(true);
        const response = await api.put(
          `/food/${foodID}?idToken=${AdmingetUserData()}`,
          editItem
        );
        toast.success("Food edited");
        seteditbut(true);
        seteditloding(false);
        setMenuItems(
          menuItems.map((item) =>
            item.id === foodID ? { ...response.data } : item
          )
        );
      } catch (error) {
        console.log("Error during PUT request:", error.message);
        toast.error("something went wrong");
        seteditbut(true);
        seteditloding(false);
      } finally {
        setFoodID(-1);
        setEditFoodName("");
        setFoodPrice("");
        setFoodveg_non_veg("");
        setfoodcategory("");
        setFoodQuantity("");
        setFoodTotal("");
        setFoodAllergens("");
        setSelectedAllergens([]);
        setFoodIngredients("");
        handleClosePopup();
      }
    }
  };

  //handling invalid food quantity
  useEffect(() => {
    if (
      Number(foodQuantity) >= 0 &&
      Number(foodQuantity) <= Number(foodTotal)
    ) {
      setInvalidQuantity(false);
    } else {
      setInvalidQuantity(true);
    }
  }, [foodQuantity, foodTotal]);

  // Update the refs whenever the values change
  const foodIDRef = useRef(foodID);
  const menuItemsRef = useRef(menuItems);

  useEffect(() => {
    foodIDRef.current = foodID;
  }, [foodID]);

  useEffect(() => {
    menuItemsRef.current = menuItems;
  }, [menuItems]);

  //checking if items already exists at editing a food
  useEffect(() => {
    if (editFoodName.trim()) {
      const temp = menuItems.filter((item) => {
        // Check if item.name exists before calling toLowerCase
        return (
          item.id !== foodID &&
          item.name && // Ensure item.name is defined
          item.name.toLowerCase() === editFoodName.toLowerCase().trim()
        );
      });

      if (temp.length) {
        setEditFoodExists(true);
      } else {
        setEditFoodExists(false);
      }
    } else {
      setEditFoodExists(false);
    }
  }, [editFoodName, foodID, menuItems]);

  //checking if items already exists at adding new food
  useEffect(() => {
    if (foodName.trim()) {
      const temp = menuItems.filter((item) =>
        item.name.toLowerCase() === foodName.toLowerCase().trim() ? item : null
      );
      if (temp.length) {
        setFoodExists(true);
      } else {
        setFoodExists(false);
      }
    } else {
      setFoodExists(false);
    }
  }, [foodName, menuItems]);

  ///////////////////////////////
  //Admin-order details section//
  ///////////////////////////////

  // useState hooks usage
  const [details, setDetails] = useState([]);
  const [searchDetails, setSearchDetails] = useState(details);
  const [searchVal, setSearchVal] = useState("");
  const [isErr, setIsErr] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [checkedVal, setCheckedVal] = useState([]);
  const [updateLoad, setUpdateLoad] = useState(false);

  // Fetching order details

  // Fetching order details
  useEffect(() => {
    if (AdminisAunthenticated()) {
      const fetchItems = async () => {
        try {
          const response = await api.get(
            `${
              import.meta.env.VITE_SERVER_URL
            }/orders/currentPhase?idToken=${AdmingetUserData()}`
          );
          setDetails(response.data);
          setIsErr(null);
        } catch (error) {
          console.log("Error fetching items:", error.message);
          setIsErr(error.message);
        } finally {
          setIsTableLoading(false);
        }
      };

      fetchItems();
    } else {
      console.log("Admin is not authenticated.");
      setIsTableLoading(false);
    }
  }, []);

  // Handle WebSocket updates
  useEffect(() => {
    const handleUpdatedOrder = (data) => {
      console.log("Order received:", data);

      if (data.type === "UPDATE_ORDERS") {
        setDetails((prevDetails) => {
          const existingOrderIds = new Set(
            prevDetails.map((order) => order.orderid)
          );
          const newOrders = data.currentPhaseOrders.filter(
            (order) => !existingOrderIds.has(order.orderid)
          );
          console.log("New orders:", newOrders);

          // Combine existing orders with new orders and sort by timing (latest first)
          return [...prevDetails, ...newOrders].sort(
            (a, b) => new Date(b.timing) - new Date(a.timing)
          );
        });
      }
    };

    // Initialize Ably with a channel name and the handler function
    const channel = initializeAbly("orders-channel", handleUpdatedOrder);

    return () => {
      channel.unsubscribe(); // Cleanup Ably subscription on component unmount
      console.log("Ably channel subscription closed.");
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  // Searching by order ID
  useEffect(() => {
    if (searchVal.trim() === "") {
      // Reset to full details when search value is empty
      setSearchDetails(details);
    } else {
      const newItem = details.filter((item) => {
        const orderIdStr = item.orderid
          ? String(item.orderid).toLowerCase()
          : "";
        const usernameStr = item.username ? item.username.toLowerCase() : "";
        return (
          orderIdStr.includes(searchVal.trim().toLowerCase()) ||
          usernameStr.includes(searchVal.trim().toLowerCase())
        );
      });
      setSearchDetails(newItem);
    }
  }, [searchVal, details]);
  // Handle checkbox change to track selected orders
  const handleDeliveryCheckboxChange = (orderid) => {
    setCheckedDelivery((prev) =>
      prev.includes(orderid)
        ? prev.filter((i) => i !== orderid)
        : [...prev, orderid]
    );
  };

  const handlePaymentCheckboxChange = (orderid) => {
    setCheckedPayment((prev) =>
      prev.includes(orderid)
        ? prev.filter((i) => i !== orderid)
        : [...prev, orderid]
    );
  };

  // Handle the "UPDATE" button click to finalize the delivery status
  const handleUpdateClick = async () => {
    if (updateLoad) return;

    if (!checkedDelivery.length && !checkedPayment.length) {
      return toast.info("No updates made");
    }
    setUpdateLoad(true);
    try {
      // Delivery updates
      const deliveryUpdates = details
        .filter((item) => checkedDelivery.includes(item.orderid))
        .map((item) => ({
          orderid: item.orderid,
          deliveryStatus: true,
        }));

      const paymentUpdates = details
        .filter((item) => checkedPayment.includes(item.orderid))
        .map((item) => ({
          orderid: item.orderid,
          paymentStatus: "Paid",
        }));

      const updatePromises = [
        ...deliveryUpdates.map((item) =>
          api.put(
            `${import.meta.env.VITE_SERVER_URL}/orders/update-delivery-status/${
              item.orderid
            }`,
            { deliveryStatus: item.deliveryStatus }
          )
        ),
        ...paymentUpdates.map((item) =>
          api.put(
            `${import.meta.env.VITE_SERVER_URL}/orders/update-payment-status/${
              item.orderid
            }`,
            { paymentStatus: item.paymentStatus }
          )
        ),
      ];

      await Promise.all(updatePromises);

      // Update local state
      setDetails((prevDetails) =>
        prevDetails.map((item) => ({
          ...item,
          deliveryStatus: checkedDelivery.includes(item.orderid)
            ? true
            : item.deliveryStatus,
          paymentStatus: checkedPayment.includes(item.orderid)
            ? "Completed"
            : item.paymentStatus,
        }))
      );
      setUpdateLoad(false);
      toast.success("Status updated");
      // Clear states
      setCheckedDelivery([]);
      setCheckedPayment([]);
    } catch (error) {
      console.error("Error updating statuses:", error.message);
    }
  };

  /////////////////
  //Timer Section//
  /////////////////

  //format time as HH:MM:SS
  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };
  const [serverTime, setServerTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [timeErr, setTimeErr] = useState("");
  const [newOpenTime, setNewOpenTime] = useState("");
  const [newCloseTime, setNewCloseTime] = useState("");
  const [timeUpdateLoad, setTimeUpdateLoad] = useState(false);
  const [istimePopupVisible, settimePopupVisible] = useState(false);

  const initialServerTime = new Date(serverTime);

  const getInitialPhase = (now) => {
    if (now < new Date(openTime)) {
      return "opens";
    } else if (now < new Date(closeTime)) {
      return "closes";
    } else if (now > new Date(closeTime)) {
      return "closed";
    } else {
      return "load";
    }
  };

  const [currentPhase, setCurrentPhase] = useState(
    getInitialPhase(initialServerTime)
  );

  const fetchServerAndPhaseTime = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/timing`
      );

      const [serverTimeString, openTimeString, closeTimeString] = response.data;

      setServerTime(new Date(serverTimeString));
      setOpenTime(new Date(openTimeString));
      setCloseTime(new Date(closeTimeString));

      setTimeErr("");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching time data:", error.message);
      setTimeErr(`Error fetching time data: ${error.message}`);
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const handleTimingUpdate = (data) => {
      if (data.type === "TIME_UPDATED") {
        const { serverTimeString, openTimeString, closeTimeString } =
          data.timing;

        // Update the states with the correct time data
        setServerTime(new Date(serverTimeString));
        setOpenTime(new Date(openTimeString));
        setCloseTime(new Date(closeTimeString));
      }
    };

    // Initialize Ably and subscribe to the relevant channel
    const channel = initializeAbly("timing-channel", handleTimingUpdate);
    return () => {
      channel.unsubscribe(); // Cleanup Ably subscription on component unmount
      console.log("Ably channel subscription closed.");
    };
  }, []);

  useEffect(() => {
    const updatePhaseTime = async (newOpenTime, newCloseTime) => {
      try {
        const tempTime = {
          open_time: newOpenTime,
          close_time: newCloseTime,
        };

        await axios.put(
          `${
            import.meta.env.VITE_SERVER_URL
          }/timing?idToken=${AdmingetUserData()}`,
          tempTime
        );
        toast.success("Time Updated");
      } catch (error) {
        console.error(error.message);
        toast.error("Server error. Please try again");
      }

      setTimeUpdateLoad(false);
      handleTimeEditClosePopup();
    };

    if (newOpenTime && newCloseTime) {
      setTimeUpdateLoad(true);
      updatePhaseTime(newOpenTime, newCloseTime);
    }
  }, [newOpenTime, newCloseTime]);

  useEffect(() => {
    fetchServerAndPhaseTime();

    const handleTimingUpdate = (data) => {
      console.log("Ably timing update received:", data);
      setServerTime(new Date(data.serverTime));
      setOpenTime(new Date(data.openTime.timestamp));
      setCloseTime(new Date(data.closeTime.timestamp));
    };

    // Initialize Ably and subscribe to the relevant channel
    const channel = initializeAbly("timing-channel", handleTimingUpdate);
    return () => {
      channel.unsubscribe(); // Cleanup Ably subscription on component unmount
      console.log("Ably channel subscription closed.");
    };
  }, [fetchServerAndPhaseTime]);

  const handleTimeEditClosePopup = () => {
    settimePopupVisible(false);
  };

  return (
    <DataContextAdmin.Provider
      value={{
        filter,
        setFilter,
        menuItems,
        searchItems,
        setSearchValue,
        handleAddItem,
        handleEditItem,
        handleDeleteItem,
        deleteloading,
        setdeleteloading,
        foodID,
        foodName,
        foodPrice,
        foodveg_non_veg,
        foodcategory,
        foodQuantity,
        foodTotal,
        foodAllergens,
        foodIngredients,
        editFoodName,
        setEditFoodName,
        setFoodName,
        setFoodPrice,
        setFoodveg_non_veg,
        setfoodcategory,
        setFoodQuantity,
        setFoodTotal,
        setFoodAllergens,
        setFoodIngredients,
        handleClosePopup,
        isProductAddPopupVisible,
        setProductAddPopupVisible,
        setProductEditPopupVisible,
        isProductEditPopupVisible,
        foodExists,
        editFoodExists,
        handleEditClick,
        invalidQuantity,
        handleUpdateClick,
        setSearchVal,
        isTableLoading,
        isErr,
        searchDetails,
        setCheckedPayment,
        setCheckedDelivery,
        checkedPayment,
        checkedDelivery,
        handlePaymentCheckboxChange,
        handleDeliveryCheckboxChange,
        checkedVal,
        openTime,
        closeTime,
        serverTime,
        loading,
        formatTime,
        timeErr,
        currentPhase,
        setCurrentPhase,
        setCheckedVal,
        initialServerTime,
        fetchServerAndPhaseTime,
        setNewOpenTime,
        setNewCloseTime,
        timeUpdateLoad,
        details,
        setdeletebut,
        deletebut,
        editloding,
        editbut,
        seteditbut,
        seteditloding,
        addloding,
        addpbut,
        selectedAllergens,
        setSelectedAllergens,
        updateLoad,
        handleTimeEditClosePopup,
        istimePopupVisible,
        settimePopupVisible,
      }}
    >
      {children}
    </DataContextAdmin.Provider>
  );
};

export default DataContextAdmin;
