import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const user = await findCurrentUser();

    if (!user)
      return Response.json({ error: "Refresh the page" }, { status: 401 });

    const requirements = await db.inviataionRewardRequirements.findFirst({
      where: {},
    });

   

    return Response.json({ payload: { requirements } }, { status: 200 });
  } catch  {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
