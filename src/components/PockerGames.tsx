"use client";
import React, { useRef } from "react";


import GameSelectionHeader from "./GameSelectionHeader";
import HomeGameCard from "./games/home-game-card";
import { getPockerGames } from "@/lib/games";

const PockerGames = () => {
  const gamesContainer = useRef<HTMLDivElement | null>(null);

  const handleRightButtonClick = () => {
    gamesContainer.current!.scrollLeft += -130;
  };
  const handleLeftButtonClick = () => {
    gamesContainer.current!.scrollLeft += 130;
  };

  const pockerGames = getPockerGames({ nameSearch: "", limit: 20 });
  if (pockerGames)
    return (
      <div
        className="pb-4"
        style={{
          width: "100%",
        }}
      >
        <GameSelectionHeader
          title="Pocker"
          leftAction={handleLeftButtonClick}
          rightAction={handleRightButtonClick}
          seeMoreLink="/pocker"
        />
        <div
          className="max-w-full w-full overflow-x-auto scrollbar-none scroll-smooth"
          ref={gamesContainer}
        >
          <div
            className=" px-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 140px)",
              gap: "9px",
            }}
          >
            {pockerGames.map((game,i) => (
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

export default PockerGames;
