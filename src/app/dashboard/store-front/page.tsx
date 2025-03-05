"use client";

import BrandDashboard from "@/components/Dashboard/BrandDashboard";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";

export default function StoreFrontPage() {
    return (
        <div className="flex">
            <LeftMenu />
            <div className="w-full">
                <BrandDashboard isPreview={true} />
            </div>
        </div>
    );
}