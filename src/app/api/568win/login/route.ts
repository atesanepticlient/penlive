import { INTERNAL_SERVER_ERROR } from "@/error";
import { loginGames } from "@/lib/player";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { username, gpid, gameid } = await req.json();
    const url = await loginGames(username, gpid, gameid);

    return Response.json({ success: true, payload: { url } }, { status: 200 });
  } catch  {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
