/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { Button } from "antd";
import { Compass } from "lucide-react";
import Link from "next/link";
import React from "react";

const campaigns = [
    {
        id: 1,
        name: "Dave Kline",
        location: "Norwalk, CT, USA",
        followers: "61k",
        engagement: "94k",
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
        image: "/images/profile_2.png",
        description: "Are your customers your growth engine? They should be. I’ve been a GTM executive for 9+ years achieving revenue and sales team on GTM motions.",
        tags: ["Sales", "Leadership", "Business Growth"]
    }
];

export default function Brands() {
    return (
        <div className="flex">
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50 px-4 py-12">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    Discover Brands
                    <Compass className="w-6 h-6 text-neutral-600" />
                </h1>
                <p className="text-lg">Explore brands looking to collaborate and sponsor you in endless ways.</p>

                <h3 className="mt-8 text-xl font-regular mb-4">Featured</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {campaigns.map((creator) => (
                        <div key={creator.id} className="bg-white rounded-2xl shadow-lg p-6 space-y-4 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center space-x-4">
                                    <img src={creator.image} alt={creator.name} className="w-14 h-14 rounded-full" />
                                    <div>
                                        <h2 className="font-semibold text-lg">{creator.name}</h2>
                                        <p className="text-sm text-neutral-500">{creator.location}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-neutral-700 mt-4">{creator.description}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {creator.tags.map((tag, index) => (
                                        <span key={index} className="bg-neutral-200 text-sm px-3 py-1 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Message</Button>
                                <Button className="px-4 py-2 border border-neutral-300 rounded-lg">Add to Campaign</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
