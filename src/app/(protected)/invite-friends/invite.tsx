"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "./overview";
import Rewards from "./rewards";
import Records from "./records";
import { useFindInvitationRewardDataQuery } from "@/lib/features/rewardApiSlice";
import Earning from "./earning";

const Invite = () => {
  const { data, isLoading } = useFindInvitationRewardDataQuery();

  const rewards = data?.rewards;

  const statictic = data?.statictic;
  return (
    <div>
      {(!data || isLoading) && (
        <div className="w-full h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {rewards && statictic && !isLoading && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="border-b bg-white w-full py-5   left-0 !rounded-none flex-nowrap !flex overflow-x-auto scrollbar-none">
            <TabsTrigger
              value="overview"
              className="text-base  flex-1 data-[state=active]:text-blue-600 data-[state=active]:border-b data-[state=active]:border-b-blue-600 rounded-none !shadow-none "
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="text-base flex-1 data-[state=active]:text-blue-600 data-[state=active]:border-b data-[state=active]:border-b-blue-600 rounded-none !shadow-none "
            >
              Rewards
            </TabsTrigger>
            <TabsTrigger
              value="earning"
              className="text-base flex-1 data-[state=active]:text-blue-600 data-[state=active]:border-b data-[state=active]:border-b-blue-600 rounded-none !shadow-none "
            >
              Earning
            </TabsTrigger>
            <TabsTrigger
              value="records"
              className="text-base flex-1 data-[state=active]:text-blue-600 data-[state=active]:border-b data-[state=active]:border-b-blue-600 rounded-none !shadow-none "
            >
              Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="px-3 py-6">
            <Overview statictic={statictic} />
          </TabsContent>
          <TabsContent value="rewards" className="px-3 py-6">
            <Rewards rewards={rewards} />
          </TabsContent>
          <TabsContent value="records" className="px-3 py-6">
            <Records />
          </TabsContent>

          <TabsContent value="earning" className="px-3 py-6">
            <Earning />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Invite;
