import React, { FC, InputHTMLAttributes } from "react";

const PrimaryInput: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <input
      {...props}
      className={`
        h-[58px]
        w-full
        rounded-2xl
     
        bg-white
        px-5
        text-violet-950
        outline-none
        backdrop-blur-xl
        transition-all
        duration-300
        placeholder:text-gray-500
        placeholder:font-bold
        shadow-lg
        focus:border-voilet-500/50
        focus:ring-0
        ${className}
      `}
    />
  );
};

export default PrimaryInput;
