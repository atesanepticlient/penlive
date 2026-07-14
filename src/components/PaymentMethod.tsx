/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React from "react";
import { FaCircleCheck } from "react-icons/fa6";

interface PaymentMethodsPros {
  method: any;
  selectedPaymentMethod: any;
  onClick: () => void;
}

const PaymentMethod = ({
  method,
  selectedPaymentMethod,
  onClick,
}: PaymentMethodsPros) => {
  return (
    <button
      className={`flex-shrink-0  cursor-pointer whitespace-nowrap`}
      onClick={() => onClick()}
    >
      <div
        className={`w-24 h-24 relative rounded-lg border-2 flex flex-col items-center justify-center p-3 transition-all ${
          selectedPaymentMethod?.name === method.name
            ? "border-[#e11d48] bg-[#fda4ae0f]"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <Image
          src={method.image}
          width={40}
          height={30}
          unoptimized
          alt={method.label}
          className="w-[40px] h-auto"
        />
        <span
          className={`mt-2 text-sm font-medium ${
            selectedPaymentMethod?.name === method.name
              ? "text-[#e11d48]"
              : "text-gray-700"
          }`}
        >
          {method.label}
        </span>

        {selectedPaymentMethod?.name == method.name && (
          <FaCircleCheck className="text-[#e11d48] absolute top-1 right-1" />
        )}
      </div>
    </button>
  );
};

export default PaymentMethod;
