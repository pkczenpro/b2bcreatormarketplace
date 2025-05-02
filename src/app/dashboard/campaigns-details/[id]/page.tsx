/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { Breadcrumb, Card, Input, Modal } from "antd";
import React from "react";
import Button from "@/components/Button/Button";
import { motion } from "framer-motion";
import Tabs from "@/components/Tabs/Tabs";

import { BarChartComponent } from "@/components/Charts/BarChart";
import { CreatorTable } from "@/components/BrandTables/Creators";
import { ContentTable } from "@/components/BrandTables/Content";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";
import { useParams } from "next/navigation";
import moment from "moment";
import { useRouter } from "next/navigation";
import { CheckCircle, Images, Sparkle } from "lucide-react";


type CampaignDetailsProps = object;

export default function CampaignDetails({ }: CampaignDetailsProps) {
    const [userType, setUserType] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { id } = useParams();

    const getUserDetails = async () => {
        setLoading(true);
        const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "")._id : null;
        if (!userId) return;
        let res = null;
        try {
            res = await api.get(`/users/user`);
            setUserType(res.data.userType);
        }
        catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        getUserDetails();
    }, []);


    const [campaign, setCampaign] = React.useState(null);
    const getCampaign = async () => {
        try {
            const res = await api.get("/campaigns/" + id);
            setCampaign(res.data);
        } catch (e) {
            console.log("Error fetching campaign:", e);
            toast.error("Failed to load campaign data");
        }
    };


    React.useEffect(() => {
        getCampaign();
    }, [id]);

    const [campaignAnalytics, setCampaignAnalytics] = React.useState(null);
    const getCampaignAnalytics = async () => {
        try {
            const res = await api.get("/campaigns/analytics/" + id);

            setCampaignAnalytics(res.data);
        } catch (e) {
            console.log("Error fetching campaign:", e);
            toast.error("Failed to load campaign data");
        }
    }

    React.useEffect(() => {
        getCampaignAnalytics();
    }, [id]);

    const transformData = (data: any) => {
        return data?.map((item: any) => ({
            label: item.label || item.type,
            count: item.count || item.value,
        })) || [];
    }


    const campaignOverview = () => {
        const contentDistribution = transformData(campaignAnalytics?.analytics?.contentDistribution);
        const contentCountByType = transformData(campaignAnalytics?.analytics?.contentCountByType);
        const statusMap = {
            pending: "Pending",
            approved: "Approved",
            rejected: "Rejected",
            done: "Done",
            prospect: "prospect",
            content_submitted: "Submitted",
        } as const;

        // Adjust content distribution into an array format that is compatible with the chart
        const adjustedContentDistribution = contentDistribution.map(item => ({
            label: item.label,
            count: item.count || 0,
        }));

        // Adjust content count by type for better clarity
        const adjustedContentCountByType = contentCountByType.map(item => ({
            label: statusMap[item.label as keyof typeof statusMap] || item.label,
            count: item.count || 0,
        }));
        return (
            <div className="mt-8 space-y-6">
                {/* Content Summary */}
                <div className="bg-white border border-neutral-100 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h3 className="text-xl font-semibold text-neutral-800">Campaign Content</h3>
                        <div className="flex items-end text-neutral-700">
                            <span className="font-bold text-4xl mr-2">
                                {campaignAnalytics?.analytics?.totalContent || 0}
                            </span>
                            <p className="text-sm text-neutral-500 mb-1">Total Content</p>
                        </div>
                    </div>
                </div>

                {/* Analytics Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Content Distribution by Type */}
                    <div className="bg-white border border-neutral-100 rounded-2xl p-6">
                        <h4 className="text-lg font-medium text-neutral-700 mb-4">Content Distribution</h4>
                        <BarChartComponent campaignAnalytics={adjustedContentDistribution} />
                    </div>

                    {/* Content Status Breakdown */}
                    <div className="bg-white border border-neutral-100 rounded-2xl p-6">
                        <h4 className="text-lg font-medium text-neutral-700 mb-4">
                            Number of Content by Status
                        </h4>
                        <BarChartComponent campaignAnalytics={adjustedContentCountByType} />
                    </div>
                </div>
            </div>
        );
    };

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
            <div className="mt-4 ">
                <CreatorTable campaign={campaign} Refresh={
                    () => {
                        getCampaign();
                    }
                } />
            </div>
        )
    }
    const campaignContent = () => {
        return (
            <div className="mt-4">
                <ContentTable campaign={campaign} Refresh={
                    () => {
                        getCampaign();
                    }
                } />
            </div>
        )
    }

    const navigation = useRouter();

    const [amount, setAmount] = React.useState(null);
    const applyToCampaign = async () => {
        try {
            await api.post(`/campaigns/${id}/apply`, {
                amount,
            })

            toast.success("Campaign applied successfully", {
                position: "top-right",
                description: "You have successfully applied for the campaign",
            });
            getCampaign();
        } catch (e) {
            console.log(e)
        }
    }

    const [amountModal, setAmountModal] = React.useState(false);


    const [creatingContentModal, setCreatingContentModal] = React.useState(false);
    return (
        <div className="flex flex-col sm:flex-row">
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50 p-12 overflow-y-auto max-h-screen">
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
                            <div className="ml-auto">
                                <Link
                                    className="max-w-[200px]"
                                    href={userType === "brand" ? "/dashboard/creators" : ""}
                                >
                                    <Button
                                        className="ml-auto w-[200px]"
                                        variant="primary"
                                        size="small"
                                        disabled={loading || campaign?.isApplied}
                                        loading={loading}
                                        onClick={() => {
                                            if (userType === "creator") {
                                                setAmountModal(true);
                                            } else {
                                                navigation.push("/dashboard/creators");
                                            }
                                        }}
                                    >
                                        {userType === "creator" ? (
                                            campaign?.isApplied ? (
                                                campaign?.status === "pending" ? (
                                                    "Application Under Review"
                                                ) : campaign?.status === "approved" ? (
                                                    "You’re Approved!"
                                                ) : campaign?.status === "rejected" ? (
                                                    "Not Selected"
                                                ) : campaign?.status === "done" ? (
                                                    "Campaign Completed"
                                                ) : campaign?.status === "prospect" ? (
                                                    "In Consideration"
                                                ) : campaign?.status === "content_submitted" ? (
                                                    "Content Submitted"
                                                ) : (
                                                    "You’ve Already Applied"
                                                )
                                            ) : (
                                                "Apply Now"
                                            )
                                        ) : (
                                            "Discover Creators"
                                        )}


                                    </Button>
                                </Link>
                                {campaign.status === "approved" && <Button className="ml-auto mt-2 w-[200px]"
                                    variant="primary"
                                    size="small"
                                    icon={<Sparkle className="text-white" />}
                                    onClick={() => {
                                        setCreatingContentModal(true);
                                    }}
                                >
                                    Start Creating Your Content
                                </Button>}
                            </div>





                        </div>
                        <p className="text-md mt-2">
                            {moment(campaign?.startDate).format("MM/DD/YYYY")} - {moment(campaign?.endDate).format("MM/DD/YYYY")}
                        </p>
                        <div className="mt-4">
                            {!campaign?.isOwner ? (
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
                                            label: (
                                                <div className="relative inline-flex items-center">
                                                    <span className="font-medium">Creators</span>
                                                    <span className="absolute -top-3 -right-5 bg-primary-600 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
                                                        {campaign?.selectedCreators?.length}
                                                    </span>
                                                </div>
                                            ),
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





            <Modal
                title="Join the Campaign 🚀"
                open={amountModal}
                onOk={() => {
                    applyToCampaign();
                    setAmountModal(false);
                }}
                onCancel={() => setAmountModal(false)}
                centered
                okText="Apply Now"
                cancelText="Maybe Later"
            >
                <p className="mb-3">
                    We'd love to have you on board! Let us know your charges for this campaign:
                </p>
                <Input
                    type="text"
                    value={formatPrice(amount?.toString())}
                    onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, ""); // Remove existing commas
                        setAmount(rawValue ? parseInt(rawValue, 10) : ""); // Ensure it's a number
                    }}
                    placeholder="Enter your rate (e.g., 1,000)"
                    prefix="💰"
                />
            </Modal>


            <Modal
                title="Start creating your Brand collaboration 🚀"
                open={creatingContentModal}
                onOk={() => setCreatingContentModal(false)}
                onCancel={() => setCreatingContentModal(false)}
                centered
                footer={null}
            >
                <Card>
                    <div className="flex flex-col items-center justify-center gap-4 w-full p-4">
                        <h2 className="text-xl font-semibold text-center">
                            🎉 Congratulations! <br /> You have been approved by <span className="text-primary-600">
                                {campaign?.brandId?.profileName}
                            </span>
                        </h2>

                        <div className="flex flex-col items-center justify-center gap-3 w-full mt-4">
                            <Link href="/dashboard/post-maker" className="w-full">
                                <Button className="w-full flex items-center justify-center gap-2" variant="primary" size="small">
                                    <CheckCircle size={16} /> Post Maker
                                </Button>
                            </Link>

                            <p className="text-center text-neutral-500">OR</p>

                            <Link href="/dashboard/carousel-maker" className="w-full">
                                <Button className="w-full flex items-center justify-center gap-2" variant="primary" size="small">
                                    <Images size={16} /> Carousel Maker
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </Modal>
        </div>
    );
}


const formatPrice = (value) => {
    if (!value) return "";
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Adds commas for thousands
};