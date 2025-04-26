/* eslint-disable @next/next/no-img-element */
"use client";

import CustomImage from "@/components/CustomImage";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import Input from "@/components/Input/Input";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import api from "@/utils/axiosInstance";
import { Select, Badge, Tooltip } from "antd";
import { EarthIcon, Shuffle, Search, Filter, Calendar, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Campaign {
  id: string;
  title: string;
  company: string;
  description: string;
  image?: string;
  status?: string;
  category?: string;
  channels?: string;
  startDate?: string;
  participants?: number;
  budget?: string | number;
}

export default function Campaign() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCampaigns = async () => {
      setLoading(true);
      try {
        const res = await api.get("/campaigns");
        setCampaigns(res.data);
        setFilteredCampaigns(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getCampaigns();
  }, []);

  useEffect(() => {
    let filtered = campaigns;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (campaign) =>
          campaign?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          campaign?.company?.toLowerCase()?.includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "1") {
      filtered = filtered.filter((campaign) => campaign.category === selectedCategory);
    }

    setFilteredCampaigns(filtered);
  }, [searchQuery, selectedCategory, campaigns]);

  const getStatusColor = (status?: string): "success" | "processing" | "warning" | "default" => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'completed':
        return 'processing';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="flex">
      <LeftMenu />
      <div className="flex flex-col w-full min-h-screen bg-neutral-50 px-4 py-8 md:px-8 md:py-12 overflow-y-auto max-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-lg text-gray-600 mt-2">Discover and connect with brands looking for creators</p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search campaigns by title or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Filter size={16} />
                <span className="text-sm font-medium">Filter by</span>
              </div>
              <Select
                defaultValue="1"
                style={{ width: "100%" }}
                onChange={(value) => setSelectedCategory(value)}
                className="w-full"
              >
                <Select.Option value="1">All Categories</Select.Option>
                {[...new Set(campaigns
                  .filter(campaign => campaign.category)
                  .map(campaign => campaign.category))].map((category) => (
                    <Select.Option key={category} value={category}>
                      {category}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Campaign List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full">
              <LoadingOverlay loading={loading} />
            </div>
          ) : filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign) => (
              <Link
                href={`/dashboard/campaigns-details/${campaign.id}`}
                key={campaign.id}
                className="group bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary-100"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <CustomImage
                      loading="lazy"
                      src={
                        campaign?.image
                          ? campaign.image.includes("http")
                            ? campaign.image
                            : `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${campaign.image}`
                          : '/placeholder-image.png'
                      }
                      alt="campaign"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <Badge
                      status={getStatusColor(campaign.status)}
                      className="absolute -top-1 -right-1"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {campaign.title.length > 50
                        ? `${campaign.title.slice(0, 50)}...`
                        : campaign.title}
                    </h3>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-600">{campaign.company}</p>
                      <Tooltip title="Company Location">
                        <EarthIcon size={16} className="ml-2 text-gray-400" />
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {campaign.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {campaign.channels && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
                        <Shuffle size={14} className="mr-1" />
                        {campaign.channels}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <Tooltip title="Start Date">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </Tooltip>
                      <Tooltip title="Participants">
                        <div className="flex items-center">
                          <Users size={14} className="mr-1" />
                          {campaign.participants || 0}
                        </div>
                      </Tooltip>
                      <Tooltip title="Budget">
                        <div className="flex items-center">
                          <DollarSign size={14} className="mr-1" />
                          {campaign.budget || 'N/A'}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No campaigns found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
