"use client";
import React from "react";
import { RiArrowDownWideLine } from "react-icons/ri";
import { GridLoader } from "react-spinners";
import GameErrorModal from "./error-modal";

const GameBoard = ({
  isLoading,
  url,
  content,
  onCloseGame,
  error,
}: {
  isLoading: boolean;
  url?: string;
  content?: string;
  onCloseGame: () => void;
  error?: boolean;
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 w-full h-screen bg-black z-[50000000]">
      <button
        onClick={() => onCloseGame()}
        className="left-1/2 -translate-x-1/2 top-1 absolute px-2 py-0.5 rounded cursor-pointer bg-white/30 z-[50000001]"
      >
        <RiArrowDownWideLine className="text-white" />
      </button>

      {isLoading && (
        <GridLoader
          size={12}
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
          color="#fff"
        />
      )}

      {!isLoading && (
        <>
          {url ? (
            <iframe
              src={url}
              className="top-0 left-0 right-0 absolute w-full h-screen"
            />
          ) : content ? (
            <iframe
              srcDoc={content}
              className="top-0 left-0 right-0 absolute w-full h-screen"
            />
          ) : null}
        </>
      )}

      {!isLoading && error && (
        <>
          <GameErrorModal onClose={() => console.log("")} />
        </>
      )}
    </div>
  );
};

export default GameBoard;
