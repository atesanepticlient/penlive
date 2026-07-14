"use client";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import GameOpeningLoader from "@/components/loader/GameOpeningLoader";
import useCurrentUser from "@/hook/useCurrentUser";

import {
  useLogin568WinMutation,
} from "@/lib/features/gamesApiSlice";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Play = () => {
  const user: any = useCurrentUser();
  const [isIframeLoading, setIsLoading] = useState(true);
  const gameId = useSearchParams().get("gameId") || "";
  const gpId = useSearchParams().get("gpId") || "";

  const [iframe, setIframe] = useState("");

  const [error, setError] = useState(false);

  const [loginGame, { isLoading: loginLoading }] = useLogin568WinMutation();

  useEffect(() => {
    loginGame({ username: user.playerId, gameid: gameId, gpid: gpId })
      .unwrap()
      .then((res) => {
        const url = res.payload.url;
        setIframe(url);
      })
      .catch(() => {
        setError(true);
      });
  }, [gameId, gpId]);

  return (
    <div>
      {(loginLoading || isIframeLoading) && !error && <GameOpeningLoader />}
      {!loginLoading && !error && iframe && (
        <div className="w-full h-screen ">
          <iframe
            src={iframe}
            className="w-full h-full border-0 rounded-b-lg"
            onLoad={() => setIsLoading(false)}
            allowFullScreen
          />
        </div>
      )}
      {!loginLoading && error && (
        <div className="w-full h-screen bg-[#006165] flex justify-center items-center">
          <div className="w-[280px] md:w-[320px] lg:w-[350px] bg-white overflow-hidden rounded-xl">
            <div className="h-[70%] w-full bg-red-500 px-8 py-2">
              <h3 className="text-2xl font-semibold text-white">Error</h3>

              <p className="text-sm font-normal text-white tracking-wide">
                Game is not available
              </p>
            </div>

            <div className="flex justify-end items-end pb-4 pr-4">
              <Link href="/" className="mt-4">
                <SecondaryButton>Go Home</SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;
