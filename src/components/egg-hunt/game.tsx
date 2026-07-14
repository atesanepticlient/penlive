"use client";
import React, { useEffect, useState } from "react";
import egg from "@/../public/egg-hunt/egg.png";
import eggOpen from "@/../public/egg-hunt/egg_open.png";
import eggOpen2 from "@/../public/egg-hunt/egg_open2.png";
import eggShell from "@/../public/egg-hunt/egg-shell.png";
import eggShell2 from "@/../public/egg-hunt/egg-shell2.png";
import eggShadow from "@/../public/egg-hunt/egg-shadow.png";
import grow from "@/../public/egg-hunt/grow.png";
import growlite from "@/../public/egg-hunt/grow-lite.png";
import rewardPackage from "@/../public/egg-hunt/reward-package.png";
import messageBoard from "@/../public/egg-hunt/message-board.png";
import closeIcon from "@/../public/egg-hunt/close-icon.png";
import crackIcon from "@/../public/egg-hunt/crack.png";
import hammer from "@/../public/egg-hunt/hammer.png";
import Image from "next/image";
import { RewardEventTicketType } from "@prisma/client";
import RewardsTicketModal from "../reward-ticket";
import { useClaimRewardEventMutation } from "@/lib/features/rewardApiSlice";
import toast from "react-hot-toast";
import { INTERNAL_SERVER_ERROR } from "@/error";
import useCurrentUser from "@/hook/useCurrentUser";
import { redirect } from "next/navigation";
import { getRewardMeta } from "../red-envelop";

const TOTAL = 8;

const generateEggsWithPrize = (
  total: number,
  targetSerial: number,
  targetPrize: number,
) => {
  const getRandomPrize = () => {
    const lower = [1, 2, 3, 5, 10];
    const higher = [50, 100, 500, 1000];
    const pool = Math.random() > 0.5 ? lower : higher;
    return pool[Math.floor(Math.random() * pool.length)];
  };
  return Array.from({ length: total }, (_, i) => {
    const serial = i + 1;
    return {
      serial,
      prize: serial === targetSerial ? targetPrize : getRandomPrize(),
      shake: false,
    };
  });
};

