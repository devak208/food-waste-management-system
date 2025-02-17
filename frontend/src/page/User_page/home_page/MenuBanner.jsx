import React, { useState, useEffect, useContext } from "react";
import DataContextUser from "../../Context/DataContextUser";

const MenuBanner = () => {
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
      className="relative rounded-lg aspect-[4/1] mt-8 md:mt-10 container overflow-hidden"
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
    </div>
  );
};

export default MenuBanner;
