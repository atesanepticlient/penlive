"use client";
import React from "react";
import { IoCloseCircle } from "react-icons/io5";

const RewardModal = ({ show, onClose, reward }) => {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    if (show) setIsReady(false); // reset when opened
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={`z-[2000] fixed inset-0 w-full h-screen flex justify-center transition-colors duration-300
      bg-[#000000c4]`}
    >
      <div className="mt-60 flex justify-center relative">
        {/* Animated main card */}
        <div
          className="reward-modal-bg w-[400px] h-[300px] mx-auto relative"
          onAnimationEnd={() => setIsReady(true)}
        >
          {/* Your background image/color for the card */}
          {/* Example: */}
          {/* <Image src="/reward-bg.png" fill className="object-contain" alt="Reward" /> */}

          <div className="top-[36%] left-1/2 -translate-x-1/2 absolute">
            <h2
              className="
                text-5xl md:text-6xl font-extrabold tracking-wide
                bg-gradient-to-b from-[#FFFFFF] from-5% via-[#FFD700] via-40% to-[#B87333] to-90%
                bg-clip-text text-transparent
                transform perspective-500 -rotate-x-2
              "
              style={{
                WebkitTextStroke: "1.5px #4a2c01",
                paintOrder: "stroke fill",
                filter: `
                  drop-shadow(0 1px 0 #4a2c01)
                 
                `,
                fontFamily: '"Hind Siliguri", sans-serif',
              }}
            >
              {reward}৳
            </h2>
          </div>
        </div>

        {/* Close button only visible after intro animation */}
        {isReady && (
          <button
            onClick={onClose}
            className="text-white text-2xl absolute right-20 top-10 md:top-0"
          >
            <IoCloseCircle />
          </button>
        )}
      </div>
    </div>
  );
};

export default RewardModal;