const EggHuntGame = ({
  reward,
  isFetching,
  onEventDelete,
}: {
  reward: any;
  isFetching?: boolean;
  onEventDelete: (id: string) => void;
}) => {
  const [apiDone, setApiDone] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [gameResetKey, setGameResetKey] = useState(0);
  const [eggs, setEggs] = useState(
    Array.from({ length: TOTAL }, (_, i) => ({
      prize: 0,
      serial: i + 1,
      shake: false,
    })),
  );

  useEffect(() => {
    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const run = async () => {
      while (true) {
        const order = [...Array(8).keys()].sort(() => Math.random() - 0.5);
        const pairs = [];
        for (let i = 0; i < order.length; i += 2) {
          pairs.push([order[i], order[i + 1]]);
        }
        for (const pair of pairs) {
          setEggs((prev) =>
            prev.map((e, i) => ({ ...e, shake: pair.includes(i) })),
          );
          await wait(500);
          setEggs((prev) => prev.map((e) => ({ ...e, shake: false })));
          await wait(3000);
        }
        await wait(800);
      }
    };
    run();
  }, []);

  const [eggHuntIndex, setEggHuntIndex] = useState<number | null>(null);
  const [selectedEggSerial, setSelectedEggSerial] = useState<number | null>(
    null,
  );

  const restGame = () => {
    setEggs((prev) =>
      prev.map((e) => ({
        ...e,
        shake: false,
      })),
    );

    setEggHuntIndex(null);
    setSelectedEggSerial(null);

    // 🔥 force full re-mount of all Egg components
    setGameResetKey((prev) => prev + 1);
  };

  const checkRequirementsFullfilled = () => {
    // Handle case when reward is null or undefined
    if (!reward) return false;

    if (reward.ticketType == RewardEventTicketType.DEPOSIT) {
      return (
        reward.requirementsProgress?.[0]?.progress?.deposit >=
        +reward.requirementsProgress?.[0]?.account
      );
    } else if (reward.ticketType == RewardEventTicketType.BET) {
      return (
        reward.requirementsProgress?.[0]?.progress?.bet >=
        +reward.requirementsProgress?.[0]?.account
      );
    } else if (reward.ticketType == RewardEventTicketType.INVITE) {
      return (
        reward.requirementsProgress?.[0]?.progress?.invite >=
        +reward.requirementsProgress?.[0]?.account
      );
    } else return true;
  };

  const [requirementModal, setRequirementsModal] = useState(false);
  const [messageModalShow, setMessageModalShow] = useState(false);
  const [claimApi, { isLoading }] = useClaimRewardEventMutation();

  const user = useCurrentUser();

  const handleClick = async (playGame: () => void) => {
    if (!user || !reward) return redirect("/login");

    const requirementsFullFill = checkRequirementsFullfilled();
    if (!requirementsFullFill) {
      setRequirementsModal(true);
      return;
    }

    setApiDone(false);
    setApiSuccess(false);

    playGame(); // start animation immediately

    try {
      const res = await claimApi({
        rewardId: reward.id,
        rewardType: reward.rewardType,
        prize: reward.prize,
        prizeHash: reward.prizeHash,
      }).unwrap();

      if (res) {
        setApiSuccess(true);
        setApiDone(true);
        setTimeout(() => {
          setMessageModalShow(true);
          setTimeout(() => {
            setMessageModalShow(false);
            onEventDelete(reward.id);
            restGame();
          }, 3000);
        }, 1500);
      }
    } catch (error: any) {
      setApiSuccess(false);
      setApiDone(true);

      if (error.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error(INTERNAL_SERVER_ERROR);
      }
    }
  };

  useEffect(() => {
    if (eggHuntIndex && reward) {
      const finalPrize = apiSuccess ? reward.prize : 0;

      setEggs(generateEggsWithPrize(TOTAL, eggHuntIndex, finalPrize));
    }
  }, [eggHuntIndex, reward, apiSuccess]);

  // Safe access to reward properties with null checks

  const {
    requireFig,
    progressFig,
    requirementTitle,
    requirementButtonLabel,
    redirectAfterRequirement,
  } = getRewardMeta(reward);

  const isEggButtonDisable = isLoading || isFetching;

  return (
    <div>
      <div className="grid grid-cols-3 gap-[45px] egg-grid">
        <div
          className="flex justify-center gap-[45px]"
          style={{ gridColumn: "span 3" }}
        >
          {eggs.slice(0, 2).map((data) => (
            <Egg
              key={`${data.serial}-${gameResetKey}`}
              i={data.serial}
              eggHuntIndex={eggHuntIndex}
              setEggHuntIndex={setEggHuntIndex}
              selectedEggSerial={selectedEggSerial}
              setSelectedEggSerial={setSelectedEggSerial}
              shake={data.shake}
              resetGame={restGame}
              onEggClick={handleClick}
              isButtonsDisable={isEggButtonDisable}
              prize={data.prize}
              reward={reward}
              user={user}
              apiDone={apiDone}
              apiSuccess={apiSuccess}
            />
          ))}
        </div>
        {eggs.slice(2).map((data, i) => (
          <div key={i}>
            <Egg
              key={`${data.serial}-${gameResetKey}`}
              i={data.serial}
              eggHuntIndex={eggHuntIndex}
              setEggHuntIndex={setEggHuntIndex}
              selectedEggSerial={selectedEggSerial}
              setSelectedEggSerial={setSelectedEggSerial}
              shake={data.shake}
              resetGame={restGame}
              onEggClick={handleClick}
              isButtonsDisable={isEggButtonDisable}
              prize={data.prize}
              reward={reward}
              user={user}
              apiDone={apiDone}
              apiSuccess={apiSuccess}
            />
          </div>
        ))}
        {reward && (
          <>
            <RewardsTicketModal
              show={requirementModal}
              onClose={() => setRequirementsModal(false)}
              requireMents={requireFig}
              progress={progressFig}
              requirementTitle={requirementTitle}
              buttonLevel={requirementButtonLabel}
              redirect={redirectAfterRequirement}
            />
            <MessageBoard
              show={messageModalShow}
              onClose={() => setMessageModalShow(false)}
              prize={reward.prize}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EggHuntGame;

const Egg = ({
  i,
  eggHuntIndex,
  setEggHuntIndex,
  selectedEggSerial,
  setSelectedEggSerial,
  shake,
  resetGame,
  onEggClick,
  isButtonsDisable,
  prize,
  apiDone,
  apiSuccess,
}: {
  i: number;
  eggHuntIndex: number | null;
  setEggHuntIndex: any;
  selectedEggSerial: number | null;
  setSelectedEggSerial: any;
  shake: boolean;
  resetGame: () => void;
  onEggClick: (playGame: () => void) => void;
  isButtonsDisable: boolean;
  prize: number;
  reward: any;
  user: any;
  apiDone: boolean;
  apiSuccess: boolean;
}) => {
  const [clicked, setClick] = useState(false);
  const [showCrack, setShowCrack] = useState(false);
  const [animationStage, setAnimationStage] = useState<
    "idle" | "hammerHit" | "cracking" | "exploding" | "opened"
  >("idle");
  const [minAnimationDone, setMinAnimationDone] = useState(false);
  const playGame = () => {
    setClick(true);
    setSelectedEggSerial(i);
    setMinAnimationDone(false);

    // Stage 1
    setAnimationStage("hammerHit");

    setTimeout(() => {
      setAnimationStage("cracking");
      setShowCrack(true);
    }, 300);

    setTimeout(() => {
      setAnimationStage("exploding");
    }, 600);

    // ✅ ONLY mark animation done (DO NOT OPEN)
    setTimeout(() => {
      setMinAnimationDone(true);
    }, 1000);
  };

  const handleClick = () => {
    if (animationStage !== "idle") return;
    onEggClick(() => {
      playGame();
    });
  };

  useEffect(() => {
    if (!eggHuntIndex) {
      setClick(false);
      setShowCrack(false);
      setAnimationStage("idle");
      setSelectedEggSerial(null);
    }
  }, [eggHuntIndex]);

  useEffect(() => {
    if (minAnimationDone && apiDone) {
      setAnimationStage("opened");

      if (apiSuccess) {
        setEggHuntIndex(i);
      } else {
        // ❌ API failed → force prize 0
        setEggHuntIndex(i);
      }
    }
  }, [minAnimationDone, apiDone]);
  const isSelected = eggHuntIndex === i;
  const isCurrentSelected = selectedEggSerial === i;

  return (
    <div className="w-[80px] h-[100px] flex justify-center items-center relative">
      {eggHuntIndex ? (
        <div onClick={resetGame}>
          <EggOpened
            prize={prize}
            type={isSelected ? "SELECTED" : "UNSELECTED"}
          />
        </div>
      ) : (
        <button
          disabled={isButtonsDisable}
          onClick={handleClick}
          className="relative block"
        >
          {/* Main egg container with animations */}
          <div className="relative">
            {/* Egg crack overlay */}
            {showCrack && isCurrentSelected && (
              <div className="absolute top-5 left-4 inset-0 z-20 pointer-events-none">
                <Image
                  src={crackIcon}
                  alt="egg"
                  className="w-[36px] opacity-75 select-none"
                />
              </div>
            )}

            {/* Egg explosion particles */}
            {animationStage === "exploding" && isCurrentSelected && (
              <div className="absolute inset-0 z-15 pointer-events-none">
                {[...Array(12)].map((_, idx) => (
                  <div
                    key={idx}
                    className="egg-particle"
                    style={
                      {
                        "--tx": `${(Math.random() - 0.5) * 200}px`,
                        "--ty": `${(Math.random() - 0.5) * 150 - 50}px`,
                        "--rot": `${Math.random() * 360}deg`,
                        animationDelay: `${idx * 20}ms`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}

            {/* Hammer animation with improved impact effect */}
            {clicked && isCurrentSelected && animationStage === "hammerHit" && (
              <div className="absolute top-4 -right-2 z-30">
                <div className="hammer-container">
                  <Image
                    src={hammer}
                    alt="Hammer"
                    className="w-[45px] hammer-impact-animation"
                  />
                  {/* Impact burst */}
                  <div className="absolute -top-2 -left-2 w-12 h-12">
                    <div className="impact-burst" />
                  </div>
                </div>
              </div>
            )}

            {/* Impact flash effect */}
            {animationStage === "hammerHit" && isCurrentSelected && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="impact-flash" />
              </div>
            )}

            {/* Main egg image with shake animation */}
            <Image
              src={egg}
              alt="Egg"
              className={`w-[70px] select-none relative z-5 transition-all ${
                shake && !isCurrentSelected ? "egg-shake" : ""
              } ${
                animationStage === "hammerHit" && isCurrentSelected
                  ? "egg-hit"
                  : ""
              } ${
                animationStage === "cracking" && isCurrentSelected
                  ? "egg-cracking"
                  : ""
              } ${
                animationStage === "exploding" && isCurrentSelected
                  ? "egg-exploding"
                  : ""
              }`}
            />

            {/* Shadow */}
            <div className="absolute w-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-50">
              <Image
                src={eggShadow}
                alt="Egg Shadow"
                className="w-full select-none"
              />
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

const EggOpened = ({
  type = "UNSELECTED",
  prize = 5,
}: {
  type: "SELECTED" | "UNSELECTED";
  prize: number;
}) => {
  return (
    <div className="relative">
      {" "}
      {/* Removed animate-egg-reveal */}
      <Image
        src={type == "SELECTED" ? eggOpen : eggOpen2}
        alt="Egg"
        className={`w-[70px] select-none relative ${type == "SELECTED" ? "-bottom-[16px]" : "-bottom-[15px]"}`}
      />
      <div className="absolute w-[135px] h-[110px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
        <Image
          src={eggShadow}
          alt="Egg Shadow"
          className="w-full select-none"
        />
      </div>
      {/* Static glow - no animation */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[90px] -z-20">
        <Image
          src={type == "SELECTED" ? growlite : grow}
          alt="Glow"
          className="w-full"
        />
      </div>
      {type == "SELECTED" && (
        <div className="absolute top-0.5 left-3 w-[90px] -z-10">
          <Image src={rewardPackage} alt="Reward" className="w-[50px]" />{" "}
          {/* Removed animate-float */}
        </div>
      )}
      {type == "SELECTED" && (
        <div className="absolute -bottom-1.5 -left-5 w-[90px] -z-50">
          <Image src={eggShell} alt="Egg Shell" className="w-[50px]" />{" "}
          {/* Removed animate-slide-left */}
        </div>
      )}
      {type == "UNSELECTED" && (
        <div className="absolute -bottom-1.5 -left-5 w-[90px] -z-50">
          <Image
            src={eggShell2}
            alt="Egg Shell"
            className="w-[50px] rotate-180"
          />
        </div>
      )}
      <div className="absolute top-8 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[100px] text-center h-full">
        <span
          className="text-lg text-[#ffffffdc] font-semibold mt-10 block leading-5" // Removed animate-fade-in-up
          style={{ textShadow: "0px 0px 4px red" }}
        >
          {prize.toFixed(2)}
          <br /> you have earned
        </span>
      </div>
    </div>
  );
};

const MessageBoard = ({
  show,
  onClose,
  prize,
}: {
  show: boolean;
  onClose: () => void;
  prize: number;
}) => {
  if (!show) return null;
  return (
    <div className="fixed top-0 left-0 right-0 w-full h-screen bg-[#0000006c] flex justify-center items-center z-40">
      <div className="relative animate-modalIn">
        <Image
          src={messageBoard}
          alt="Prize"
          className="w-[380px] select-none"
        />
        <button className="-right-2 -top-3 absolute" onClick={onClose}>
          <Image
            src={closeIcon}
            alt="Close button"
            className="w-[30px] select-none"
          />
        </button>
        <div>
          <h3 className="absolute top-[50px] left-36 text-2xl font-bold text-red-700">
            অভিনন্দন
          </h3>
          <span className="absolute top-[100px] text-lg left-1/2 -translate-x-1/2 block text-center">
            আপনি অর্জন করেছেন
            <br />
            <span className="font-bold text-xl">৳{prize}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// Add these styles to your global CSS file or component styles
const styles = `


  .egg-hit {
    animation: hitImpact 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .egg-cracking {
    animation: crackVibration 0.3s ease-in-out;
  }

  .egg-exploding {
    animation: explode 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
  }

  .hammer-impact-animation {
    animation: hammerImpact 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
    transform-origin: top center;
  }

  .impact-flash {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255,255,200,0.8) 0%, rgba(255,200,0,0) 70%);
    border-radius: 50%;
    animation: flash 0.3s ease-out;
  }

  .impact-burst {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,100,0,0) 70%);
    border-radius: 50%;
    animation: burst 0.4s ease-out;
  }

  .egg-particle {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #FFD700;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    animation: particleFly 0.6s ease-out forwards;
    box-shadow: 0 0 2px rgba(255,215,0,0.5);
  }

  .egg-particle::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: #FFA500;
    border-radius: 50%;
    transform: scale(0.7);
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    25% { transform: translateX(-3px) rotate(-2deg); }
    75% { transform: translateX(3px) rotate(2deg); }
  }

  @keyframes hitImpact {
    0% { transform: scale(1) translateY(0); }
    30% { transform: scale(0.9) translateY(5px); }
    70% { transform: scale(1.05) translateY(-3px); }
    100% { transform: scale(1) translateY(0); }
  }

  @keyframes crackVibration {
    0% { transform: translateX(0); }
    25% { transform: translateX(-2px) rotate(-1deg); }
    75% { transform: translateX(2px) rotate(1deg); }
    100% { transform: translateX(0); }
  }

  @keyframes explode {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; filter: brightness(1.5); }
    100% { transform: scale(0.8); opacity: 0; }
  }

  @keyframes hammerImpact {
    0% { transform: rotate(-30deg) translateY(-10px); opacity: 0; }
    20% { transform: rotate(10deg) translateY(0); opacity: 1; }
    40% { transform: rotate(45deg) translateY(5px); }
    60% { transform: rotate(20deg) translateY(-2px); }
    100% { transform: rotate(0deg) translateY(0); }
  }

  @keyframes flash {
    0% { opacity: 1; transform: scale(0.5); }
    100% { opacity: 0; transform: scale(2); }
  }

  @keyframes burst {
    0% { opacity: 1; transform: scale(0); }
    50% { opacity: 0.8; transform: scale(1.5); }
    100% { opacity: 0; transform: scale(2.5); }
  }

  @keyframes particleFly {
    0% {
      transform: translate(0, 0) rotate(0deg) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(var(--tx, 100px), var(--ty, -50px)) rotate(var(--rot, 180deg)) scale(0);
      opacity: 0;
    }
  }

  @keyframes egg-reveal {
    0% {
      transform: scale(0) rotate(-180deg);
      opacity: 0;
    }
    60% {
      transform: scale(1.1) rotate(10deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes slide-left {
    0% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(-30px); opacity: 0; }
  }

  @keyframes fade-in-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-egg-reveal {
    animation: egg-reveal 0.6s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
  }

  .animate-float {
    animation: float 2s ease-in-out infinite;
  }

  .animate-slide-left {
    animation: slide-left 0.5s ease-out forwards;
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out;
  }

  .animate-spin-slow {
    animation: spin 4s linear infinite;
  }
`;

// Inject styles (add this to your main component or global styles)
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
