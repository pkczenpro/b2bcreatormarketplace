/* eslint-disable jsx-a11y/alt-text */
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
import ShowProductModal from "./ShowProductModal";
import Link from "next/link";

type BrandDashboardProps = {
  isPreview: boolean;
};

export default function BrandDashboard({
  isPreview
}: BrandDashboardProps) {

  const userType = localStorage.getItem("userType") || "brand";

  const tabs = [
    {
      id: 1,
      label: "Campaigns",
      content: (
        <Link href="/dashboard/campaigns-details/1">
          <div className="border border-neutral-100 mt-6 rounded-md p-6 cursor-pointer transition-all hover:shadow-md hover:transition-all">
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
        </Link>
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
              <Link href="/dashboard/user-front" target="_blank">
                <div className="flex items-center space-x-2 text-primary-700 font-medium">
                  View Storefront
                  <ArrowRight size={18} />
                </div>
              </Link>
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
            {!isPreview && <Button
              onClick={() => setModal(true)}
              variant="outline"
              size="small"
              className="flex items-center space-x-2 max-w-[20%]"
            >
              <Plus />
              Add Product
            </Button>}
          </div>
          <div className="border border-neutral-100 mt-6 p-6 rounded-md flex items-center space-x-4 mb-4 cursor-pointer" onClick={() => {
            setShowProductModal(true);
            setSelectedProduct({
              productName: "Product Name",
              productDescription: "Product Description",
              productLogo: null,
              productImages: [] as File[],
              publicVisibility: false,
            });
          }}>
            <img src="/images/product.png" alt="" />
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
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="flex flex-col items-center justify-start h-full py-12 px-4 sm:px-6 lg:px-8">
      {createCampaign()}
      <AddProductModal modal={modal} setModal={setModal} />
      <ShowProductModal modal={showProductModal} setModal={setShowProductModal} product={selectedProduct} />

      <div className="flex flex-col w-full max-w-6xl px-6 py-8 bg-white rounded-md shadow-sm">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="relative">
            {/* Cover Image */}
            <div className="relative w-full h-48 sm:h-72">
              <img src="/images/wallpaper.png" alt="Cover" className="w-full h-full object-cover rounded-md" />
            </div>

            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between w-full mt-4 absolute bottom-[-50px] sm:bottom-[-80px] px-4 sm:px-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-end space-x-0 sm:space-x-4 text-center sm:text-left">
                <div className="w-24 sm:w-40 rounded-sm overflow-hidden">
                  <img src="/images/linkedin.png" alt="Profile" className="w-full h-full object-cover" />
                </div>

                {/* Name and Socials */}
                <div className="mt-3 sm:mt-0">
                  <h2 className="text-xl sm:text-2xl font-semibold">LinkedIn</h2>
                  <h4 className="text-gray-500 text-sm">CA, USA</h4>
                  <div className="flex justify-center sm:justify-start space-x-3 mt-1 text-gray-500">
                    <a target="_blank" rel="noreferrer" href="https://linkedin.com" className="hover:text-gray-700">🔗</a>
                    <a href="#" className="hover:text-gray-700">🎙</a>
                    <a href="#" className="hover:text-gray-700">🌎</a>
                  </div>
                </div>
              </div>

              {/* Chat Button */}
              <Button size="small" variant="primary" className="mt-4 sm:mt-0 text-sm flex px-3 py-1 items-center max-w-[200px]" onClick={() => setVisible(true)}>
                {userType === "brand" ? "Create Campaign" : "Follow"}
              </Button>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-20 sm:mt-24 text-gray-600 text-sm px-2 sm:px-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates veniam saepe officiis fugiat quidem...
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="font-bold border border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm">#Marketing</span>
            <span className="font-bold border border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm">#Design</span>
            <span className="font-bold border border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm">#Tech</span>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
                <h1 className="text-lg font-semibold">1,200</h1>
                <p className="text-gray-600">#Jobs Completed</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          <Tabs tabs={tabs} />
        </motion.div>
      </div>
    </div>

  );
}
