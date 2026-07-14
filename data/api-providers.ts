import spribe from "@/../public/games/provider/SPB-BLACK.png";
import spribeWh from "@/../public/games/provider/SPB-WHITE.png";
import jili from "@/../public/games/provider/JL-BLACK.png";
import jiliWh from "@/../public/games/provider/JL.png";
import jdb from "@/../public/games/provider/JDB-BLACK.png";
import jdbWh from "@/../public/games/provider/JDB-WHITE.png";
import pg from "@/../public/games/provider/PG-BLACK.png";
import pgWh from "@/../public/games/provider/PG-WHITE.png";
import playtech from "@/../public/games/provider/PT-BLACK.png";
import playtechWh from "@/../public/games/provider/PT-WHITE.png";
import pragmatic from "@/../public/games/provider/PP-BLACK.png";
import pragmaticWh from "@/../public/games/provider/PP-WHITE.png";
import evo from "@/../public/games/provider/EVO-BLACK.png";
import evoWh from "@/../public/games/provider/EG4-WHITE.png";
import fachi from "@/../public/games/provider/FC-BLACK.png";
import fachiWh from "@/../public/games/provider/FC-WHITE.png";
import joker from "@/../public/games/provider/JK-BLACK.png";
import jokerWh from "@/../public/games/provider/JK-WHITE.png";
import sagaming from "@/../public/games/provider/SG-BLACK.png";
import sagamingWh from "@/../public/games/provider/SG-WHITE.png";
import netent from "@/../public/games/provider/NE-BLACK.png";
import netentWh from "@/../public/games/provider/NE-WHITE.png";
import redtiger from "@/../public/games/provider/RT-BLACK.png";
import redtigerWh from "@/../public/games/provider/RT-WHITE.png";
import dereamgaming from "@/../public/games/provider/DREAM-BLACK.png";
import dereamgamingWH from "@/../public/games/provider/DRAGOON-WHITE.png";
import biggaming from "@/../public/games/provider/BIG-GAMING.png";
import simpleplay from "@/../public/games/provider/SIMPLE-PLAY-BLACK.png";
import simpleplayWh from "@/../public/games/provider/SIMPLE-PLAY-WHITE.png";
import cq9 from "@/../public/games/provider/CQ9-BLACK.png";
import cq9Wh from "@/../public/games/provider/CQ9-WHITE.png";
import booming from "@/../public/games/provider/BOOMING-BLACK.png";
import boomingWh from "@/../public/games/provider/BOOMING.png";
import wow from "@/../public/games/provider/WOW-BLACK.png";
import wowWh from "@/../public/games/provider/WOW-WHITE.png";
import bigpot from "@/../public/games/provider/BIG-GAMING.png";
import amigo from "@/../public/games/provider/AMG-BLACK.png";
import amigoWh from "@/../public/games/provider/AMG-WHITE.png";
import dragoon from "@/../public/games/provider/DRAGOON-BLACK.png";
import dragoonWh from "@/../public/games/provider/DRAGOON-WHITE.png";
import g5 from "@/../public/games/provider/5G-BLACK.png";
import g5Wh from "@/../public/games/provider/5G-COLOR.png";
import bng from "@/../public/games/provider/BNG-BLACK.png";
import bngWh from "@/../public/games/provider/BNG-WHITE.png";
import evoplay from "@/../public/games/provider/EP-BLACK.png";
import evoplayWh from "@/../public/games/provider/EP-WHITE.png";
import spadegaming from "@/../public/games/provider/SA-GAMING-BLACK.png";
import spadegamingWh from "@/../public/games/provider/SA-GAMING-WHITE.png";
import novomatic from "@/../public/games/provider/NOVOMATIC-BLACK.png";
import mrsloty from "@/../public/games/provider/MRSLOTY.png";
export enum GAME_TYPE {
  SLOT,
  LIVE_CASINO,
  FISHING,
  COCK_FIGHTING,
  OTHERS,
  POKER,
}
export const providers: {
  name: string;
  image: any;
  imageWh: any;
  product_code: string | number;
  gameType?: GAME_TYPE[];
}[] = [
  // --- First Order (Priority Providers) ---
  {
    name: "Spribe",
    image: spribe,
    imageWh: spribeWh,
    product_code: 1138,
  },
  {
    name: "Jili",
    image: jili,
    imageWh: jiliWh,
    product_code: 1091,
  },
  {
    name: "JDB",
    image: jdb,
    imageWh: jdbWh,
    product_code: 1085,
  },
  {
    name: "PG Soft",
    image: pg,
    imageWh: pgWh,
    product_code: 1007,
  },
  {
    name: "PLAYTECH",
    image: playtech,
    imageWh: playtechWh,
    product_code: 1242,
  },
  {
    name: "PragmaticPlay",
    image: pragmatic,
    imageWh: pragmaticWh,
    product_code: 1006,
  },
  {
    name: "SA Gaming",
    image: sagaming,
    imageWh: sagamingWh,
    product_code: 1185,
  },
  {
    name: "PNG",
    image: "",
    imageWh: "",
    product_code: 1273,
    gameType: [
      GAME_TYPE.COCK_FIGHTING,
      GAME_TYPE.FISHING,
      GAME_TYPE.LIVE_CASINO,
      GAME_TYPE.POKER,
    ],
  },
  {
    name: "Evolution",
    image: evo,
    imageWh: evoWh,
    product_code: 1002,
  },
  {
    name: "Fachai",
    image: fachi,
    imageWh: fachiWh,
    product_code: 1079,
  },
  {
    name: "Joker",
    image: joker,
    imageWh: jokerWh,
    product_code: 1225,
  },

  // --- Remaining Providers ---
  {
    name: "Evolution (Netent)",
    image: netent,
    imageWh: netentWh,
    product_code: 1168,
  },
  {
    name: "Evolution (RedTiger)",
    image: redtiger,
    imageWh: redtigerWh,
    product_code: 1169,
  },
  {
    name: "Dream Gaming",
    image: dereamgaming,
    imageWh: dereamgamingWH, // Using imported dereamgamingWH
    product_code: 1052,
  },
  {
    name: "BigGaming",
    image: biggaming,
    imageWh: biggaming, // No white version imported
    product_code: 1004,
  },
  {
    name: "Simple Play",
    image: simpleplay,
    imageWh: simpleplayWh,
    product_code: 1231,
  },
  {
    name: "CQ9",
    image: cq9,
    imageWh: cq9Wh,
    product_code: 1009,
  },
  {
    name: "MrSlotty",
    image: mrsloty,
    imageWh: mrsloty, // No white version imported
    product_code: 1064,
  },
  {
    name: "BoomingGames",
    image: booming,
    imageWh: boomingWh,
    product_code: 1115,
  },
  {
    name: "WOW GAMING",
    image: wow,
    imageWh: wowWh,
    product_code: 1148,
  },
  {
    name: "BIGPOT",
    image: bigpot,
    imageWh: bigpot, // No white version imported
    product_code: 1154,
  },
  {
    name: "N2",
    image: novomatic,
    imageWh: novomatic, // No white version imported
    product_code: 1163,
  },
  {
    name: "AmigoGaming",
    image: amigo,
    imageWh: amigoWh,
    product_code: 1192,
  },
  {
    name: "DRAGOON SOFT",
    image: dragoon,
    imageWh: dragoonWh,
    product_code: 1255,
  },
  {
    name: "5G",
    image: g5,
    imageWh: g5Wh,
    product_code: 1259,
  },
  {
    name: "BNG",
    image: bng,
    imageWh: bngWh,
    product_code: 1262,
  },
  {
    name: "Yfg",
    image: evoplay,
    imageWh: evoplayWh,
    product_code: 1274,
  },
  {
    name: "SpadeGaming",

    image: spadegaming,
    imageWh: spadegamingWh,
    product_code: 1221,
  },
];
