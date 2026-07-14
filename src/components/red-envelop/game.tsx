"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import envelopeImg from "@/../public/red-envelope/red-envelope.png";
import envelopeOpenImage from "@/../public/red-envelope//red-envelop-open.png";

import { IoMdCloseCircle } from "react-icons/io";
import { useClaimRewardEventMutation } from "@/lib/features/rewardApiSlice";
import toast from "react-hot-toast";

const EnvelopGame = ({
  onClose,
  show,
  prize,
  reward,
  onDeleteEventById,
}: {
  onClose: () => void;
  show: boolean;
  prize: number;
  reward: any;
  onDeleteEventById: (id: string) => void;
}) => {
  const [phase, setPhase] = useState<
    "countdown" | "playing" | "result" | "end"
  >("countdown");
  const [count, setCount] = useState(4);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selected, setSelected] = useState<number | null>(null);
  const [envelopes, setEnvelopes] = useState<any[]>([]);
  const [result, setResult] = useState<number | null>(null);

  const [claimApi, { isLoading: claiming }] = useClaimRewardEventMutation();

  // 🔢 Countdown (4 → 1)
  useEffect(() => {
    if (phase !== "countdown") return;

    if (count > 1) {
      const t = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setTimeout(() => {
        setPhase("playing");
        generateEnvelopes();
      }, 800);
    }
  }, [count, phase]);

  // 🎮 Game timer (15 sec)
  useEffect(() => {
    if (phase !== "playing") return;

    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(t);
    } else {
      handleFinish();
    }
  }, [timeLeft, phase]);

  // 🎁 Generate envelopes with random positions
  const generateEnvelopes = () => {
    const total = 12;
    const lanes = 4; // number of columns
    const gap = 100 / lanes;

    const items = Array.from({ length: total }).map((_, i) => {
      const lane = i % lanes;

      return {
        id: i,
        left: lane * gap + Math.random() * (gap - 10), // keep inside lane
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2, // different speeds
      };
    });

    setEnvelopes(items);
  };

  // 🖱 Click envelope
  const handleClick = async (id: number) => {
    if (selected !== null || claiming) return;
    setSelected(id);

    const apiSuccess = await claimBonus();
    if (apiSuccess) {
      setResult(prize);
    } else {
      setResult(0);
    }
  };

  const claimBonus = async () => {
    try {
      const res = await claimApi({
        prize: reward.prize,
        rewardId: reward.id,
        rewardType: reward.rewardType,
        prizeHash: reward.prizeHash,
      }).unwrap();
      return !!res;
    } catch (error) {
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Reward was not claimed!");
      }
      return false;
    }
  };

  // ⏹ Finish game
  const handleFinish = () => {
    setPhase("result");

    setTimeout(() => {
      restartGame();
      setTimeout(() => {
        onDeleteEventById(reward.id);
      }, 400);
    }, 3000);
  };

  // 🔁 Restart
  const restartGame = () => {
    setPhase("end");
    setCount(4);
    setTimeLeft(10);
    setSelected(null);
    setResult(null);
    setEnvelopes([]);
  };

  useEffect(() => {
    if (prize) {
      setResult(prize);
    }
  }, [prize]);

  useEffect(() => {
    if (phase == "end") {
      onClose();
    }
  }, [phase]);
  if (!show) return;

  return (
    <div className="fixed inset-0 z-[2000] bg-[#000000d7] flex items-center justify-center">
      {/* ⏳ COUNTDOWN */}
      {phase === "countdown" && (
        <h1 className="text-6xl text-yellow-300 font-bold">{count}</h1>
      )}

      {/* 🎮 GAME */}
      {phase === "playing" && (
        <div className="w-full h-full relative overflow-hidden">
          {/* Header */}
          <div className="absolute top-5 w-full text-center z-10">
            <h2 className="text-2xl text-white font-semibold">
              End in{" "}
              <span className="text-yellow-300 text-3xl">{timeLeft}</span> sec
            </h2>
            <p className="text-white text-2xl">
              Please Click on any Red Package
            </p>
          </div>

          {/* Envelopes */}
          {envelopes.map((env) => (
            <div
              key={env.id}
              onClick={() => handleClick(env.id)}
              className={`absolute cursor-pointer transition `}
              style={{
                left: `${env.left}%`,
                top: "-100px",
                animation: `fall ${env.duration}s linear infinite`,
                animationDelay: `${env.delay}s`,
              }}
            >
              <Image
                src={envelopeImg}
                alt="envelope"
                width={60}
                className="select-none"
              />
            </div>
          ))}
        </div>
      )}

      {/* 🏆 RESULT */}
      {phase === "result" && (
        <div className="text-center">
          {selected !== null ? (
            <>
              <Prize prize={result} onClose={() => setPhase("end")} />
            </>
          ) : (
            <>
              <h2 className="text-xl text-red-400">
                Please select any package and try again
              </h2>
              <button
                onClick={restartGame}
                className="mt-6 px-6 py-2 bg-yellow-400 rounded-lg font-semibold"
              >
                Play Again
              </button>
            </>
          )}
        </div>
      )}

      {/* 🎬 Animation */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default EnvelopGame;

const Prize = ({ prize, onClose }: { prize: number; onClose: () => void }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(true);
    }, 700); // ⏱ delay here (change as needed)

    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="relative animate-softIn">
      {/* Glow background effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[220px] h-[220px] bg-yellow-400/20 blur-3xl rounded-full animate-glowPulse" />
      </div>

      <Image
        src={envelopeOpenImage}
        alt="Red envelop"
        className="w-[330px] select-none relative z-10"
      />

      {/* TEXT */}
      <div className="top-24 left-1/2 -translate-x-1/2 absolute text-center z-20">
        <h3 className="font-bold text-[13px] tracking-wide text-amber-700 animate-fadeUp">
          Congratulations You’ve <br /> earned
        </h3>

        <h4 className="font-bold text-[26px] text-amber-700 animate-numberReveal">
          ৳{prize}
        </h4>
      </div>

      {/* CLOSE */}
      <button onClick={onClose} className="-top-8 right-2 absolute z-30">
        <IoMdCloseCircle className="text-white/60 text-3xl hover:text-white transition" />
      </button>

      <style jsx>{`
        /* 🌟 Soft entrance */
        @keyframes softIn {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
            filter: blur(6px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }

        .animate-softIn {
          animation: softIn 0.6s ease-out forwards;
        }

        /* ✨ Glow pulse */
        @keyframes glowPulse {
          0% {
            transform: scale(0.8);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }

        .animate-glowPulse {
          animation: glowPulse 1.5s ease-in-out infinite;
        }

        /* 📝 Smooth text reveal */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeUp {
          opacity: 0;
          animation: fadeUp 0.5s ease forwards;
          animation-delay: 0.2s;
        }

        /* 💰 Elegant number reveal */
        @keyframes numberReveal {
          0% {
            opacity: 0;
            transform: scale(0.9);
            letter-spacing: 3px;
          }
          100% {
            opacity: 1;
            transform: scale(1);
            letter-spacing: 0px;
          }
        }

        .animate-numberReveal {
          opacity: 0;
          animation: numberReveal 0.6s ease forwards;
          animation-delay: 0.35s;
        }
      `}</style>
    </div>
  );
};
