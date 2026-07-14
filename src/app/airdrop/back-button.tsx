"use client";
import { IoMdArrowBack } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const [hasHistory, setHasHistory] = useState(true);

  useEffect(() => {
    // Check if there's history
    setHasHistory(window.history.length > 1);
  }, []);

  const handleClick = () => {
    if (hasHistory && window.history.length > 1) {
      router.back();
    } else {
      redirect("/");
    }
  };
  return (
    <button
      onClick={() => handleClick()}
      className="text-sm bg-white flex items-center gap-1.5 p-1"
    >
      <IoMdArrowBack />
      ফিরে যান
    </button>
  );
};

export default BackButton;
