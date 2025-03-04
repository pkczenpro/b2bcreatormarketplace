/* eslint-disable @next/next/no-img-element */
"use client";

import BrandDashboard from "@/components/Dashboard/BrandDashboard";
import CreatorDashboard from "@/components/Dashboard/CreatorDashboard";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import React from "react";


type DashboardProps = object;

export default function Dashboard({ }: DashboardProps) {
  const userType = "brand";
  return (
    <div className="flex">
      <LeftMenu />
      <div className="flex flex-col w-full min-h-screen bg-neutral-50">
        {userType === "creator" ? <CreatorDashboard /> : <BrandDashboard />}
      </div>
    </div >
  );
}
