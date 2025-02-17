import React, { useState, useEffect, useContext } from "react";
import DataContextUser from "../../Context/DataContextUser";

const AdminMenuBanner = () => {
  const { img1, img2, img3, video } = useContext(DataContextUser);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0); // Start position for touch
  const [isDragging, setIsDragging] = useState(false); // To detect dragging state
  const mediaFiles = [
    { type: "image", src: img1 },
    { type: "image", src: img2 },
    { type: "image", src: img3 },
    { type: "video", src: video },
  ];
  const active = "bg-black";
  const inActive = "bg-gray-300";

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaFiles.length);
      }
    }, 3500);

    return () => clearInterval(intervalId);
  }, [mediaFiles.length, isDragging]);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    const touchDelta = e.touches[0].clientX - startX;
    if (Math.abs(touchDelta) > 50) {
      if (touchDelta > 0) {
        // Swipe right
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? mediaFiles.length - 1 : prevIndex - 1
        );
      } else {
        // Swipe left
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaFiles.length);
      }
      setIsDragging(false); // Prevent further updates until touch ends
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative mx-auto px-10 md:px-0 rounded-sm lg:rounded-lg aspect-[4/1] my-8 md:my-20 container overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {mediaFiles.map((media, index) => (
          <div
            key={index}
            className="w-full h-full px-2 flex-shrink-0 rounded-lg overflow-hidden"
            style={{ flexBasis: "100%" }}
          >
            {media.type === "image" ? (
              <img
                src={media.src}
                alt={`banner-${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <video
                src={media.src}
                className="w-full h-full object-cover rounded-lg"
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
            )}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {mediaFiles.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentIndex ? active : inActive
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Edit Button */}
      {/* <div className="absolute bottom-2 md:bottom-4 right-9 transform -translate-x-1/2 flex space-x-2 bg-customGray p-1 lg:p-2 items-center justify-center rounded-sm lg:rounded-md border-1 border-black">
        <button onClick={() => setBannerPopupVisible(true)}>
          <FaEdit className="text-xl lg:text-2xl text-white bg-customGray" />
        </button>
      </div> */}

      {/* Banner Popup */}
      {/* <Popup trigger={isBannerPopupVisible} onClose={handleClosePopup}>
        <div className="flex-col justify-center border p-3 border-customLightGray4 shadow-customLightGray4 shadow-md">
          <p className="text-center font-bold text-4xl py-5">UPDATE BANNER</p>
          <form className="flex flex-col gap-3 mt-4 justify-center items-center">
            {["banner1", "banner2", "banner3", "banner4"].map(
              (bannerKey, index) => (
                <div
                  key={bannerKey}
                  className="flex justify-center items-center gap-2"
                >
                  <p>{`Banner ${index + 1} :`}</p>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={(event) => handleFileChange(event, bannerKey)}
                    className={`p-2 border rounded hover:border-black ${getBorderColor(
                      bannerKey
                    )}`}
                  />
                </div>
              )
            )}
          </form>
          <div className="flex justify-center mt-4">
            <button className="text-xl bg-slate-950 text-white w-32 h-10 rounded-sm hover:bg-customGray">
              Update
            </button>
          </div>
        </div>
      </Popup> */}
    </div>
  );
};

export default AdminMenuBanner;
