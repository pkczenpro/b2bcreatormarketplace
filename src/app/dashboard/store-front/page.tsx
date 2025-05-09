"use client";

import dynamic from "next/dynamic";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";

const BrandDashboard = dynamic(() => import("@/components/Dashboard/BrandDashboard"));

export default function StoreFrontPage() {
    return (
        <div className="flex">
            <LeftMenu />
            <div className="w-full overflow-y-auto max-h-screen">
                <BrandDashboard isPreview={true} />
            </div>
        </div>
    );
}