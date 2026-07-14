"use client";
import emptyTicketsIcon from "@/../public/bonus-cards/tickets.png";
import SiteHeader from "@/components/SiteHeader";
import useCurrentUser from "@/hook/useCurrentUser";
import Image from "next/image";

export default function PromoPage() {
  const user: any = useCurrentUser();
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Section */}
      <SiteHeader title="Promot code" />
      <div className="promo-code-profile w-full  relative ">
        {/* Profile */}
        <div className="flex items-center gap-4 px-6 pt-8">
          <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden">
            <img
              src="https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-white">
            <p className="text-lg font-semibold">{user?.phone}</p>
            <p className="text-2xl font-bold">৳ {user?.wallet?.balance}</p>
          </div>
        </div>
      </div>

      {/* Promo Input */}

      <div className="px-4 mt-4">
        <div className="flex bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-inner focus-within:ring-2 focus-within:ring-teal-300 transition">
          <input
            type="text"
            placeholder="Fill in your promo code"
            className="flex-1 px-4 py-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          />

          <button className="px-6 bg-gray-200 text-gray-500 font-semibold">
            Redeem
          </button>
        </div>
      </div>

      {/* Promo List */}
      <div className="text-center mt-10 px-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">
          Promo Code List
        </h2>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center">
          <Image
            src={emptyTicketsIcon}
            alt="empty"
            className="w-40 mb-4 opacity-50"
          />
          <p className="text-gray-500 text-sm">
            No promotion code is currently available.
          </p>
        </div>
      </div>
    </div>
  );
}
