import { findCurrentUser } from "@/data/user";
import React from "react";
import Intro from "./intro";
import Claim from "./claim";

const AirDropPage = async () => {
  const user = await findCurrentUser();
  if (!user) {
    return <Intro />;
  }
  return <Claim />;
};

export default AirDropPage;
