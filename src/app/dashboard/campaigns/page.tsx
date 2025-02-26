/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { Breadcrumb } from "antd";
import { ArrowRight, ChevronLeft, ChevronRight, Dot, DotIcon } from "lucide-react";
import React from "react";
import { Image, Mic, Text, Video } from "lucide-react";
import Button from "@/components/Button/Button";
type CampaignProps = object;

export default function Campaign({ }: CampaignProps) {
  return (
    <div className="flex">
      <LeftMenu />
      <div className="flex flex-col w-full min-h-screen bg-neutral-50 p-12">
        <Breadcrumb
          items={[
            {
              title: 'Campaigns',
            },
            {
              title: 'Campaign Name',
            }
          ]}
        />

        <div className="mt-4 flex flex-col w-[90%] px-8 py-8 bg-white rounded-lg shadow-sm">
          <img src="/images/campaign.png" alt="campaign" />
          <div className="flex items-center mt-4">
            <h1 className="text-2xl font-bold">
              Campaign Name
            </h1>
            <Button
              className="ml-auto max-w-[200px]"
              variant="primary"
              size="small"
            >
              Apply for Campaign
            </Button>
          </div>
          <p className="text-md mt-2">
            06th August 2024 - 18th August 2020
          </p>

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
          </div>
        </div>
      </div>
    </div>
  );
}
