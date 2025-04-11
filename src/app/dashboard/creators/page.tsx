/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import api from "@/utils/axiosInstance";
import { Badge, Button, Input, Modal, Select } from "antd";
import { Compass, Linkedin, Store, Globe, RefreshCwIcon, Search, LocateIcon, MapPin } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "sonner";

const { Option } = Select;

export default function Creators() {
    const [creators, setCreators] = React.useState([]);

    const [filterData, setFilterData] = React.useState([]);

    const handleFiltering = (e) => {
        if (e.target.value === "" || e.target.value === null) {
            setFilterData(creators);
            return;
        }

        const searchQuery = e.target.value;
        const filteredData = creators.filter((campaign) => {
            return campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                campaign.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                campaign.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        });
        setFilterData(filteredData);
    }

    const [activeTags, setActiveTags] = React.useState([]);

    useEffect(() => {
        if (activeTags.length > 0) {
            const filteredData = creators.filter((campaign) => {
                return activeTags.every((tag) => campaign.tags.includes(tag));
            });
            setFilterData(filteredData);
        }
        else {
            setFilterData(creators);
        }
    }, [activeTags])



    const resetTags = () => {
        setActiveTags([]);
        setFilterData(creators);
    }

    const [addToCampaign, setAddToCampaign] = React.useState(false);
    const [selectedCampaign, setSelectedCampaign] = React.useState(null);
    const addToCampaignModal = () => {
        return (
            <Modal
                title="Add to Campaign"
                open={addToCampaign}
                onCancel={() => setAddToCampaign(false)}
                footer={null}
                width={400}
                centered
            >
                <div className="flex items-center gap-4 bg-neutral-50 p-2 px-4 rounded-xl">
                    <img loading="lazy" src={
                        creator.image?.includes("http")
                            ? creator.image
                            : process.env.NEXT_PUBLIC_SERVER_URL + creator.image
                    } alt="" 
                        className="w-12 h-12 rounded-full"
                    />
                    <h2 className="text-md font-bold text-neutral-600">
                        {creator.name}
                    </h2>
                </div>
                <div className="mt-4">
                    <p className="text-neutral-900 text-md mb-2">
                        Select Campaign</p>
                    <Select
                        placeholder="Select Campaign"
                        className="w-full"
                        size="large"
                        onChange={(value) => setSelectedCampaign(value)}
                        value={selectedCampaign}
                    >
                        {campaigns.map((campaign, index) => (
                            <Option key={index} value={campaign._id}>{campaign.title}</Option>
                        ))}
                    </Select>
                </div>
                <div className="mt-4">
                    <Button
                        size="large"
                        className="bg-primary-700 text-white w-full"
                        onClick={() => {
                            AddToCampaign({
                                campaignId: selectedCampaign
                            });
                        }}
                    >
                        Add to Campaign
                    </Button>
                </div>
            </Modal>
        );
    }

    const getCreators = async () => {
        try {
            const res = await api.get("/users/creators");
            setCreators(res.data);
            setFilterData(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getCreators();
    }, []);

    const [creator, setCreator] = React.useState({});
    const AddToCampaign = async ({
        campaignId,
    }) => {
        if (creator) {
            try {
                const res = await api.post(`/campaigns/${campaignId}/add`, {
                    creatorId: creator._id
                });
                toast.success("Creator added to campaign successfully.", {
                    position: "top-right",
                    description: `${creator.name} has been added to Campaign` + res.data.title,
                })
                setAddToCampaign(false);
            }
            catch (ex) {
                console.log(ex)
            }
        } else {
            toast.error("Error", {
                position: "top-right",
                description: "Please select a creator to add to the campaign.",
            })
        }
    }

    const [campaigns, setCampaigns] = React.useState([]);
    const getCampaigns = async () => {
        try {
            const res = await api.get("/campaigns/related-cg")
            setCampaigns(res.data)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getCampaigns();
    }, []);


    return (
        <div className="flex">
            {addToCampaignModal()}
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50 px-4 py-12 overflow-y-auto max-h-screen">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    Discover Creators
                    <Compass className="w-6 h-6 text-neutral-600" />
                </h1>
                <p className="text-lg">Explore creators looking to collaborate and sponsor you in endless ways.</p>

                {/* Filtering Section */}
                <div className="w-[40%] hidden md:block mt-4">
                    <Input
                        prefix={<Search className="w-5 h-5 text-neutral-600" />}
                        type="text" placeholder="Search creators and keywords..." className="w-full p-2 rounded-lg bg-neutral-100"
                        onChange={handleFiltering}
                    />
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-4">
                    {
                        creators.reduce((acc, campaign) => {
                            campaign.tags.forEach((tag) => {
                                if (!acc.includes(tag)) {
                                    acc.push(tag);
                                }
                            });
                            return acc;
                        }
                            , []).map((tag, index) => (
                                <span
                                    onClick={() => {
                                        if (activeTags.includes(tag)) {
                                            setActiveTags(activeTags.filter((activeTag) => activeTag !== tag));
                                        }
                                        else {
                                            setActiveTags([...activeTags, tag]);
                                        }
                                    }}
                                    key={index}
                                    className={`
                                        flex items-center justify-center
                                        text-center
                                        border border-neutral-200 text-sm px-3 py-1 rounded-full
                                        cursor-pointer ${activeTags.includes(tag) ? "bg-primary-700 text-white" : "bg-neutral-100 text-neutral-600"}
                                    `}
                                >{tag}</span>
                            ))
                    }
                    <span onClick={() => resetTags()} className="bg-primary-700 text-white text-sm px-3 py-1 rounded-full flex items-center cursor-pointer">Reset Tags <RefreshCwIcon
                        className="ml-1 w-4 h-4 inline-block text-white"

                    /></span>
                </div>

                <h3 className="mt-8 text-xl font-regular mb-4">
                    Featured Creators
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filterData.map((creator, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg p-6 space-y-4 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-14 h-14">
                                            <img loading="lazy" src={
                                                creator.image?.includes("http")
                                                    ? creator.image
                                                    : process.env.NEXT_PUBLIC_SERVER_URL + creator.image
                                            } alt={creator.name} className="w-14 h-14 rounded-full" />
                                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-lg">{creator.name}</h2>
                                            <p className="text-sm text-neutral-500 flex items-center">
                                                <MapPin
                                                    className="w-4 h-4 text-neutral-600 mr-1"
                                                />
                                                {creator.location}</p>
                                            <div className="flex items-center gap-2 mt-2 text-sm text-neutral-600">
                                                <img loading="lazy" src="/icons/linkedin.svg" alt="" />
                                                {creator.followers} LinkedIn Followers
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between space-x-2">
                                        {/* <Link href={creator?.website} target="_blank" className="flex items-center gap-2 text-neutral-600 bg-neutral-50 rounded-full p-2">
                                            <Globe className="w-5 h-5" />
                                        </Link> */}
                                        <Link href={`/dashboard/user-preview/${creator._id}`} className="flex items-center gap-2 text-primary-600 bg-neutral-50 rounded-full p-2">
                                            <Store className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                                <p className="text-sm text-neutral-700 mt-4">{creator?.description}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {creator?.tags.map((tag, index) => (
                                        <span key={index} className="text-neutral-600  text-sm px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/dashboard/inbox" className="w-full">
                                    <Button className="w-full px-4 py-2 border border-neutral-300 rounded-lg">Message</Button>
                                </Link>
                                <Button
                                    onClick={() => {
                                        setAddToCampaign(true)
                                        setCreator(creator);
                                    }}
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
                                >Add to Campaign</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
