/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Button/Button";
import Tabs from "@/components/Tabs/Tabs";
import { ArrowRight, Image, Mic, Plus, Text, Video } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Divider, Modal, Select, Switch } from "antd";
import Input from "../Input/Input";
import TextArea from "antd/es/input/TextArea";
import AddProductModal from "./AddProductModal";

type BrandDashboardProps = object;

export default function BrandDashboard({}: BrandDashboardProps) {
  const userType = "brand";

  const tabs = [
    {
      id: 1,
      label: "Campaigns",
      content: (
        <div className="border border-neutral-100 mt-6 rounded-md p-6">
          {/* Date or status if going on */}
          <span className="text-md font-bold text-success-500 rounded-sm">
            Ongoing
          </span>
          <h3 className="text-h5 font-bold text-left mb-1">Campaign Name</h3>
          <p className="text-neutral-600 text-left mb-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
            aspernatur voluptates ad, officiis commodi laborum!
          </p>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {["Tech", "Design", "Marketing"].map((tag, index) => (
                <span
                  key={index}
                  className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Image className="text-neutral-600" />
              <Video className="text-neutral-600" />
              <Mic className="text-neutral-600" />
              <Text className="text-neutral-600" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      label: "Partnerships",
      content: (
        <>
          <div className="border border-neutral-100 mt-6 rounded-md p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 mb-4">
                <img src="/images/profile.png" alt="" />
                <span className="text-xl font-bold">Andrew Bishop</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-700 font-medium">
                View Storefront
                <ArrowRight size={18} />
              </div>
            </div>

            <p className="text-neutral-600 text-left mb-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
              aspernatur voluptates ad, officiis commodi laborum!
            </p>

            <div className="flex space-x-2">
              {["Tech", "Design", "Marketing"].map((tag, index) => (
                <span
                  key={index}
                  className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            <div className="flex space-x-2">
              {["Campaign Name 1", "Campaign Name 2", "Campaign Name 3"].map(
                (tag, index) => (
                  <span
                    key={index}
                    className="font-bold inline-block border-[1px] border-primary-600 text-primary-600 px-2 py-1 rounded-sm text-sm"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </>
      ),
    },
    {
      id: 3,
      label: "Products",
      content: (
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-h5 font-bold text-left">
              Product Catalogue of Omega Web
            </h3>
            <Button
              onClick={() => setModal(true)}
              variant="outline"
              size="small"
              className="flex items-center space-x-2 max-w-[20%]"
            >
              <Plus />
              Add Product
            </Button>
          </div>
          <div className="border border-neutral-100 mt-6 p-6 rounded-md flex space-x-4 mb-4">
            <img src="/images/profile_2.png" alt="" />
            <div className="flex flex-col">
              <h2 className="text-h5 font-bold mb-2">Lorem, ipsum.</h2>
              <p className="text-neutral-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic
                quis reprehenderit pariatur non illum voluptatum reiciendis
                nostrum libero rem temporibus ad nisi odit earum praesentium
                amet aliquid fugiat quo ducimus quos, magnam officiis nobis
                tenetur aperiam atque. Quo cupiditate aspernatur accusamus
                similique, necessitatibus neque quam?
              </p>
            </div>
          </div>
          <div className="border border-neutral-100 mt-6 p-6 rounded-md flex space-x-4">
            <img src="/images/profile_2.png" alt="" />
            <div className="flex flex-col">
              <h2 className="text-h5 font-bold mb-2">Lorem, ipsum.</h2>
              <p className="text-neutral-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic
                quis reprehenderit pariatur non illum voluptatum reiciendis
                nostrum libero rem temporibus ad nisi odit earum praesentium
                amet aliquid fugiat quo ducimus quos, magnam officiis nobis
                tenetur aperiam atque. Quo cupiditate aspernatur accusamus
                similique, necessitatibus neque quam?
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const [visible, setVisible] = React.useState(false);
  const [formData, setFormData] = useState({
    targetAudience: "",
    contentType: "1",
    description: "",
    ongoingCampaign: false,
    startDate: "",
    budget: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      contentType: value,
    }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prevData) => ({
      ...prevData,
      ongoingCampaign: checked,
    }));
  };

  const createCampaign = () => {
    return (
      <Modal
        width={"60%"}
        centered
        title="Create Campaign"
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Divider />
        <div className="flex space-x-6">
          <div className="w-1/2 space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="targetAudience"
              >
                Target Audience
              </label>
              <Input
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="Enter keywords"
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content Type
              </label>
              <Select
                value={formData.contentType}
                onChange={handleSelectChange}
                style={{ width: "100%" }}
                className="mt-1"
                placeholder="Select Content Type"
              >
                <Select.Option value="1">Event Speaker</Select.Option>
                <Select.Option value="2">Social Media Posts</Select.Option>
                <Select.Option value="3">Video Content</Select.Option>
                <Select.Option value="4">Blog Writing</Select.Option>
                <Select.Option value="5">Podcasts</Select.Option>
              </Select>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="description"
              >
                Description
              </label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter Description"
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>
          </div>

          <div className="w-1/2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ongoing Campaign
              </label>
              <Switch
                checked={formData.ongoingCampaign}
                onChange={handleSwitchChange}
                className="mt-1"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="startDate"
              >
                Start Date
              </label>
              <Input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                placeholder="Enter Start Date"
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="budget"
              >
                Budget
              </label>
              <Input
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Enter Budget"
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const [modal, setModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-start h-full py-12">
      {createCampaign()}
      <AddProductModal modal={modal} setModal={setModal} />
      <div className="flex flex-col w-[90%] px-8 py-8 bg-white rounded-md shadow-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <div className="relative">
              {/* Cover Image */}
              <div className="relative w-full h-60">
                <img
                  src="/images/wallpaper.png"
                  alt="Cover"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Profile Section */}
              <div className="flex items-end justify-between w-[100%] mt-4 absolute bottom-[-70px] pl-12">
                {/* Profile Picture and Info */}
                <div className="flex items-end space-x-4">
                  <div className="rounded-sm overflow-hidden">
                    <img
                      src="/images/profile_2.png"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name and Socials */}
                  <div className="flex flex-col">
                    <div className="flex items-end space-x-2">
                      <h2 className="text-2xl font-semibold">Andrew Bishop</h2>
                      <h4>Mersin, Turkey</h4>
                    </div>
                    <div className="flex space-x-3 mt-1 text-gray-500">
                      <a href="#" className="hover:text-gray-700">
                        🔗
                      </a>
                      <a href="#" className="hover:text-gray-700">
                        🎙
                      </a>
                      <a href="#" className="hover:text-gray-700">
                        🌎
                      </a>
                    </div>
                  </div>
                </div>

                {/* Chat Button */}
                <Button
                  size="small"
                  variant="primary"
                  className="text-sm flex px-3 py-1 items-center max-w-[200px]"
                  onClick={() => setVisible(true)}
                >
                  {userType === "brand" ? "Create Campaign" : "Follow"}
                </Button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-24 text-gray-600 text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates
            veniam saepe officiis fugiat quidem maxime, laudantium eligendi
            pariatur ex soluta animi aut nihil commodi ipsum quisquam
            perferendis aperiam. Facilis eligendi nisi ullam voluptates
            blanditiis sed rerum consectetur maiores rem hic, soluta quisquam,
            facere numquam aliquam repellat doloremque delectus? Cum fugit
            voluptatibus quod, animi repellat amet obcaecati beatae excepturi
            corrupti esse vel neque quis, magni, odit distinctio? Ducimus
            perspiciatis molestias quam id rerum, placeat exercitationem
            assumenda, distinctio, hic illo laborum. Impedit totam odit rem at
            esse magnam saepe velit, aperiam molestias quas natus delectus et
            itaque, labore ipsum ad aspernatur. Facere!{" "}
          </p>

          {/* Tags */}
          <div className="mt-4 flex space-x-2">
            <span className="font-bold inline-block border-[1px] border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm">
              #Marketing
            </span>
            <span className="font-bold inline-block border-[1px] border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm">
              #Design
            </span>
            <span className="font-bold inline-block border-[1px] border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm">
              #Tech
            </span>
          </div>

          {/* STATS */}
          <div className="flex gap-4 mt-4">
            <div className="flex flex-col w-full bg-white p-4 rounded-md border border-gray-200">
              <h1 className="text-lg font-semibold">1,200</h1>
              <p className="text-gray-600">#Jobs Completed</p>
            </div>
            <div className="flex flex-col w-full bg-white p-4 rounded-md border border-gray-200">
              <h1 className="text-lg font-semibold">1,200</h1>
              <p className="text-gray-600">#Jobs Completed</p>
            </div>

            <div className="w-full sm:w-0 border-l-2 border-gray-200 mx-2"></div>

            <div className="flex flex-col w-full bg-white p-4 rounded-md border border-gray-200">
              <h1 className="text-lg font-semibold">1,200</h1>
              <p className="text-gray-600">#Jobs Completed</p>
            </div>
            <div className="flex flex-col w-full bg-white p-4 rounded-md border border-gray-200">
              <h1 className="text-lg font-semibold">1,200</h1>
              <p className="text-gray-600">#Jobs Completed</p>
            </div>
            <div className="flex flex-col w-full bg-white p-4 rounded-md border border-gray-200">
              <h1 className="text-lg font-semibold">1,200</h1>
              <p className="text-gray-600">#Jobs Completed</p>
            </div>
          </div>

          {/* divider */}
          <div className="border-t border-gray-200 my-6"></div>

          <Tabs tabs={tabs} />
        </motion.div>
      </div>
    </div>
  );
}
