/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { Breadcrumb } from "antd";
import React from "react";
import Button from "@/components/Button/Button";
import { motion } from "framer-motion";
import Tabs from "@/components/Tabs/Tabs";

import { BarChartComponent } from "@/components/Charts/BarChart";
import { InteractiveBarChart } from "@/components/Charts/InteractiveBarChart";
import { CreatorTable } from "@/components/BrandTables/Creators";
import { ContentTable } from "@/components/BrandTables/Content";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";
import { useParams } from "next/navigation";
import moment from "moment";
import { useRouter } from "next/navigation";

type CampaignDetailsProps = object;

export default function CampaignDetails({ }: CampaignDetailsProps) {
    const [userType, setUserType] = React.useState<string | null>(null);
    const { id } = useParams();
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setUserType(localStorage.getItem("userType"));
        }
    }, []);

    const [campaign, setCampaign] = React.useState(null);
    const getCampaign = async () => {
        try {
            const res = await api.get("/campaigns/" + id);
            console.log(res.data); // Log the data to ensure it's being fetched correctly
            setCampaign(res.data);
        } catch (e) {
            console.log("Error fetching campaign:", e);
            toast.error("Failed to load campaign data");
        }
    };


    React.useEffect(() => {
        getCampaign();
    }, [id]);

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
                    {campaign?.description}
                </p>

                <h3 className="text-h6 font-bold mt-8">
                    Goals and Deliverables
                </h3>

                <p>
                    {campaign?.goalsAndDeliverables}
                </p>

                <div className="flex mt-8">
                    <h3>Target Audience</h3>
                    <div className="flex space-x-2 ml-4">
                        {campaign?.contentTypes?.map((type: string, index: number) => (
                            <span key={index} className="bg-neutral-50 text-neutral-600 border px-4 py-1 border-neutral-600 rounded-full text-text-small">
                                {type}
                            </span>
                        ))}
                    </div>
                </div>

                {/* tags */}
                <div className="flex mt-4">
                    <div className="flex space-x-2">
                        {campaign?.tags.map((tag: string, index: number) => (
                            <span key={index} className="bg-neutral-50 text-neutral-600 border px-4 py-1 border-neutral-600 rounded-full text-text-small">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

            </>
        )
    }

    const campaignCreators = () => {
        return (
            <div className="mt-4">
                <CreatorTable campaign={campaign} />
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

    const navigation = useRouter();

    return (
        <div className="flex">
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50 p-12">
                <Breadcrumb
                    items={[
                        {
                            title: campaign?.brandId?.name,
                            href: "/dashboard/brand-preview/" + campaign?.brandId?._id
                        },
                        {
                            title: campaign?.title,
                        }
                    ]}
                />
                <div className="mt-4 flex flex-col w-full px-8 py-8 bg-white rounded-lg shadow-sm">
                    {campaign ? <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {campaign?.coverImage && <img loading="lazy" src={campaign?.coverImage} alt="campaign"
                            className="w-full h-[200px] object-cover rounded-md"
                        />}
                        <div className="flex items-center mt-4">
                            <h1 className="text-2xl font-bold">
                                {campaign?.title}
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
                                        if (userType === "creator") {
                                            toast.success("Campaign applied successfully", {
                                                position: "top-right",
                                                description: "You have successfully applied for the campaign",
                                            });
                                        }
                                        else {
                                            navigation.push("/dashboard/creators");
                                            // Redirect to creators page
                                        }
                                    }}
                                >
                                    {userType === "creator" ? "Apply for Campaign" : "Find Creators"}
                                </Button>
                            </Link>
                        </div>
                        <p className="text-md mt-2">
                            {moment(campaign?.startDate).format("MM/DD/YYYY")} - {moment(campaign?.endDate).format("MM/DD/YYYY")}
                        </p>
                        <div className="mt-4">
                            {(userType === "creator" || !campaign?.isOwner) ? (
                                campaignAbout()
                            ) : (
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
                            )}

                        </div>
                    </motion.div> : <div>Loading...</div>}
                </div>
            </div>
        </div>
    );
}
