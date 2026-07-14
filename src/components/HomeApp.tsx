import React from "react";
import AppNotice from "./AppNotice";
import AppMenuItems from "./AppMenuItems";
import SlotGames from "./SlotsGames";
import WithdrawDepositButton from "./WithdrawDepositButton";
import EliteCarousel from "./Carousel";
import PromoStrip from "./home-invite-banner.";
import LiveGames from "./LiveGames";
import FishGames from "./FishGames";
import PockerGames from "./PockerGames";
import Jakpot from "./jakpot";

const HomeApp = () => {
  return (
    <div className=" platform-bg ">
      <AppNotice />

      {/* <HeroSlider /> */}
      <EliteCarousel />
      <WithdrawDepositButton />
      <AppMenuItems />
      {/* <VipBanner /> */}
      {/* <HotGames /> */}
      <SlotGames />
      <Jakpot />
      <LiveGames />
      <PromoStrip />
      <FishGames />
      <PockerGames />

      {/* <ESports /> */}
      {/* <Sports /> */}
      {/* <LiveCasino /> */}
    </div>
  );
};

export default HomeApp;
