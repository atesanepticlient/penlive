import useTimeCountDown from "@/hook/useTimeCountDown";

// type TimeLeft = {
//   day: number;
//   hour: number;
//   min: number;
//   sec: number;
// };

type Props = {
  expiryDate?: Date;
};

const RewardEventCountdown = ({ expiryDate }: Props) => {
  const { concrete } = useTimeCountDown({ date: expiryDate });
  const Box = ({ value }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-[#222] border-2  border-[#ffffff7b] text-lg font-bold py-0.5 text-white rounded-md min-w-[50px] text-center">
        {String(value).padStart(2, "0")}
      </div>
      {/* <span className="text-xs mt-1 text-gray-500">{label}</span> */}
    </div>
  );

  return (
    <div className="flex items-center gap-0.5">
      <span className="text-yellow-400 text-xl">⏰</span>
      <span className="text-white text-lg font-semibold block pr-4">
        Remind
      </span>

      <Box value={+concrete.day} label="D" />
      <span className="text-lg font-bold text-white">:</span>

      <Box value={+concrete.hours} label="H" />
      <span className="text-lg font-bold text-white">:</span>

      <Box value={+concrete.min} label="M" />
      <span className="text-lg font-bold text-white">:</span>

      <Box value={+concrete.sec} label="S" />
    </div>
  );
};

export default RewardEventCountdown;
