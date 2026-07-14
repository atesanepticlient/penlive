"use client";
import { useEffect, useState } from "react";

interface TimeCountDownProps {
  formte?: "d-h-m-s" | "h-m-s" | "m-s";
  date: Date | string | null;
}

interface TimeState {
  fullDateString: string;
  isInvalidDate?: boolean;
  concrete: {
    day: string;
    hours: string;
    min: string;
    sec: string;
  };
}
const formatNumber = (num: number | string) =>
  String(Number(num)).padStart(2, "0");

const useTimeCountDown = ({ formte = "d-h-m-s", date }: TimeCountDownProps) => {
  const [time, setTime] = useState<TimeState>({
    fullDateString: "",
    concrete: {
      day: "00",
      hours: "00",
      min: "00",
      sec: "00",
    },
    isInvalidDate: !!!date,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(date).getTime();
      const diff = target - now;

      if (diff <= 0) {
        return {
          day: "00",
          hours: "00",
          min: "00",
          sec: "00",
        };
      }

      const totalSeconds = Math.floor(diff / 1000);

      let days = Math.floor(totalSeconds / (3600 * 24));
      let hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      let minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // adjust based on format
      if (formte === "h-m-s") {
        hours += days * 24;
        days = 0;
      }

      if (formte === "m-s") {
        minutes += hours * 60 + days * 24 * 60;
        hours = 0;
        days = 0;
      }

      return {
        day: formatNumber(days),
        hours: formatNumber(hours),
        min: formatNumber(minutes),
        sec: formatNumber(seconds),
      };
    };

    const update = () => {
      const t = calculateTime();

      let full = "";

      if (formte === "d-h-m-s") {
        full = `${t.day}D : ${t.hours}h : ${t.min}M : ${t.sec}S`;
      } else if (formte === "h-m-s") {
        full = `${t.hours}h : ${t.min}M : ${t.sec}S`;
      } else if (formte === "m-s") {
        full = `${t.min}M : ${t.sec}S`;
      }

      setTime({
        fullDateString: full,
        concrete: t,
      });
    };

    update(); // initial run
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [date, formte]);

  return time;
};

export default useTimeCountDown;
