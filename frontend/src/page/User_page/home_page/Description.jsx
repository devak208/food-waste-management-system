import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DataContextUser from "../../Context/DataContextUser";
import DataContextAdmin from "../../Context/DataContextAdmin";

const Description = () => {
  const { cartItems, isLoading, err } = useContext(DataContextUser);
  const { currentPhase } = useContext(DataContextAdmin);

  const cartCount = cartItems.length;
  const cartLoad = false;
  return (
    <div className="totalDiv">
      <div className="container my-10 p-4 lg:p-2">
        <p className="text-sm lg:text-xl tracking-normal leading-relaxed text-gray-700">
          Discover the comforting flavors of our food, crafted with love and
          care. Our dishes are prepared using fresh, high-quality ingredients to
          bring you the taste of home-cooked meals right to your doorstep.
          Perfect for any occasion, our menu offers a variety of options to
          satisfy every palate.
        </p>

        {/* Cart symbol */}
        {currentPhase === "closes" &&
          !isLoading &&
          err === null &&
           (
            <>
              {!cartLoad ? (
                <div>
                  <Link to={"cart-page"}>
                    {cartCount > 9 ? (
                      <div className="flex items-center justify-center fixed right-7 bottom-7 md:right-11 md:bottom-11 z-20">
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 50 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="50" height="50" rx="25" fill="#334155" />
                          <path
                            d="M19.5236 38C20.286 38 20.904 37.405 20.904 36.671C20.904 35.937 20.286 35.3419 19.5236 35.3419C18.7612 35.3419 18.1432 35.937 18.1432 36.671C18.1432 37.405 18.7612 38 19.5236 38Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M33.4128 38C34.1752 38 34.7932 37.405 34.7932 36.671C34.7932 35.937 34.1752 35.3419 33.4128 35.3419C32.6504 35.3419 32.0323 35.937 32.0323 36.671C32.0323 37.405 32.6504 38 33.4128 38Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11 16.239H15.0028L18.005 32.2855H34.0163"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.1535 28.4649H33.7053C33.8206 28.465 33.9325 28.4268 34.0217 28.3568C34.1109 28.2868 34.1721 28.1894 34.1947 28.0811L35.9903 19.4848C36.0048 19.4154 36.003 19.3439 35.9851 19.2753C35.9673 19.2067 35.9337 19.1428 35.8869 19.0881C35.84 19.0335 35.7811 18.9895 35.7144 18.9593C35.6476 18.929 35.5747 18.9134 35.5009 18.9135H16.1584"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <rect
                            x="18.8193"
                            y="8.5"
                            width="15"
                            height="15"
                            rx="10"
                            fill="white"
                          />
                          <text
                            x="26"
                            y="17"
                            fill="black"
                            fontSize="11"
                            fontWeight="bold"
                            fontFamily="Arial"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                          >
                            {cartCount}
                          </text>
                        </svg>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center fixed right-7 bottom-7 md:right-11 md:bottom-11 z-20">
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 50 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="50" height="50" rx="25" fill="#334155" />
                          <path
                            d="M19.5236 38C20.286 38 20.904 37.405 20.904 36.671C20.904 35.937 20.286 35.3419 19.5236 35.3419C18.7612 35.3419 18.1432 35.937 18.1432 36.671C18.1432 37.405 18.7612 38 19.5236 38Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M33.4128 38C34.1752 38 34.7932 37.405 34.7932 36.671C34.7932 35.937 34.1752 35.3419 33.4128 35.3419C32.6504 35.3419 32.0323 35.937 32.0323 36.671C32.0323 37.405 32.6504 38 33.4128 38Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11 16.239H15.0028L18.005 32.2855H34.0163"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.1535 28.4649H33.7053C33.8206 28.465 33.9325 28.4268 34.0217 28.3568C34.1109 28.2868 34.1721 28.1894 34.1947 28.0811L35.9903 19.4848C36.0048 19.4154 36.003 19.3439 35.9851 19.2753C35.9673 19.2067 35.9337 19.1428 35.8869 19.0881C35.84 19.0335 35.7811 18.9895 35.7144 18.9593C35.6476 18.929 35.5747 18.9134 35.5009 18.9135H16.1584"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <rect
                            x="18.8193"
                            y="8.5"
                            width="15"
                            height="15"
                            rx="10"
                            fill="white"
                          />
                          <text
                            x="26"
                            y="17"
                            fill="black"
                            fontSize="13"
                            fontWeight="bold"
                            fontFamily="Arial"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                          >
                            {cartCount}
                          </text>
                        </svg>
                      </div>
                    )}
                  </Link>
                </div>
              ) : (
                <div className="flex bg-slate-700 p-5 rounded-full items-center justify-center fixed right-7 bottom-7 md:right-11 md:bottom-11 z-20">
                  <svg
                    className="h-5 animate-spin stroke-black text-center"
                    viewBox="0 0 256 256"
                  >
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      strokeWidth="19"
                      stroke="white"
                      fill="none"
                      strokeDasharray="314"
                      strokeDashoffset="0"
                    ></circle>
                  </svg>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
};

export default Description;
