import React from "react";
import TabNav from "./TabNav";
import TabNavPlatform from "./TabNavPlatform";

interface TabLayoutProps {
  children: React.ReactNode;
}
const TabLayout = ({ children }: TabLayoutProps) => {
  const variant = "PLATFORM";
  return (
    <main>
      {children}
      {variant != "PLATFORM" && <TabNav />}
      {variant == "PLATFORM" && <TabNavPlatform />}
    </main>
  );
};

export default TabLayout;
