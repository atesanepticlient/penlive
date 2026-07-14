"use client";
import React, { useEffect, useState } from "react";
import { GameCardWithProvider } from "./games/GameCards";
import GameSelectionHeader from "./GameSelectionHeader";
import { useGames } from "@/lib/store.zustond";
import GameLoader from "./loader/GameLoader";

const HotGames = () => {
  const [gamesList, setGamesList] = useState<any[]>([]); // State to store hot games
  const { getCustomeCategoriesGames } = useGames((state) => state);

  // Fetch hot games using the getCustomeCategoriesGames function
  useEffect(() => {
    const fetchHotGames = () => {
      const hotGames = getCustomeCategoriesGames("hot");
      console.log("Hot games fetched:", hotGames);
      if (hotGames) {
        setGamesList(hotGames);
      }
    };

    fetchHotGames();
  }, [getCustomeCategoriesGames]);

  const handleRightButtonClick = () => {
    gamesContainer.current!.scrollLeft += 130;
  };

  const handleLeftButtonClick = () => {
    gamesContainer.current!.scrollLeft -= 130;
  };

  const gamesContainer = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className="my-4">
      {/* Game Selection Header */}
      <GameSelectionHeader
        title="Hot Games"
        leftAction={handleLeftButtonClick} // left button action for scrolling
        rightAction={handleRightButtonClick} // right button action for scrolling
        seeMoreLink="/hot-games" // Adjust link if necessary
      />

      {/* Games list display */}
      <div
        className="max-w-full w-full overflow-x-auto scrollbar-none scroll-smooth"
        ref={gamesContainer}
      >
        <div className="hot-games-list">
          {/* {gamesList?.length > 0 ? (
            gamesList.map((game, i) => (
              <GameCardWithProvider key={i} game={game} />
            ))
          ) : (
            <GameLoader lenght={20} loading={true} />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default HotGames;
