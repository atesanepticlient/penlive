/* eslint-disable @typescript-eslint/no-explicit-any */
import { INTERNAL_SERVER_ERROR } from "@/error";
import axios from "axios";

export const GET = async () => {
  try {
    const bodyContent = {
      CompanyKey: "F4D8A3106EA44C5D969D0AAE0B472762",
      ServerId: "mbuzz881234",
      IsGetAll: true,
    };

    const reqOptions = {
      url: `${process.env.NEXT_PUBLIC_568WIN_BASE_URL}/web-root/restricted/information/get-game-list.aspx`,
      method: "POST",
      data: bodyContent,
    };
    let gamesList;
    try {
      const response = await axios.request(reqOptions);
      if (response.data.error != 0) {
        gamesList = null;
      }
      gamesList = response.data?.seamlessGameProviderGames;
      console.log("Games list from route : ", response.data);
    } catch  {
      gamesList = null;
    }

    return Response.json({
      success: true,
      gamesList,
    });
  } catch (error) {
    console.log("ERROR API ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
