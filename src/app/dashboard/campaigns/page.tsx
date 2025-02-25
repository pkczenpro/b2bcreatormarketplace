/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import React from "react";

type CampaignProps = object;

export default function Campaign({}: CampaignProps) {
  return (
    <div className="flex">
      <LeftMenu />
      <div className="flex flex-col w-full min-h-screen bg-neutral-50"></div>
    </div>
  );
}
