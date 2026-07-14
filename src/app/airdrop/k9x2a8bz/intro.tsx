"use client";
import Image from "next/image";
import React from "react";

import introImage from "@/../public/airdrop/registration/intro.png";
import { redirect } from "next/navigation";
import ImageMap from "../image-map";
import BackButton from "../back-button";

const Intro = () => {
  const handleClick = () => {
    redirect("/login");
  };
  return (
    <div className="h-screen flex justify-center">
      <ImageMap x="25%" y="80%" onClick={handleClick}>
        <Image
          src={introImage}
          alt="New User Bonus"
          className="w-full h-full md:w-[60%] lg:w-[50%]"
        />
      </ImageMap>

      <div className=" top-6 left-6 absolute">
        <BackButton />
      </div>
    </div>
  );
};

export default Intro;
