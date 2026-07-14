"use client";
import React, { useRef } from "react";

import GameSelectionHeader from "./GameSelectionHeader";
import HomeGameCard from "./games/home-game-card";
import { getLiveGames } from "@/lib/games";

const LiveGames = () => {
  const gamesContainer = useRef<HTMLDivElement | null>(null);

  const handleRightButtonClick = () => {
    gamesContainer.current!.scrollLeft += -130;
  };
  const handleLeftButtonClick = () => {
    gamesContainer.current!.scrollLeft += 130;
  };

  const liveGames = getLiveGames({ nameSearch: "", limit: 20 });
  if (liveGames)
    return (
      <div
        className=""
        style={{
          width: "100%",
        }}
      >
        <GameSelectionHeader
          title="Live Games"
          leftAction={handleLeftButtonClick}
          rightAction={handleRightButtonClick}
          seeMoreLink="/live"
        />
        <div
          className="max-w-full w-full overflow-x-auto scrollbar-none scroll-smooth"
          ref={gamesContainer}
        >
          <div className="hot-games-list px-3">
            {liveGames.map((game, i) => (
              <HomeGameCard
                key={i}
                product_code={game.product_code}
                label={game.game_name}
                image={game.image_url}
                badge="live"
                game_code={game.game_code}
                game_type={game.game_type}
              />
            ))}
          </div>
        </div>
      </div>
    );
};

export default LiveGames;
