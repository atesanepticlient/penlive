"use client";
import React, { useState } from "react";
import { FaClock} from "react-icons/fa";
import MissionCard from "./mission-card";
import { useGetMissionsQuery } from "@/lib/features/missionsApiSlice";
import { IoIosRocket } from "react-icons/io";
import { IoHandLeft } from "react-icons/io5";
import MissionPageHeader from "./header";

export type Tab = "TODAY" | "COMING_SOON" | "FINISHED";

const MissionPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("TODAY");
  const { data, isLoading, refetch } = useGetMissionsQuery();
  console.log({ data });
  const tabs: { label: string; value: Tab; icon: any }[] = [
    { label: "In Progress", value: "TODAY", icon: <IoIosRocket /> },
    { label: "Coming Soon", value: "COMING_SOON", icon: <FaClock /> },
    { label: "Finished", value: "FINISHED", icon: <IoHandLeft /> },
  ];
  const mission = data?.mission;
  const finishedMissions = data?.finishedMissions;
  const comingMissions = data?.comingMissions;
  // const missions = data?.missions?.filter((m) => m.status === activeTab) || [];

  return (
    <div className="bg-[#F5F5F9] min-h-screen pb-20">
      <MissionPageHeader
        onRefresh={() => refetch()}
        currentValidBet={data?.currentValidBet || 0}
      />

      {/* Tabs */}
      <div className="fixed top-[115px] left-1/2 -translate-x-1/2  z-20 bg-white/90 backdrop-blur-sm  w-[95%] md:w-[460px] mx-auto py-3  rounded-lg  shadow-sm">
        <div className="flex ">
          {tabs.map((tab, i) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors relative ${i !== tabs?.length - 1 && " border-r border-gray-300"} ${
                activeTab === tab.value ? "text-red-500" : "text-gray-500"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pt-4 relative translate-y-9">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D4AF37]" />
          </div>
        ) : !mission ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No missions available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab == "TODAY" && (
              <MissionCard
                key={mission.id}
                mission={mission}
                onClaimed={() => refetch()}
                tab={activeTab}
              />
            )}

            {activeTab == "COMING_SOON" && (
              <>
                {comingMissions?.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onClaimed={() => refetch()}
                    tab={activeTab}
                  />
                ))}
              </>
            )}
            {activeTab == "FINISHED" && (
              <>
                {finishedMissions?.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onClaimed={() => refetch()}
                    tab={activeTab}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionPage;
