/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import Input from "@/components/Input/Input";
import { Breadcrumb, Select } from "antd";
import { EarthIcon, Search, Shuffle } from "lucide-react";
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

export default function Campaign() {
  return (
    <div className="flex">
      <LeftMenu />
      <div className="flex flex-col w-full min-h-screen bg-neutral-50 px-4 py-12">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <p className="text-lg">Explore brands actively looking for creators</p>

        <div className="flex mt-8 justify-between">
          <div className="w-1/3">
            <Input placeholder="Search for Campaigns" />
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
        <div className="grid grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg p-8 border border-1 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:border-neutral-100"
            >
              <div className="flex items-center">
                <img src={campaign.image} alt="campaign" className="w-14 h-14 object-cover rounded-full" />
                <div className="ml-4">
                  <h3 className="mb-1">{campaign.title}</h3>
                  <div className="flex items-center">
                    <p className="text-md text-neutral-600">{campaign.company}</p>
                    <img src={campaign.icon} alt="platform" className="ml-2 mr-2 w-5 h-5" />
                    <EarthIcon size={20} className="mr-2" />
                  </div>
                </div>
              </div>

              <ul className="mt-8 text-neutral-600">
                <li className="flex items-center">
                  <Search size={20} className="mr-2" />
                  {campaign.description}
                </li>
                <li className="flex items-center mt-1">
                  <Shuffle size={20} className="mr-2" />
                  {campaign.channels}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
