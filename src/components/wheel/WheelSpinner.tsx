import React, { useMemo, useState } from "react";
import { Wheel } from "react-custom-roulette";

export type Segment = {
  label: string;
  color?: string;
  chip?: string;
  icon?: React.ReactNode;
};

export default function WheelSpinner({
  segments,
  getTargetIndex,
  onFinish,
}: {
  segments: Segment[];
  getTargetIndex?: () => number | null;
  onFinish?: (index: number, segment: Segment) => void;
}) {
  const [mustStartSpinning, setMustStartSpinning] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const data = useMemo(
    () =>
      segments.map((seg) => ({
        option: seg.label,
        style: {
          backgroundColor: seg.color || "#0e6a6e",
          textColor: "#ffffff",
        },
      })),
    [segments],
  );

  const handleSpin = () => {
    if (mustStartSpinning || segments.length === 0) return;
    const chosen = getTargetIndex?.();
    const next =
      chosen === null || chosen === undefined
        ? Math.floor(Math.random() * segments.length)
        : Math.max(0, Math.min(segments.length - 1, chosen));

    setPrizeNumber(next);
    setMustStartSpinning(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Wheel
        mustStartSpinning={mustStartSpinning}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={() => {
          setMustStartSpinning(false);
          onFinish?.(prizeNumber, segments[prizeNumber]);
        }}
        backgroundColors={["#3e3e3e", "#df3428"]}
        textColors={["#ffffff"]}
      />
      <button
        type="button"
        onClick={handleSpin}
        className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold disabled:opacity-50"
        disabled={mustStartSpinning || segments.length === 0}
      >
        Spin
      </button>
    </div>
  );
}

