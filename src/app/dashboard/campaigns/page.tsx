/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import Input from "@/components/Input/Input";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import api from "@/utils/axiosInstance";
import { Select } from "antd";
import { EarthIcon, Shuffle } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Campaign() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("1"); // Default to "All"
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getCampaigns = async () => {
      setLoading(true);
      try {
        const res = await api.get("/campaigns");
        setCampaigns(res.data);
        setFilteredCampaigns(res.data); // Initialize filtered campaigns
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getCampaigns();
  }, []);

  // Function to filter campaigns
  useEffect(() => {
    let filtered = campaigns;

    // Search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "1") {
      filtered = filtered.filter((campaign) => campaign.category === selectedCategory);
    }

    setFilteredCampaigns(filtered);
  }, [searchQuery, selectedCategory, campaigns]);

  return (
    <div className="flex">
      <LeftMenu />
      <div className="flex flex-col w-full min-h-screen bg-neutral-50 px-4 py-12">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <p className="text-lg">Explore brands actively looking for creators</p>

        {/* Search & Filter Section */}
        <div className="flex flex-col md:flex-row mt-8 justify-between gap-4">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search for Campaigns"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/4">
            <Select
              defaultValue="1"
              style={{ width: "100%" }}
              onChange={(value) => setSelectedCategory(value)}
            >
              <Select.Option value="1">All</Select.Option>
              {filteredCampaigns.map((campaign) => (
                <Select.Option key={campaign.id} value={campaign.category}>
                  {campaign.company}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Campaign List */}
        <h3 className="mt-8 text-xl font-regular mb-4">Featured</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? <LoadingOverlay loading={loading} /> : filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign) => (
              <Link
                href={`/dashboard/campaigns-details/${campaign.id}`}
                key={campaign.id}
                className="bg-white rounded-lg p-6 border border-1 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:border-neutral-100"
              >
                <div className="flex items-center">
                  <img loading="lazy"
                    src={
                      campaign?.image?.includes("http")
                        ? campaign?.image
                        : process.env.NEXT_PUBLIC_SERVER_URL + campaign?.image
                    }
                    alt="campaign"
                    className="w-14 h-14 object-cover rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="mb-1">{campaign.title}</h3>
                    <div className="flex items-center">
                      <p className="text-md text-neutral-600">{campaign.company}</p>
                      <EarthIcon size={20} className="ml-2" />
                    </div>
                  </div>
                </div>

                <ul className="mt-4 text-neutral-600">
                  {campaign.description && (
                    <li className="flex items-center">
                      {campaign.description}
                    </li>
                  )}
                  {campaign.channels && (
                    <li className="flex items-center mt-1">
                      <Shuffle size={20} className="mr-2" />
                      {campaign.channels}
                    </li>
                  )}
                </ul>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">No campaigns found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
