import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DataContextUser from "../../Context/DataContextUser";

const Image = () => {
  const { img } = useContext(DataContextUser);
  return (
    <>
      {/* PC VIEW */}
      <div className="h-96 w-full mt-0 md:my-10 basis-1/2 lg:basis-2/5 ml-0 lg:ml-32 relative hidden lg:flex items-center justify-center ">
        <div
          className="img"
          style={{ transform: "translate(35px, -35px)", zIndex: 0 }}
        ></div>
        <Link
          to={"/desired-path"}
          className="img bg-cover bg-center"
          style={{
            transform: "translate(0px, 0px)",
            zIndex: 1,
          }}
        >
          <video
            src={img}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controls={false}
            onContextMenu={(e) => e.preventDefault()}
            onPlay={(e) => {
              e.target.muted = true;
            }}
          />
        </Link>
        <div
          className="img"
          style={{ transform: "translate(-35px, 35px)", zIndex: 0 }}
        ></div>
      </div>

      {/* MOBILE VIEW */}
      <div className="flex lg:hidden justify-center items-center">
        <div className="flex md:left-5 sm:left-10 left-5 relative w-64 h-64 sm:w-72 sm:h-72 mt-10 justify-center items-center">
          <div
            className="img"
            style={{ transform: "translate(35px, -35px)", zIndex: 0 }}
          ></div>
          <Link
            to={"/desired-path"}
            className="img bg-cover bg-center"
            style={{
              transform: "translate(0px, 0px)",
              zIndex: 1,
            }}
          >
            <video
              src={img}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controls={false}
              onContextMenu={(e) => e.preventDefault()}
              onPlay={(e) => {
                e.target.muted = true;
              }}
            />
          </Link>
          <div
            className="img"
            style={{ transform: "translate(-35px, 35px)", zIndex: 0 }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Image;
