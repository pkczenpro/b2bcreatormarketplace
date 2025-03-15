/* eslint-disable @next/next/no-img-element */
"use client";

import BrandDashboard from "@/components/Dashboard/BrandDashboard";
import CreatorDashboard from "@/components/Dashboard/CreatorDashboard";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import withAuth from "@/utils/withAuth";
import React from "react";


type DashboardProps = object;

function Dashboard({ }: DashboardProps) {
  const [userType, setUserType] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setUserType(localStorage.getItem("userType"));
    }
  }, []);

  if (!userType) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row">
      <LeftMenu />
      <div className="flex flex-col w-full min-h-screen bg-neutral-50">
        {userType === "creator" ? <CreatorDashboard /> :
          <BrandDashboard isPreview={false}/>}
      </div>
    </div >
  );
}

export default withAuth(Dashboard);
