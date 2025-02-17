import axios from "axios";
import { createContext, useEffect, useState } from "react";
import api from "../API/DataStore";
import { getuserdetails } from "../User_page/login_pages/services/API";
import { isAunthenticated } from "../User_page/login_pages/services/auth";
import { toast } from "react-toastify";
import {
  getUserData,
  getUserIdData,
} from "../User_page/login_pages/services/storage";
import { AdmingetUserData } from "../Admin_page/AdminPages/LoginPage/services/Adminstorage";
import { initializeAbly } from "./websocket/ws";

const img1 = "/assets/banner1.jpeg";
const img2 = "/assets/banner2.jpeg";
const img3 = "/assets/banner3.jpeg";
const video = "/assets/banner4.mp4";
const img = "/assets/ReGister.mp4";

const DataContextUser = createContext({});

export const DataProviderUser = ({ children }) => {
  //total menuItems
  //Non-Veg = 0
  //Veg = 1
  //Vegan = 2
  //All = 3

  //Category
  //Starters = 0
  //Maincourse = 1
  //Desserts = 2
  //All = 3

  const [menuItems, setMenuItems] = useState([]);
  const [searchItems, setSearchItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState(3);
  const [foodCategory, setFoodCategory] = useState(3);
  const [cartItems, setCartItems] = useState([]);
  const [itemID, setItemID] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [removeID, setRemoveID] = useState(-1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [incID, setIncID] = useState(-1);
  const [decID, setDecID] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [confirmbut, setConfirmbut] = useState(false);
  const [confirmorder, setconfirmorder] = useState(false);
  const [cancel, setcancel] = useState(true);
  const [deleteloading, setdeleteloading] = useState(false);
  const [deletebut, setdeletebut] = useState(true);
  const [addItemToServer, setAddItemToServer] = useState(false);
  const [removeItemFromServer, setRemoveItemFromServer] = useState(false);
  const [incToServer, setIncToServer] = useState(false);
  const [decToServer, setDecToServer] = useState(false);

  // Fetching items / items with cart
  useEffect(() => {
    const fetchItems = async () => {
      try {
        let response;
        if (getUserIdData() !== null) {
          response = await api.get(`food/${getUserIdData()}`);
          const updatedCartItems = response.data.filter(
            (item) => item.cartStatus
          );
          setCartItems(updatedCartItems);
        } else {
          response = await api.get("food");
        }
        setMenuItems(response.data);
        setErr(null);
      } catch (error) {
        setErr(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Handle Ably message updates and sync cartItems with menuItems
  useEffect(() => {
    const handleAblyMessage = (data) => {
      console.log("Received Ably message:", data);

      if (!data || !data.type) {
        console.error("Invalid message format");
        return;
      }

      if (["ADD", "DELETE", "UPDATE", "UPDATE_FOOD"].includes(data.type)) {
        setMenuItems((prevItems) => {
          let updatedItems;

          if (data.type === "ADD") {
            updatedItems = [...prevItems, data.food];
          } else if (data.type === "DELETE") {
            updatedItems = prevItems.filter(
              (item) => item.id !== Number(data.foodId)
            );
          } else if (data.type === "UPDATE") {
            updatedItems = prevItems.map((item) =>
              item.id === data.food.id ? data.food : item
            );
          } else if (data.type === "UPDATE_FOOD") {
            updatedItems = data.foodItems;
          }

          const cartIds = cartItems.map((cartItem) => cartItem.id);

          // Ensure cartItems are updated when food is deleted or modified
          const updatedCartItems = updatedItems
            .filter((menuItem) => cartIds.includes(menuItem.id))
            .map((menuItem) => {
              const inCart = cartIds.includes(menuItem.id);
              const matchingCartItem = cartItems.find(
                (cartItem) => cartItem.id === menuItem.id
              );

              return {
                ...menuItem,
                cartStatus: inCart,
                serving: inCart
                  ? Math.min(matchingCartItem?.serving || 0, menuItem.quantity)
                  : 0,
              };
            });

          // Remove cart items that were deleted from menu
          const finalUpdatedItems = updatedItems.map((menuItem) => {
            const inCart = cartIds.includes(menuItem.id);
            const matchingCartItem = cartItems.find(
              (cartItem) => cartItem.id === menuItem.id
            );

            return {
              ...menuItem,
              cartStatus: inCart,
              serving: inCart
                ? Math.min(matchingCartItem?.serving || 0, menuItem.quantity)
                : 0,
            };
          });

          // Set both menu items and cart items
          setCartItems(updatedCartItems);
          return finalUpdatedItems; // Return final updated items
        });

        // Remove deleted item from cartItems
        setCartItems((prevCartItems) => {
          return prevCartItems.filter(
            (cartItem) => !data.foodId || cartItem.id !== Number(data.foodId)
          );
        });
      }
    };

    const channel = initializeAbly("menu-channel", handleAblyMessage);

    return () => {
      channel.unsubscribe();
      console.log("Ably channel subscription closed.");
    };
  }, [cartItems]);

  // Sync cartItems with menuItems (after Ably updates or changes in menuItems)
  useEffect(() => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.map((cartItem) => {
        const matchingMenuItem = menuItems.find(
          (menuItem) => menuItem.id === cartItem.id
        );

        if (matchingMenuItem) {
          return {
            ...cartItem,
            cartStatus: true,
            serving: Math.min(cartItem.serving, matchingMenuItem.quantity),
            quantity: matchingMenuItem.quantity,
          };
        }

        return cartItem;
      });

      return updatedCartItems;
    });
  }, [menuItems]);

  // Increment serving for cart items
  useEffect(() => {
    const updateServing = async () => {
      if (incID !== null && incID !== -1) {
        const resetState = () => {
          setIncID(-1);
          setIncToServer(false);
        };

        setIncToServer(true);

        setMenuItems((prevItems) => {
          const updatedItem = prevItems.find((item) => item.id === incID);
          const maximumVal = 2;
          if (updatedItem?.serving === maximumVal) {
            if (!toast.isActive("max-serving-toast")) {
              toast.warning("Maximum limit of 2 is reached", {
                toastId: "max-serving-toast",
              });
            }
            resetState();
            return prevItems;
          }

          const incrementServing = prevItems.map((item) =>
            item.id === incID
              ? {
                  ...item,
                  serving: Math.min(
                    item.serving + 1,
                    maximumVal,
                    item.quantity
                  ),
                }
              : item
          );

          const updatedCartItems = incrementServing.filter(
            (item) => item.cartStatus
          );

          const putInc = async (updatedCartItems) => {
            try {
              if (getUserIdData() !== null) {
                const tempCart = {
                  id: incID,
                  serving: updatedItem?.serving + 1,
                };
                await api.post(`food/${getUserIdData()}`, tempCart);
                setCartItems(updatedCartItems);
              } else {
                setCartItems(updatedCartItems);
              }
            } catch (error) {
              console.error(error.message);
              if (!toast.isActive("inc-cart-err-toast")) {
                toast.error(error.message, {
                  toastId: "inc-cart-err-toast",
                });
              }
            }

            resetState();
          };
          putInc(updatedCartItems);
          return incrementServing;
        });
      }
    };

    if (incID !== null && incID !== -1) {
      updateServing();
    }
  }, [incID]);

  // Decrement serving for cart items
  useEffect(() => {
    const updateServing = async () => {
      if (decID !== null && decID !== -1) {
        const resetState = () => {
          setDecID(-1);
          setDecToServer(false);
        };

        setDecToServer(true);

        setMenuItems((prevItems) => {
          const updatedItem = prevItems.find((item) => item.id === decID);
          if (updatedItem?.serving === 1) {
            if (!toast.isActive("min-serving-toast")) {
              toast.warning("Can't reduce further. Consider removing item.", {
                toastId: "min-serving-toast",
              });
            }
            resetState();
            return prevItems;
          }

          const decrementServing = prevItems.map((item) =>
            item.id === decID
              ? {
                  ...item,
                  serving: Math.max(item.serving - 1, 1), // Ensure serving doesn't go below 1
                }
              : item
          );

          const updatedCartItems = decrementServing.filter(
            (item) => item.cartStatus
          );

          const putDec = async (updatedCartItems) => {
            try {
              if (getUserIdData() !== null) {
                const tempCart = {
                  id: decID,
                  serving: updatedItem?.serving - 1,
                };
                await api.post(`food/${getUserIdData()}`, tempCart);
                setCartItems(updatedCartItems);
              } else {
                setCartItems(updatedCartItems);
              }
            } catch (error) {
              console.error(error.message);
              if (!toast.isActive("dec-cart-err-toast")) {
                toast.error(error.message, {
                  toastId: "dec-cart-err-toast",
                });
              }
            }

            resetState();
          };
          putDec(updatedCartItems);
          return decrementServing;
        });
      }
    };

    if (decID !== null && decID !== -1) {
      updateServing();
    }
  }, [decID]);

  // Add or remove items from the cart (based on itemID and removeID)
  useEffect(() => {
    const updateCart = async () => {
      if (itemID !== null && itemID !== -1) {
        setAddItemToServer(true);
        setMenuItems((prevItems) => {
          const addItem = async (updatedCartItems) => {
            try {
              if (getUserIdData() !== null) {
                const tempCart = { id: itemID, serving: 1 };
                await api.post(`food/${getUserIdData()}`, tempCart);
                setAddItemToServer(false);
                setItemID(-1);
                setCartItems(updatedCartItems);
              } else {
                setAddItemToServer(false);
                setItemID(-1);
                setCartItems(updatedCartItems);
              }
            } catch (error) {
              console.error(error.message);
              if (!toast.isActive("add-to-cart-err-toast")) {
                toast.error(error.message, {
                  toastId: "add-to-cart-err-toast",
                });
              }
            }
          };

          const updatedItems = prevItems.map((item) =>
            item.id === itemID
              ? { ...item, cartStatus: !item.cartStatus, serving: 1 }
              : item
          );
          const updatedCartItems = updatedItems.filter(
            (item) => item.cartStatus
          );
          addItem(updatedCartItems);

          return updatedItems;
        });
      }
    };

    updateCart();
  }, [itemID]);

  // Remove an item from cart
  useEffect(() => {
    const updateCart = async () => {
      if (removeID !== null && removeID !== -1) {
        setRemoveItemFromServer(true);
        setMenuItems((prevItems) => {
          const removeItem = async (updatedCartItems) => {
            try {
              if (getUserIdData() !== null) {
                const tempCart = { id: removeID };
                await api.put(`food/item/${getUserIdData()}`, tempCart);
                setRemoveItemFromServer(false);
                setRemoveID(-1);
                setCartItems(updatedCartItems);
              } else {
                setRemoveItemFromServer(false);
                setRemoveID(-1);
                setCartItems(updatedCartItems);
              }
            } catch (error) {
              console.error(error.message);
              if (!toast.isActive("remove-from-cart-err-toast")) {
                toast.error(error.message, {
                  toastId: "remove-from-cart-err-toast",
                });
              }
            }
          };

          const updatedItems = prevItems.map((item) =>
            item.id === removeID
              ? { ...item, cartStatus: false, serving: 0 }
              : item
          );
          const updatedCartItems = updatedItems.filter(
            (item) => item.cartStatus
          );
          removeItem(updatedCartItems);

          return updatedItems;
        });
      }
    };

    updateCart();
  }, [removeID]);

  // Function for search and filtering
  useEffect(() => {
    const filterFunc = (filterVal, categoryVal) => {
      const filtItems = menuItems.filter((item) => {
        const isDietaryMatch =
          filterVal === 3 || item.veg_non_veg === filterVal;
        const isCategoryMatch =
          categoryVal === 3 || item.category === categoryVal;

        return (
          isDietaryMatch &&
          isCategoryMatch &&
          item.name &&
          typeof item.name === "string" &&
          item.name.toLowerCase().includes(searchValue.trim())
        );
      });
      setSearchItems(filtItems);
    };

    if (filter === 3 && foodCategory === 3) {
      const newItem = menuItems.filter(
        (item) =>
          item.name &&
          typeof item.name === "string" &&
          item.name.toLowerCase().includes(searchValue.trim())
      );
      setSearchItems(newItem);
    } else {
      filterFunc(filter, foodCategory);
    }
  }, [menuItems, filter, foodCategory, searchValue]);

  // Calculate total price
  useEffect(() => {
    setTotalPrice(
      cartItems.reduce((accumulator, item) => {
        return accumulator + item.serving * item.price;
      }, 0)
    );
  }, [cartItems]);

  //current timing

  // const generateRandomAlphanumericOrderId = () => {
  //   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  //   let orderId = "";

  //   // Generate 3 random digits
  //   for (let i = 0; i < 3; i++) {
  //     orderId += Math.floor(Math.random() * 10);
  //   }

  //   // Generate 2 random letters
  //   for (let i = 0; i < 2; i++) {
  //     orderId += characters.charAt(
  //       Math.floor(Math.random() * characters.length)
  //     );
  //   }

  //   // Generate 1 random uppercase letter
  //   orderId += characters.charAt(Math.floor(Math.random() * 26)).toUpperCase();

  //   return orderId;
  // };

  // // Example usage
  // const orderId = generateRandomAlphanumericOrderId();
  // console.log(orderId);

  // Generates the overall order ID
  // Place order
  const order = async () => {
    const itemsWithPrice = cartItems
      .filter(
        (item) => item && item.id && item.name && item.serving && item.price
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.serving,
        price: item.price,
        veg_non_veg: item.veg_non_veg,
        category: item.category,
      }));

    const userorders = {
      user_id: getUserIdData(),
      orders: itemsWithPrice,
      totalPrice,
    };

    setLoading(true);
    return axios
      .post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/orders/all?idToken=${getUserData()}`,
        userorders
      )
      .then((response) => {
        // Extract the order ID from the response
        const orderId = response.data.order_id; // Assuming the API returns { "message": "Order created successfully", "order_id": "B020" }

        // Prepare email data with the correct structure
        const emailData = {
          orderId: orderId, // Ensure orderId is correctly passed
          customerName: user.name, // Add customerName (make sure 'user.name' is available)
          customerEmail: user.email, // Add customerEmail (make sure 'user.email' is available)
          orders: itemsWithPrice,
          totalPrice,
        };

        // Send confirmation email
        return axios.post(
          `${import.meta.env.VITE_SERVER_URL}/email/send-order-confirmation`,
          emailData
        );
      })
      .then(() => {
        toast.success("Order placed successfully!");
        return { success: true }; // Return success status
      })
      .catch((error) => {
        toast.error("Someone got your order! Order not placed.");
        console.error(
          "Error in processing the order:",
          error.response?.data || error.message
        );
        return { success: false, error: error.message }; // Return failure status with error message
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //admin function for deleting items
  const handleDeleteItem = async (removeID) => {
    if (removeID > 0) {
      try {
        setdeletebut(false);
        setdeleteloading(true);
        await api.delete(`food/${removeID}?idToken=${AdmingetUserData()}`);
        setdeleteloading(false);
        setdeletebut(true);
        toast.success("Food deleted");
        setMenuItems((prevItems) => {
          const updatedItems = prevItems.filter((item) => item.id !== removeID);
          return updatedItems;
        });
      } catch (error) {
        console.log(error.message);
        setdeleteloading(false);
        setdeletebut(true);
        toast.error("somthing went wrong");
      }
    }
  };
  const [isAuthenticateddummy, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isAunthenticated()) {
        setIsAuthenticated(true);
        try {
          const response = await getuserdetails();
          setUser({
            name: response.data.users[0].displayName,
            email: response.data.users[0].email,
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <DataContextUser.Provider
      value={{
        handleDeleteItem,
        menuItems,
        setMenuItems,
        searchItems,
        setSearchValue,
        cartItems,
        filter,
        setFilter,
        itemID,
        setItemID,
        isLoading,
        removeID,
        setRemoveID,
        err,
        totalPrice,
        incID,
        setIncID,
        decID,
        setDecID,
        order,
        user,
        setUser,
        setIsAuthenticated,
        isAuthenticateddummy,
        loading,
        setLoading,
        confirmbut,
        setConfirmbut,
        deleteloading,
        setdeleteloading,
        confirmorder,
        setconfirmorder,
        setFoodCategory,
        foodCategory,
        setdeletebut,
        deletebut,
        setcancel,
        cancel,
        addItemToServer,
        removeItemFromServer,
        incToServer,
        decToServer,
        img,
        img1,
        img2,
        img3,
        video,
      }}
    >
      {children}
    </DataContextUser.Provider>
  );
};

export default DataContextUser;
