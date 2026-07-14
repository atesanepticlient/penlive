"use client";
import { useRouter } from "next/navigation";
import React from "react";
// const CrownIcon = () => (
//   <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
//     <path
//       d="M2 18L5 6L10 12L14 2L18 12L23 6L26 18H2Z"
//       fill="#C9A84C"
//       fillOpacity="0.4"
//     />
//     <path
//       d="M2 18L5 6L10 12L14 2L18 12L23 6L26 18H2Z"
//       stroke="#F0D080"
//       strokeWidth="1.3"
//       strokeLinejoin="round"
//     />
//     <path
//       d="M1 18H27"
//       stroke="#F0D080"
//       strokeWidth="1.6"
//       strokeLinecap="round"
//     />
//     <circle cx="14" cy="2" r="2" fill="#F0D080" />
//     <circle cx="5" cy="6" r="1.5" fill="#C9A84C" />
//     <circle cx="23" cy="6" r="1.5" fill="#C9A84C" />
//   </svg>
// );
const SiteHeader = ({
  children,
  title,
}: {
  children?: React.ReactNode;
  title: string;
  des?: string;
}) => {
  const router = useRouter();

  return (
    <div className="top-0 left-0 bg-[linear-gradient(180deg,#4f46e5_0%,#4c1d95_100%)] shadow-sm sticky z-50 flex justify-between items-center overflow-hidden px-5 py-4 border-b ">
      {/* diagonal pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #C9A84C 0px, #C9A84C 1px, transparent 1px, transparent 24px)",
        }}
      />

      <div className="relative flex items-center gap-3 mt-1 flex-1 ">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-lg text-white flex items-center cursor-pointer justify-center active:scale-95 transition-transform"
        >
          <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 11L5 7L9 3"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h1 className="text-lg  text-white font-bold text-center  flex-1 ">
          {title}
        </h1>
        {/* <p className="text-[13px] text-gray-50 mt-0.5">
            {des}
          </p> */}
      </div>

      <div className="flex gap-4">{children}</div>
    </div>
  );
};

export default SiteHeader;
