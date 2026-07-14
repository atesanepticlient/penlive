import SiteHeader from "@/components/SiteHeader";
import React from "react";
import LevelBanner from "./level-banner";
import Rewards from "./rewards";
import Requeirements from "./requeirements";

const VipPage = () => {
  return (
    <div>
      <SiteHeader title="Vip" />
      <div className="px-4 py-3 bg-gray-50 min-h-screen">
        <LevelBanner />
        <Rewards />
        <Requeirements />
      </div>
    </div>
  );
};

export default VipPage;
