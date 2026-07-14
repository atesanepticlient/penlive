import { findCurrentUser } from "@/data/user";
import React from "react";

const AirDropPage = async () => {
  const user = await findCurrentUser();
  if(user){
    return 
  }
  return <div>AirDropPage</div>;
};

export default AirDropPage;
