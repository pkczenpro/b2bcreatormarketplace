/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import Input from "@/components/Input/Input";
import { Select, Table } from "antd";
import { Compass, DiscIcon, EarthIcon, Search, Shuffle } from "lucide-react";
import Link from "next/link";
import React from "react";

const campaigns = [
    {
        id: 1,
        title: "Webflow | Creator Program 2025",
        company: "Webflow",
        platform: "LinkedIn",
        image: "/images/profile_2.png",
        icon: "/icons/linkedin.svg",
        description: "All creators who see a fit are welcome to apply",
        channels: "LinkedIn, YouTube, Podcasts"
    },
    {
        id: 2,
        title: "Shopify | Influencer Program 2025",
        company: "Shopify",
        platform: "Instagram",
        image: "/images/profile_2.png",
        icon: "/icons/instagram.svg",
        description: "Looking for influencers to promote Shopify",
        channels: "Instagram, TikTok, Twitter"
    },
    {
        id: 3,
        title: "Squarespace | Brand Ambassador 2025",
        company: "Squarespace",
        platform: "Twitter",
        image: "/images/profile_2.png",
        icon: "/icons/twitter.svg",
        description: "Join the Squarespace ambassador program",
        channels: "Twitter, YouTube, Facebook"
    }
];

export default function Creators() {
    return (
        <div className="flex">
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50 px-4 py-12">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    Discover Brands
                    <Compass className="w-6 h-6 text-neutral-600" />
                </h1>
                <p className="text-lg">Explore brands looking to collaborate and sponsor you in endless ways.</p>

                <div className="flex mt-8 justify-between">
                    <div className="w-1/3">
                        <Input placeholder="Search for Creators" />
                    </div>
                    <div className="w-1/4">
                        <Select defaultValue="1" style={{ width: "100%" }}>
                            <Select.Option value="1">All</Select.Option>
                            <Select.Option value="2">Webflow</Select.Option>
                            <Select.Option value="3">Shopify</Select.Option>
                            <Select.Option value="4">Wix</Select.Option>
                            <Select.Option value="5">Squarespace</Select.Option>
                        </Select>
                    </div>
                </div>

                <h3 className="mt-8 text-xl font-regular mb-4">Featured</h3>
                <Table
                    size="small"
                    tableLayout="fixed"
                    columns={[
                        {
                            title: "Brand",
                            dataIndex: "company",
                            key: "company",
                            render: (text, record) => (
                                <div className="flex items-center space-x-2">
                                    <img src={record.image} alt={record.company} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <h1 className="font-semibold">{record.company}</h1>
                                        <p className="text-sm text-neutral-500">{record.platform}</p>
                                    </div>
                                </div>
                            )
                        },
                        {
                            title: "Description",
                            dataIndex: "description",
                            key: "description"
                        },
                        {
                            title: "Channels",
                            dataIndex: "channels",
                            key: "channels"
                        },
                        {
                            title: "Action",
                            dataIndex: "id",
                            key: "id",
                            render: (text) => (
                                <Link href={`/dashboard/creators/${text}`}>
                                    <div className="flex items-center space-x-2 text-primary-500">
                                        <DiscIcon className="w-6 h-6" />
                                        <p>View Profile</p>
                                    </div>
                                </Link>
                            )
                        }
                    ]}
                    dataSource={campaigns}
                    pagination={false}
                />
            </div>
        </div>
    );
}
