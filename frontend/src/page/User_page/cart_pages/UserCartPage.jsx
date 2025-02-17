import React, { useEffect } from "react";
import Footer from "../home_page/Footer";
import CartProduct from "./CartProduct";

export default function Cartpage() {
  useEffect(() => {
    document.title = "Cart";
    return () => {
      document.title = "SLC Home";
    };
  }, []);

  return (
    <>
      <CartProduct />
      <Footer />
    </>
  );
}
