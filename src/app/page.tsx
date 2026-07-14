// import AnnouncementModal from "@/components/announcement-modal";
import Header from "@/components/Header";
import Highlight from "@/components/hightlights/highlight-slider";
import HomeApp from "@/components/HomeApp";
import SideNavLayout from "@/components/SideNavLayout";
import TabLayout from "@/components/TabLayout";

import InitialNotificationLeader from "./initial-notification-leader";
import FooterPlatform from "@/components/FooterPlatform";

export default function Home() {
  return (
    <SideNavLayout>
      <TabLayout>
        <Header />
        <HomeApp />
        {/* <Footer /> */}
        <FooterPlatform />
        {/* <AnnouncementModal /> */}
        <Highlight />
        {/* <AutoRawardLoader /> */}
        <InitialNotificationLeader />
      </TabLayout>
      {/* <Envelop /> */}
      {/* <EggHunt /> */}
    </SideNavLayout>
  );
}
