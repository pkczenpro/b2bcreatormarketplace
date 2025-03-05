/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { Breadcrumb } from "antd";
import { DotIcon } from "lucide-react";
import React from "react";
import { Image, Mic, Text, Video } from "lucide-react";
import Button from "@/components/Button/Button";
import { motion } from "framer-motion";
import Tabs from "@/components/Tabs/Tabs";

import { BarChartComponent } from "@/components/Charts/BarChart";
import { InteractiveBarChart } from "@/components/Charts/InteractiveBarChart";
import { CreatorTable } from "@/components/BrandTables/Creators";
import { ContentTable } from "@/components/BrandTables/Content";
import Link from "next/link";
import { toast } from "sonner";

type CampaignDetailsProps = object;

export default function CampaignDetails({ }: CampaignDetailsProps) {
    const userType = localStorage.getItem("userType");

    const campaignOverview = () => {
        return (
            <>
                <div className="border rounded-md shadow-sm border-neutral-100 mt-8 p-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-h6 font-bold">
                            Content
                        </h3>
                        <div className="flex items-end text-neutral-600">
                            <span className="font-bold text-3xl mr-1">
                                30
                            </span>
                            <p className="text-neutral-600 mb-[1px]">Total Content</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="border rounded-md shadow-sm border-neutral-100 mt-8 p-8 w-full">
                            <h3 className="text-h6 font-[400]">
                                Content Distribution
                            </h3>
                            <BarChartComponent />
                        </div>
                        <div className="border rounded-md shadow-sm border-neutral-100 mt-8 p-8 w-full ml-8">
                            <h3 className="text-h6 font-[400]">
                                Number of Content
                            </h3>
                            <BarChartComponent />
                        </div>
                    </div>
                </div>
                <div className="border rounded-md shadow-sm border-neutral-100 mt-8 p-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-h6 font-bold">
                            Engagement
                        </h3>
                        <div className="flex items-end text-neutral-600">
                            <span className="font-bold text-3xl mr-1">
                                18M
                            </span>
                            <p className="text-neutral-600 mb-[1px]">Total Engagement</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="border rounded-md shadow-sm border-neutral-100 mt-8 p-8 w-[80%]">
                            <InteractiveBarChart
                                title="Engagement Rate"
                                description="Showing total visitors for the last 3 months"
                            />
                        </div>
                        <div className="w-[20%] ml-8">
                            <div className="border rounded-md shadow-sm border-neutral-100 mt-8 p-3">
                                <span className="font-bold text-3xl mr-1">
                                    10
                                </span>
                                <p className="text-neutral-600 mb-[1px]">Likes</p>
                            </div>
                            <div className="border rounded-md shadow-sm border-neutral-100 mt-8 p-3">
                                <span className="font-bold text-3xl mr-1">
                                    10
                                </span>
                                <p className="text-neutral-600 mb-[1px]">Likes</p>
                            </div>
                            <div className="border rounded-md shadow-sm border-neutral-100 mt-8 p-3">
                                <span className="font-bold text-3xl mr-1">
                                    10
                                </span>
                                <p className="text-neutral-600 mb-[1px]">Likes</p>
                            </div>
                            <div className="border rounded-md shadow-sm border-neutral-100 mt-8 p-3">
                                <span className="font-bold text-3xl mr-1">
                                    10
                                </span>
                                <p className="text-neutral-600 mb-[1px]">Likes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const campaignAbout = () => {
        return (
            <>
                <p className="text-md mt-4 text-neutral-600 font-regular">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt vel temporibus illo! Maxime doloribus deleniti nulla id nisi perspiciatis voluptate libero! Odio ipsum sed tempore.
                </p>

                <h3 className="text-h6 font-bold mt-8">
                    Goals and Deliverables
                </h3>

                <ul>
                    <li className="flex items-center mt-2">
                        <DotIcon className="w-6 h-6 " />
                        <p className="text-md ml-2">Goal 1</p>
                    </li>
                    <li className="flex items-center mt-2">
                        <DotIcon className="w-6 h-6 " />
                        <p className="text-md ml-2">Goal 2</p>
                    </li>
                    <li className="flex items-center mt-2">
                        <DotIcon className="w-6 h-6 " />
                        <p className="text-md ml-2">Goal 3</p>
                    </li>
                </ul>

                <div className="flex mt-8">
                    <h3>Target Audience</h3>
                    <div className="flex space-x-2 ml-4">
                        <Image className="text-neutral-600" />
                        <Video className="text-neutral-600" />
                        <Mic className="text-neutral-600" />
                        <Text className="text-neutral-600" />
                    </div>
                </div>

                {/* tags */}
                <div className="flex mt-4">
                    <div className="flex space-x-2">
                        <span className="bg-neutral-50 text-neutral-600 border px-4 py-1 border-neutral-600 rounded-full text-text-small">Tag 1</span>
                        <span className="bg-neutral-50 text-neutral-600 border px-4 py-1 border-neutral-600 rounded-full text-text-small">Tag 2</span>
                        <span className="bg-neutral-50 text-neutral-600 border px-4 py-1 border-neutral-600 rounded-full text-text-small">Tag 3</span>
                    </div>
                </div></>
        )
    }

    const campaignCreators = () => {
        return (
            <div className="mt-4">
                <CreatorTable />
            </div>
        )
    }

    const campaignContent = () => {
        return (
            <div className="mt-4">
                <ContentTable />
            </div>
        )
    }

    return (
        <div className="flex">
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50 p-12">
                <Breadcrumb
                    items={[
                        {
                            title: "Campaigns", // todo: replace with actual brand name
                        },
                        {
                            title: 'Campaign Name', // todo: replace with actual campaign name
                        }
                    ]}
                />
                <div className="mt-4 flex flex-col w-full px-8 py-8 bg-white rounded-lg shadow-sm">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <img src="/images/campaign.png" alt="campaign" />
                        <div className="flex items-center mt-4">
                            <h1 className="text-2xl font-bold">
                                Campaign Name
                            </h1>
                            <Link
                                className="ml-auto max-w-[200px]"
                                href={userType === "brand" ? "/dashboard/creators" : ""}
                            >
                                <Button
                                    className="ml-auto max-w-[200px]"
                                    variant="primary"
                                    size="small"
                                    onClick={() => {
                                        if (userType === "creator")
                                            toast.success("Campaign applied successfully", {
                                                position: "top-right",
                                                description: "You have successfully applied for the campaign",
                                            });
                                    }}
                                >
                                    {userType === "creator" ? "Apply for Campaign" : "Find Creators"}
                                </Button>
                            </Link>
                        </div>
                        <p className="text-md mt-2">
                            06th August 2024 - 18th August 2020
                        </p>
                        <div className="mt-4">
                            {userType === "creator" ? campaignAbout() :
                                <Tabs
                                    localStorageKey="campaignDetails"
                                    tabs={[
                                        {
                                            id: 1,
                                            label: "About",
                                            content: campaignAbout()
                                        },
                                        {
                                            id: 2,
                                            label: "Overview",
                                            content: campaignOverview()
                                        },
                                        {
                                            id: 3,
                                            label: "Creators",
                                            content: campaignCreators()
                                        },
                                        {
                                            id: 4,
                                            label: "Content",
                                            content: campaignContent()
                                        },
                                    ]}

                                />
                            }
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
