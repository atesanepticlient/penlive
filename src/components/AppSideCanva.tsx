"use client";
import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";

import {  PlatformSidebar } from "./SideNav";

interface AppSideCanvaProps {
  trigger: React.ReactNode;
}

const AppSideCanva = ({ trigger }: AppSideCanvaProps) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <button
        onClick={toggleDrawer(true)}
        className=""
        style={{
          background: "transparent",
          border: "none",
        }}
      >
        {trigger}
      </button>

      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        className="z-[1001]"
        PaperProps={{
          sx: {
            width: 300,

            // 🔥 BLACK BASE
            background: "#111111",
            color: "#E5E5E5",

            // ✨ GOLD ACCENT BORDER
            borderRight: "1px solid rgba(212,175,55,0.3)",

            // DEPTH
            boxShadow: "4px 0 20px rgba(0,0,0,0.6)",

            // Smooth feel
            transition: "all 0.3s ease",
          },
        }}
      >
        {/* <SideNav /> */}

        <PlatformSidebar />
      </Drawer>
    </>
  );
};

export default AppSideCanva;
