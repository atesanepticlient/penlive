/* eslint-disable @typescript-eslint/no-explicit-any */
import { INTERNAL_SERVER_ERROR } from "@/error";
import axios from "axios";

type GameInfo = { 
  language?: string; 
  gameName?: string; 
  gameIconUrl?: string; 
};

type NewProvGame = {
  gameProviderId: number; // <- gpid
  gameID: number; 
  gameType:number;        // <- gameId
  provider: string;
  gameInfos?: GameInfo[]; // Optional, may contain multiple game info objects for different languages
  device?: string;        // Optional: device type (e.g., "mobile", "desktop")
  categories?: string;    // Optional: game categories
  bm?: string;            // Optional: some game-related boolean value as a string
  demo?: string;          // Optional: some game-related demo setting as a string
  rewriterule?: string;   
  exitButton?: string;    
};

const getGameCategory = (categoryId: number): string => {
  // Create a mapping of category numbers to category names
  const gameCategories: Record<number, string> = {
    0:'Unknown',
    1: 'Live Casino',
    2: 'slots',
    3: 'Table Games',
    4: 'Scratchcards',
    5: 'Hi-Lo&Number',
    6: 'Fishing&Arcade',
    7: 'Virtual Games',
    8: 'Other Games',
    9: 'Lobby',
    10: 'SportsBook',
    // Add more mappings as needed
  };

  // Return the category name for the provided number
  return gameCategories[categoryId]; 
};


const mapToGamesList = (items: NewProvGame[]) => {   
  // Create an object to store the games grouped by provider
  const out: Record<string, Array<{ id: string; name: string; img: string; device: string; title: string; categories: string; bm: string; demo: string; rewriterule: string; exitButton: string }>> = {};    

  for (const g of items) {     
    // const gpid = String(g.gameProviderId);  // Game provider ID as string
    const gid = String(g.gameID);  // Game ID as string

    // Find the English game information if available
    const info = g.gameInfos?.find(x => x.language?.toLowerCase().startsWith("en")) ?? g.gameInfos?.[0];

    // Prepare the game object with all relevant details, including missing properties
    const game = {
      id: gid,
      name: info?.gameName ?? gid,
      img: info?.gameIconUrl ?? "",
      device: g.device ?? "",  // Add device (default to empty string if missing)
      title: g.provider ?? "Unknown Provider", // Add title (provider name)
      categories: getGameCategory(g.gameType) ?? "",  // Add categories (default to empty string if missing)
      bm: g.bm ?? "0",  // Add bm (default to "0" if missing)
      demo: g.demo ?? "0",  // Add demo (default to "0" if missing)
      rewriterule: g.rewriterule ?? "1",  // Add rewriterule (default to "1" if missing)
      exitButton: g.exitButton ?? "1"  // Add exitButton (default to "1" if missing)
    };

    // Check if this provider already exists in the output object
    if (!out[g.provider]) {
      out[g.provider] = [];
    }

    // Add the game to the provider's list
    out[g.provider].push(game);
  }    

  return out; 
};




export const GET = async () => {
  try {
    const base = process.env.NEWPROV_BASE_URL!;
    const companyKey = process.env.NEWPROV_COMPANY_KEY!;
    const serverId = process.env.NEWPROV_SERVER_ID || `srv-${Date.now().toString(36)}`;
    // const gpIdEnv = process.env.NEWPROV_GP_ID;

    const body ={ CompanyKey: companyKey, ServerId: serverId,"GpId": 1,
  "IsGetAll": true  };

    const { data } = await axios.post(
      `${base}/web-root/restricted/information/get-game-list.aspx`,
      body,
      { headers: { "Content-Type": "application/json" }, timeout: 15000 }
    );

    const items: NewProvGame[] = data?.seamlessGameProviderGames ?? [];
    const gamesListNewProv = mapToGamesList(items);

    return Response.json({ success: true, gamesList: gamesListNewProv });
  } catch (error) {
    console.log("NEWPROV list error:", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
