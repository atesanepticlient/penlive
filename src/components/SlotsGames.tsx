"use client";
import React, { useRef } from "react";

import GameSelectionHeader from "./GameSelectionHeader";

import HomeGameCard from "./games/home-game-card";
import { getHotGames } from "@/lib/games";

const SlotGames = () => {
  const gamesContainer = useRef<HTMLDivElement | null>(null);

  const handleRightButtonClick = () => {
    gamesContainer.current!.scrollLeft += -130;
  };
  const handleLeftButtonClick = () => {
    gamesContainer.current!.scrollLeft += 130;
  };

  const hotGames = getHotGames({ nameSearch: "", limit: 20 });
  if (hotGames)
    return (
      <div
        className="pt-4"
        style={{
          width: "100%",
        }}
      >
        <GameSelectionHeader
          title="Hot Games"
          leftAction={handleLeftButtonClick}
          rightAction={handleRightButtonClick}
          seeMoreLink="/slots"
        />
        <div
          className="max-w-full w-full overflow-x-auto scrollbar-none scroll-smooth"
          ref={gamesContainer}
        >
          <div className="hot-games-list px-3">
            {hotGames.map((game, i) => (
              <HomeGameCard
                key={i}
                label={game.game_name}
                image={game.image_url}
                badge="hot"
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

export default SlotGames;
