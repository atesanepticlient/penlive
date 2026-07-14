import React from "react";
// import SideNav from "./SideNav";

const SideNavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start ">
      <div className="w-full ">{children}</div>
    </div>
  );
};

export default SideNavLayout;
