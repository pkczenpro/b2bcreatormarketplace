/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { Badge, Button, Input } from "antd";
import { Compass, Linkedin, Store, Globe, RefreshCwIcon, Search, LocateIcon, MapPin } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const campaigns = [
    {
        id: 1,
        name: "Dave Kline",
        location: "Norwalk, CT, USA",
        followers: "61k",
        engagement: "94k",
        linkedin: "https://linkedin.com/in/davekline",
        website: "https://davekline.com",
        image: "/images/profile_2.png",
        description: "Training leaders on the playbook for leading high-performance teams. Entrepreneur | Writer | Speaker | Coach | 175K+ Social Media followers.",
        tags: ["Leadership", "Sales Management", "Coaching", "Entrepreneurship"]
    },
    {
        id: 2,
        name: "Brianna Doe",
        location: "United States",
        followers: "237k",
        engagement: "100k",
        linkedin: "https://linkedin.com/in/briannadoe",
        website: "https://briannadoe.com",
        image: "/images/profile_2.png",
        description: "I built a thriving, engaged audience of 225k+ professionals, marketers, and recruiters. My content focuses on entrepreneurship, marketing, leadership...",
        tags: ["Social Selling", "Content Marketing", "Management & Leadership"]
    },
    {
        id: 3,
        name: "Mark Kosoglow",
        location: "State College, Pennsylvania",
        followers: "56k",
        engagement: "112k",
        linkedin: "https://linkedin.com/in/markkosoglow",
        website: "https://markkosoglow.com",
        image: "/images/profile_2.png",
        description: "Are your customers your growth engine? They should be. I’ve been a GTM executive for 9+ years achieving revenue and sales team on GTM motions.",
        tags: ["Sales", "Leadership", "Business Growth"]
    }
];

export default function Brands() {

    const [filterData, setFilterData] = React.useState(campaigns);

    const handleFiltering = (e) => {
        if (e.target.value === "" || e.target.value === null) {
            setFilterData(campaigns);
            return;
        }

        const searchQuery = e.target.value;
        const filteredData = campaigns.filter((campaign) => {
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
            const filteredData = campaigns.filter((campaign) => {
                return activeTags.every((tag) => campaign.tags.includes(tag));
            });
            setFilterData(filteredData);
        }
        else {
            setFilterData(campaigns);
        }
    }, [activeTags])



    const resetTags = () => {
        setActiveTags([]);
        setFilterData(campaigns);
    }

    return (
        <div className="flex">
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50 px-4 py-12">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    Discover Brands
                    <Compass className="w-6 h-6 text-neutral-600" />
                </h1>
                <p className="text-lg">Explore brands looking to collaborate and sponsor you in endless ways.</p>

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
                        campaigns.reduce((acc, campaign) => {
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
                    Featured Brands
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filterData.map((creator) => (
                        <div key={creator.id} className="bg-white rounded-2xl shadow-lg p-6 space-y-4 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-14 h-14">
                                            <img src={creator.image} alt={creator.name} className="w-14 h-14 rounded-full" />
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
                                                <img src="/icons/linkedin.svg" alt="" />
                                                {creator.followers} LinkedIn Followers
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between space-x-2">
                                        <Link href={creator.website} target="_blank" className="flex items-center gap-2 text-neutral-600 bg-neutral-50 rounded-full p-2">
                                            <Globe className="w-5 h-5" />
                                        </Link>
                                        <Link href="/store-front" className="flex items-center gap-2 text-primary-600 bg-neutral-50 rounded-full p-2">
                                            <Store className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                                <p className="text-sm text-neutral-700 mt-4">{creator.description}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {creator.tags.map((tag, index) => (
                                        <span key={index} className="text-neutral-600  text-sm px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button className="w-full px-4 py-2 border border-neutral-300 rounded-lg">Message</Button>
                                <Button className="w-full px-4 py-2 border border-neutral-300 rounded-lg">Add to Campaign</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
