"use client";
import React, { useRef } from "react";


import GameSelectionHeader from "./GameSelectionHeader";
import HomeGameCard from "./games/home-game-card";
import { getFishGames } from "@/lib/games";

const FishGames = () => {
  const gamesContainer = useRef<HTMLDivElement | null>(null);

  const handleRightButtonClick = () => {
    gamesContainer.current!.scrollLeft += -130;
  };
  const handleLeftButtonClick = () => {
    gamesContainer.current!.scrollLeft += 130;
  };

  const fishGames = getFishGames({ nameSearch: "", limit: 20 });
  if (fishGames)
    return (
      <div
        className=""
        style={{
          width: "100%",
        }}
      >
        <GameSelectionHeader
          title="Fish"
          leftAction={handleLeftButtonClick}
          rightAction={handleRightButtonClick}
          seeMoreLink="/fish"
        />
        <div
          className="max-w-full w-full overflow-x-auto scrollbar-none scroll-smooth"
          ref={gamesContainer}
        >
          <div className="hot-games-list px-3">
            {fishGames.map((game,i) => (
              <HomeGameCard
              key={i}
                label={game.game_name}
                image={game.image_url}
                product_code={game.product_code}
                game_code={game.game_code}
                game_type={game.game_type}
              />
            ))}
          </div>
        </div>
      </div>
    );
};

export default FishGames;
