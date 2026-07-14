import allgames from "@/../data/games.json";
import hotGames from "@/../data/hot-games.json";
import pockerGames from "@/../data/pocket-games.json";
import liveGames from "@/../data/live-games.json";
import fishGames from "@/../data/fish-games.json";
import jakpotGames from "@/../data/jacpot-games.json";

export const getSlotsGamesList = ({
  product_code = "",
  nameSearch = "",
  limit = 21,
}: {
  product_code?: string | number;
  nameSearch?: string;
  limit?: number;
}) => {
  console.log({ product_code, nameSearch });
  const games = [];

  let i = 0;
  const gamesData = allgames as any;
  const list = gamesData.list;
  const nameRegex = new RegExp("^" + nameSearch, "i");
  const productCodeRegex = product_code
    ? new RegExp("^" + product_code + "$", "i")
    : /.*/;
  const avoidGamesType = [
    "LIVE_CASINO",
    "FISHING",
    "LOTTERY",
    "POKER",
    "SPORT_BOOK ",
  ];
  while (i < list.length) {
    if (games.length >= limit) {
      break;
    }
    if (
      productCodeRegex.test(list[i].product_code) &&
      nameRegex.test(list[i].game_name) &&
      !avoidGamesType.includes(list[i].game_type)
    ) {
      games.push(list[i]);
    }
    i += 1;
  }

  return games;
};

export const getHotGames = ({
  nameSearch = "",
  limit = 21,
}: {
  nameSearch?: string;
  limit?: number;
}) => {
  const list = hotGames?.list;
  const nameRegex = new RegExp("^" + nameSearch, "i");
  const games = [];
  let i = 0;
  while (i < list.length) {
    if (games.length >= limit) {
      break;
    }
    if (nameRegex.test(list[i].game_name)) {
      games.push(list[i]);
    }
    i = i + 1;
  }
  return games;
};

export const getPockerGames = ({
  nameSearch = "",
  limit = 21,
}: {
  nameSearch?: string;
  limit?: number;
}) => {
  const list = pockerGames?.list;

  const nameRegex = new RegExp("^" + nameSearch, "i");
  const games = [];
  let i = 0;
  while (i < list.length) {
    if (games.length >= limit) {
      break;
    }
    if (nameRegex.test(list[i].game_name)) {
      games.push(list[i]);
    }
    i = i + 1;
  }

  return games;
};

export const getLiveGames = ({
  nameSearch = "",
  limit = 21,
}: {
  nameSearch?: string;
  limit?: number;
}) => {
  const list = liveGames?.list;

  const nameRegex = new RegExp("^" + nameSearch, "i");
  const games = [];
  let i = 0;
  while (i < list.length) {
    if (games.length >= limit) {
      break;
    }
    if (nameRegex.test(list[i].game_name)) {
      games.push(list[i]);
    }
    i = i + 1;
  }
  return games;
};
export const getFishGames = ({
  nameSearch = "",
  limit = 21,
}: {
  nameSearch?: string;
  limit?: number;
}) => {
  const list = fishGames?.list;

  const nameRegex = new RegExp("^" + nameSearch, "i");
  const games = [];
  let i = 0;
  while (i < list.length) {
    if (games.length >= limit) {
      break;
    }
    if (nameRegex.test(list[i].game_name)) {
      games.push(list[i]);
    }
    i = i + 1;
  }
  return games;
};

export const getJackpotGames = ({
  nameSearch = "",
  limit = 21,
}: {
  nameSearch?: string;
  limit?: number;
}) => {
  const list = jakpotGames?.list;

  const nameRegex = new RegExp("^" + nameSearch, "i");
  const games = [];
  let i = 0;
  while (i < list.length) {
    if (games.length >= limit) {
      break;
    }
    if (nameRegex.test(list[i].game_name)) {
      games.push(list[i]);
    }
    i = i + 1;
  }
  return games;
};
