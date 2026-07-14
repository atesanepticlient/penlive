"use client";
import NoData from "@/components/no-data";
import { useFetchInviatationBonusRecordQuery } from "@/lib/features/rewardApiSlice";
import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { GiCheckMark } from "react-icons/gi";
import { SlCalender } from "react-icons/sl";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";

interface InvitationRecordProps {
  bonus: number;
  createdAt: Date;
  user: {
    phone: string;
  };
}
interface AchievementRecordProps {
  reward: {
    prize: number;
  };

  createdAt: Date;
}
const today = new Date();

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(today.getDate() - 7);
const Records = () => {
  const [range, setRange] = useState([
    {
      startDate: sevenDaysAgo,
      endDate: today,
      key: "selection",
    },
  ]);

  const recordsCategoryData = [
    {
      name: "Invitation Rewards",
    },
    {
      name: "Achievement Rewards",
    },
    {
      name: "Betting Rebate",
    },
  ];

  const [rewardDrowerIsActive, setRewardDrowerIsActive] = useState(false);
  const [recordCategory, setRecordCategory] = useState(recordsCategoryData[0]);

  const { data, isLoading } = useFetchInviatationBonusRecordQuery();

  const referRecords = data?.payload?.referRecords;
  const achivementRecords = data?.payload?.achivementRecords;
  const rebateRecords = data?.payload?.rebate;

  // Dummy Data
  // const referRecords: InvitationRecordProps[] = [
  //   {
  //     bonus: 150,
  //     createdAt: new Date(),
  //     user: {
  //       phone: "01336692075",
  //     },
  //   },
  //   {
  //     bonus: 100,
  //     createdAt: new Date(),
  //     user: {
  //       phone: "01735156550",
  //     },
  //   },
  // ];
  // const achievementRecords: AchievementRecordProps[] = [
  //   {
  //     reward: {
  //       prize: 50,
  //     },
  //     createdAt: new Date(),
  //   },
  //   {
  //     reward: {
  //       prize: 75,
  //     },
  //     createdAt: new Date(),
  //   },
  // ];

  const filterByDate = <T extends { createdAt: Date }>(list: T[]) => {
    const from = new Date(range[0].startDate).setHours(0, 0, 0, 0);
    const to = new Date(range[0].endDate).setHours(23, 59, 59, 999);

    return list.filter((item) => {
      const date = new Date(item.createdAt).getTime();
      return date >= from && date <= to;
    });
  };

  return (
    <div>
      <div className="flex  justify-between">
        <Drawer
          open={rewardDrowerIsActive}
          onClose={() => {
            setRewardDrowerIsActive(false);
          }}
        >
          <DrawerTrigger
            onClick={() => setRewardDrowerIsActive(true)}
            className={`border border-blue-600 px-3 py-1.5 rounded-sm ${rewardDrowerIsActive ? "text-white bg-blue-600" : "text-blue-600"}  text-sm flex items-center gap-3 `}
          >
            {recordCategory.name}
            <IoMdArrowDropdown />
          </DrawerTrigger>
          <DrawerContent>
            <div className=" p-4">
              <p className="text-lg font-bold text-gray-600">Type</p>

              <ul className="py-2">
                {recordsCategoryData.map((rc, i) => (
                  <li
                    onClick={() => {
                      setRewardDrowerIsActive(false);
                      setRecordCategory(rc);
                    }}
                    key={i}
                    className="flex items-center justify-between  border-b py-3"
                  >
                    <span className="text-sm font-bold text-gray-600">
                      {rc.name}
                    </span>

                    {rc.name == recordCategory.name && (
                      <GiCheckMark className="text-red-600" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </DrawerContent>
        </Drawer>

        <Popover>
          <PopoverTrigger asChild>
            <button className="border border-blue-600 text-blue-600 px-3 py-1.5 rounded-sm text-sm flex items-center gap-3">
              <SlCalender />
              {moment(range[0].startDate).format("DD MMM")} -{" "}
              {moment(range[0].endDate).format("DD MMM")}
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            <DateRange
              editableDateInputs={true}
              onChange={(item: any) => setRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={range}
              months={1}
              direction="horizontal"
            />
          </PopoverContent>
        </Popover>
      </div>

      {(!data || isLoading) && (
        <div className="w-full h-[70vh] flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {data && !isLoading && (
        <div>
          {recordCategory.name == "Achievement Rewards" && (
            <AchievementRecordsList list={filterByDate(achivementRecords)} />
          )}

          {recordCategory.name == "Invitation Rewards" && (
            <InvitationRecordsList list={filterByDate(referRecords)} />
          )}
          {recordCategory.name == "Betting Rebate" && (
            <RebateRecordList
              list={[
                ...filterByDate(rebateRecords).map((record: any) => ({
                  id: record.id,
                  transactionDate: record.createdAt,
                  settlementDateTime: record.dispatch.createdAt,
                  bettingAmount: record.totalLoss,
                  rebateRate: 5,
                  rebateAmount: record.rebateAmount,
                })),
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Records;

const InvitationRecordsList = ({ list }: { list: InvitationRecordProps[] }) => {
  const totalReward = list.reduce((prev, item) => {
    return prev + Number(item.bonus);
  }, 0);
  return (
    <div className=" mt-4">
      <div className=" ">
        {list && (
          <div className="border-t">
            <table className="w-full mt-1" cellPadding={7}>
              <thead className="">
                <tr className="bg-gray-100  ">
                  <th className="text-xs text-gray-500 text-start">Date</th>
                  <th className="text-xs text-gray-500 text-start">User</th>
                  <th className="text-xs text-gray-500 text-start">Reward</th>
                </tr>
              </thead>
              {list.length == 0 && (
                <div className="mt-16 absolute top-56 left-1/2 -translate-x-1/2">
                  <NoData />
                </div>
              )}
              {list.length != 0 && (
                <tbody>
                  {list.map((record, i) => (
                    <tr key={i} className={`${i % 2 != 0 && "bg-gray-50"}`}>
                      <td className="text-[11px] text-start">
                        {moment(record.createdAt).calendar()}
                      </td>
                      <td className="text-[11px] text-start">
                        {record.user.phone}
                      </td>
                      <td className="text-[11px] text-start">
                        {Number(record.bonus).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )}
      </div>

      <div className="fixed left-0 bottom-0 w-full h-[80px] shadow-[0_7px_29px_rgba(100,100,111,0.2)]">
        <div className="flex w-full justify-center items-center pt-2 ">
          <div className="flex-1 text-center">
            <h4 className="text-[#555555] text-base font-bold">Total</h4>
            <h4 className="text-[#555555] text-base font-bold">
              {Number(totalReward).toFixed(2)}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementRecordsList = ({
  list,
}: {
  list: AchievementRecordProps[];
}) => {
  const totalReward = list.reduce((prev, item) => {
    return prev + Number(item.reward.prize);
  }, 0);

  return (
    <div className=" mt-3">
      <div className=" ">
        {list && (
          <div className="border-t ">
            <table className="w-full mt-1" cellPadding={5}>
              <thead className="">
                <tr className="bg-gray-100  ">
                  <th className="text-xs text-gray-500 text-start">Claimed</th>
                  <th className="text-xs text-gray-500 text-start">Reward</th>
                </tr>
              </thead>
              {list.length == 0 && (
                <div className="mt-16 absolute top-56 left-1/2 -translate-x-1/2">
                  <NoData />
                </div>
              )}
              {list.length != 0 && (
                <tbody>
                  {list.map((record, i) => (
                    <tr key={i} className={`${i % 2 != 0 && "bg-gray-50"}`}>
                      <td className="text-[11px] text-start">
                        {moment(record.createdAt).calendar()}
                      </td>
                      <td className="text-[11px] text-start">
                        {Number(record.reward.prize).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )}
      </div>

      <div className="fixed left-0 bottom-0 w-full h-[80px] shadow-[0_7px_29px_rgba(100,100,111,0.2)]">
        <div className="flex w-full justify-center items-center pt-2 ">
          <div className="flex-1 text-center">
            <h4 className="text-[#555555] text-base font-bold">Total</h4>
            <h4 className="text-[#555555] text-base font-bold">
              {Number(totalReward).toFixed(2)}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RebateItemData {
  id: string | number;
  transactionDate: string;
  settlementDateTime: string;
  bettingAmount: number;
  rebateRate: number;
  rebateAmount: number;
}

const RebateCard = ({ item }: { item: RebateItemData }) => {
  return (
    <div className="w-full font-sans mb-6 rounded-sm ">
      {/* Dates Header */}
      <div className="flex justify-between items-center mb-3 px-1 ">
        <span className="text-[#333333] font-bold text-sm tracking-tight">
          {item.transactionDate ? item.transactionDate.split(/[\sT]/)[0] : ""}
        </span>
        <span className="text-[#555555] font-bold text-sm tracking-tight">
          {item.settlementDateTime
            ? item.settlementDateTime.replace("T", " ").split(".")[0]
            : ""}
        </span>
      </div>

      {/* Table Box Container */}
      <div className=" rounded-xl   flex flex-col  bg-gray-50">
        {/* 1. TABLE HEADER ROW */}
        <div className="flex w-full items-start bg-gray-100 p-2 rounded-sm ">
          <div className="w-[45%] text-left">
            <span className="text-[#666666] text-center font-bold text-[13px] md:text-sm leading-tight min-h-[36px] flex items-start">
              Direct downline deposit amount
            </span>
          </div>
          <div className="w-[25%] text-center flex justify-center">
            <span className="text-[#666666] font-bold text-[13px] md:text-sm leading-tight min-h-[36px] flex items-start justify-center">
              Rebate rate
            </span>
          </div>
          <div className="w-[30%] text-right flex justify-end">
            <span className="text-[#666666] font-bold text-[13px] md:text-sm leading-tight min-h-[36px] flex items-start justify-end">
              Rebate amount
            </span>
          </div>
        </div>

        {/* 2. TABLE DATA ROW */}
        <div className="flex w-full items-center p-2 ">
          <div className="w-[45%] text-center">
            <span className="text-black  text-sm font-bold">
              {Number(item.bettingAmount).toFixed(2)}
            </span>
          </div>
          <div className="w-[25%] text-center">
            <span className="text-black text-center   text-sm font-bold">
              {item.rebateRate}%
            </span>
          </div>
          <div className="w-[30%] text-center">
            <span className="text-[#3a65f6]   text-sm font-bold">
              {Number(item.rebateAmount).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Divider Line */}
      <div className="border-b border-gray-200 pt-5 w-full" />
    </div>
  );
};

const RebateRecordList = ({ list }: { list: RebateItemData[] }) => {
  const totalBetting = list.reduce((prev, item) => {
    return prev + Number(item.bettingAmount);
  }, 0);

  const totalReward = list.reduce((prev, item) => {
    return prev + Number(item.rebateAmount);
  }, 0);

  return (
    <div>
      <div className="max-w-2xl mx-auto py-10 px-4 bg-white min-h-screen ">
        {list && list.length > 0 ? (
          list.map((item) => <RebateCard key={item.id} item={item} />)
        ) : (
          <div className="mt-16 absolute top-56 left-1/2 -translate-x-1/2">
            <NoData />
          </div>
        )}
      </div>

      <div className="fixed left-0 bottom-0 w-full h-[80px] shadow-[0_7px_29px_rgba(100,100,111,0.2)]">
        <div className="flex w-full justify-center items-center pt-2 ">
          <div className="flex-1 text-center">
            <h4 className="text-[#555555] text-base font-bold">
              Betting amount
            </h4>
            <h4 className="text-[#555555] text-base font-bold">
              {Number(totalBetting).toFixed(3)}
            </h4>
          </div>
          <div className="flex-1 text-center">
            <h4 className="text-[#555555] text-base font-bold">
              Rebate amount
            </h4>
            <h4 className="text-[#555555] text-base font-bold">
              {Number(totalReward).toFixed(2)}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
