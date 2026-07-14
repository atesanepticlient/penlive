import sliverBadge from "@/../public/vip/silver-badge.png";
import goldBadge from "@/../public/vip/gold-badge.png";
import liteGoldBadge from "@/../public/vip/dark-gold-badge.png";
import darkGoldBadge from "@/../public/vip/dark-gold-badge.png";
import diamondBadge from "@/../public/vip/diamond-badge.png";
import liteDiamondBadge from "@/../public/vip/lite-diamond-badge.png";

export const vipLevelBadgeFinder = (level: number): any => {
  // sliver             -> 0
  // diamond lite       -> 1-2
  // diamond            -> 3-4
  // gold lite          -> 5-6
  // gold               -> 7 -8
  // gold dark          -> 9 - 10

  const images = [
    {
      image: sliverBadge,
      levels: [0],
      color: "#E2E2E0",
    },
    {
      image: liteDiamondBadge,
      levels: [1, 2],
      color: "#DDEBF1",
    },
    {
      image: diamondBadge,
      levels: [3, 4],
      color: "#CCD9F3",
    },
    {
      image: liteGoldBadge,
      levels: [5, 6],
      color: "#F7E9A0",
    },
    {
      image: goldBadge,
      levels: [7, 8],
      color: "#F4CF63",
    },
    {
      image: darkGoldBadge,
      levels: [9, 10],
      color: "#E8C2A5",
    },
  ];

  const image = images.find((data) => data.levels.includes(level));
  return { image: image.image, color: image.color };
};
