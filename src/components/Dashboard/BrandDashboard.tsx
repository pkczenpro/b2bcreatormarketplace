/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Button/Button";
import Tabs from "@/components/Tabs/Tabs";
import { ArrowRight, Check, Image, Mic, Pencil, Plus, Text, Upload, Video } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Divider, Modal, Select, Switch, Button as AntdButton } from "antd";
import Input from "../Input/Input";
import TextArea from "antd/es/input/TextArea";
import AddProductModal from "./AddProductModal";
import ShowProductModal from "./ShowProductModal";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import CustomImage from "../CustomImage";
import { get } from "http";

type BrandDashboardProps = {
  isPreview: boolean;
};

// userData;
// {"_id":"67cec00dad8af47ea2b85247","name":"Omar Dakelbab","email":"omar.frontend@gmail.com","password":"$2b$10$6AJmPYVJvwXZd0Q4qxooUe6ZszC0w8s2FaSejzjpPZCx4n.Awa70K","userType":"creator","tags":["tech","instagram"],"socialMediaLinks":[{"platform":"linkedin","link":"linkedin.com/in/johndoe","_id":"67cecd317ef28615840899e7"},{"platform":"medium","link":"medium.com/@johndoe","_id":"67cecd317ef28615840899e8"},{"platform":"spotify","link":"open.spotify.com/user/johndoe","_id":"67cecd317ef28615840899e9"},{"platform":"website","link":"johndoe.com","_id":"67cecd317ef28615840899ea"},{"platform":"otherLinks","link":"","_id":"67cecd317ef28615840899eb"}],"reviews":[],"services":[],"previousWork":[],"featuredWork":[],"testimonials":[],"textBlock":[],"stats":[],"calendar":[],"createdAt":"2025-03-10T10:33:49.104Z","updatedAt":"2025-03-10T11:29:53.545Z","__v":0,"isCompletedOnboarding":true,"bio":"oosmadomsodmasofmngndgflndslgds","coverImage":null,"location":"Turkey","profileImage":null,"profileName":"Omar Dakelbab"}


export default function BrandDashboard({
  isPreview
}: BrandDashboardProps) {

  const [userType, setUserType] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any>(null);
  const [products, setProducts] = useState<any>(null);
  const [partnerships, setPartnerships] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBrand = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "")._id : null;
      if (!userId) return;
      const res = await api.get("/users/brand/" + userId);
      setUserData(res.data);
      setUserType(res.data.userType);
      setCampaigns(res.data.campaigns);
      setProducts(res.data.products);
      setPartnerships(res.data.partnerships);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    getBrand();
  }, []);


  const tabs = [
    {
      id: 1,
      label: "Campaigns",
      content: (
        <>
          {campaigns?.map((campaign: any, index: number) => (
            <Link href={`/dashboard/campaigns-details/${campaign._id}`} key={index}>
              <div className="border border-neutral-100 mt-6 rounded-md p-6 cursor-pointer transition-all hover:shadow-md hover:transition-all">
                {/* Date or status if going on */}
                <span className="text-md font-bold text-success-500 rounded-sm">
                  {campaign.status}
                </span>
                <h3 className="text-h5 font-bold text-left mb-1">
                  {campaign.title}
                </h3>
                <p className="text-neutral-600 text-left mb-6">
                  {campaign.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {campaign?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    {campaign.contentType.map((tag, index) => (
                      <span
                        key={index}
                        className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </>
      ),
    },
    {
      id: 2,
      label: "Partnerships",
      content: (
        <>
          {partnerships?.length > 0 && partnerships?.map((partnership: any, index: number) => (
            <div key={index} className="border border-neutral-100 mt-6 rounded-md p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 mb-4">
                  <img loading="lazy"
                    className="w-16 h-16 object-cover rounded-full"
                    src={
                      partnership?.profileImage?.includes("http")
                        ? partnership?.profileImage
                        : process.env.NEXT_PUBLIC_SERVER_URL + partnership?.profileImage
                    } alt="" />
                  <span className="text-xl font-bold">
                    {partnership?.name}
                  </span>
                </div>
                <Link href={`/dashboard/user-preview/${partnership?.user_id}`} target="_blank">
                  <div className="flex items-center space-x-2 text-primary-700 font-medium">
                    View Storefront
                    <ArrowRight size={18} />
                  </div>
                </Link>
              </div>

              {partnership.bio && <p className="text-neutral-600 text-left mb-6">
                {partnership?.bio}
              </p>}

              {partnership.tags.length > 0 && <div className="flex space-x-2">
                {
                  partnership?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                    >
                      {tag}
                    </span>
                  ))}
              </div>}

              <div className="border-t border-gray-200 my-6"></div>

              <div className="flex space-x-2">
                {partnership?.campaigns?.map(
                  (tag, index) => (
                    <Link
                      key={index}
                      href={`/dashboard/campaigns-details/${tag._id}`}
                      target="_blank"
                    >
                      <span
                        className="font-bold inline-block border-[1px] border-primary-600 text-primary-600 px-2 py-1 rounded-sm text-sm"
                      >
                        {tag.title}
                      </span>
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
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
              Product Catalogue of {userData?.profileName}
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

          {products?.filter((item) => item.publicVisibility).map((product: any, index: number) => (
            <div
              key={index}
              className="border border-neutral-100 mt-6 p-6 rounded-md flex items-center space-x-4 mb-4 cursor-pointer"
              onClick={() => {
                setShowProductModal(true);
                setSelectedProduct(product);
              }}
            >
              <img
                loading="lazy"
                src={product?.productLogo}
                alt=""
                className="w-48 h-48 object-cover rounded-md"
              />
              <div className="flex flex-col">
                <h2 className="text-h5 font-bold mb-2">
                  {product.productName}
                </h2>
                <p className="text-neutral-600">
                  {product.productDescription}
                </p>
              </div>
            </div>
          ))}

        </div>
      ),
    },
  ].filter(Boolean);

  const [visible, setVisible] = React.useState(false);
  const [formData, setFormData] = useState({
    tags: [],
    contentType: "",
    description: "",
    status: false,
    startDate: "",
    endDate: "",
    budget: "",
    goalsAndDeliverables: "",
    title: "",
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
      status: checked,
    }));
  };
  const handleAddCampaign = async () => {
    try {
      const res = await api.post("/campaigns", formData);
      console.log(res.data);
      setVisible(false);
      getCampaigns();
    }
    catch (error) {
      console.log(error);
    }
  }

  const [tempTags, setTempTags] = useState("");
  const handleAddTags = () => {
    setFormData((prevData) => ({
      ...prevData,
      tags: [...prevData.tags, tempTags],
    }));
    setTempTags("");
  }

  const createCampaign = () => {
    return (
      <Modal
        width={"60%"}
        centered
        title="Create Campaign"
        open={visible}
        okText="Create Campaign"
        onOk={() => {
          handleAddCampaign();
          getBrand();
        }}
        onCancel={() => setVisible(false)}
      >
        <Divider />
        <div className="flex space-x-6">
          <div className="w-1/2 space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="description"
              >
                Title
              </label>
              <TextArea
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter Title"
                className="mt-1 p-2 border rounded-lg w-full"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="tags">
                  Target Audience
                </label>
                <Input
                  name="tempTags"
                  value={tempTags}
                  onChange={(e) => {
                    setTempTags(e.target.value);
                  }}
                  placeholder="Enter keywords"
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <AntdButton
                onClick={handleAddTags}
                className="h-10 px-3 rounded-lg bg-primary-700 text-white">
                +
              </AntdButton>
            </div>

            <div>
              <div className="flex space-x-2">
                {formData?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
                mode="multiple"
              >
                <Select.Option value="Event Speaker">Event Speaker</Select.Option>
                <Select.Option value="Social Media Posts">Social Media Posts</Select.Option>
                <Select.Option value="Video Content">Video Content</Select.Option>
                <Select.Option value="Blog Writing">Blog Writing</Select.Option>
                <Select.Option value="Podcasts">Podcasts</Select.Option>
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

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="description"
              >
                Goals & Deliverables
              </label>
              <TextArea
                name="goalsAndDeliverables"
                value={formData.goalsAndDeliverables}
                onChange={handleInputChange}
                placeholder="Enter Goals & Deliverables"
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
                checked={formData.status}
                onChange={handleSwitchChange}
                className="mt-1"
              />
            </div>

            <div className="flex justify-between w-full">
              <div className="w-full">
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
              <div className="w-full ml-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <Input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  placeholder="Enter End Date"
                  className="mt-1 p-2 border rounded-lg w-full"
                />
              </div>
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


  const userFileInputRef = useRef(null);
  const userFileInputRef2 = useRef(null);

  const handleUserFilesChange = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      updateUserImages(field, file);
    }
    event.target.value = null;
  };

  const updateUserImages = async (field: string, image: File) => {
    const formData = new FormData();
    formData.append(field, image);

    try {
      const res = await api.put(`/users/user-update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      if (res.data.success) {
        // toast.success(res.data.message, { position: "top-center" });
        getBrand();
      }
    } catch (err) {
      console.error("Error in updateUserImages:", err.response?.data || err.message);
    }
  }


  return (
    <div className="flex flex-col items-center justify-start h-full py-12 px-4 sm:px-6 lg:px-8">
      {createCampaign()}
      <AddProductModal modal={modal} setModal={setModal} />
      <ShowProductModal modal={showProductModal} setModal={setShowProductModal} product={selectedProduct} />
      <LoadingOverlay loading={loading} />
      <div
        style={{
          display: loading ? "none" : "block",
        }}
        className="flex flex-col w-full max-w-6xl px-6 py-8 bg-white rounded-md shadow-sm">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="relative">
            {/* Cover Image */}
            <div className="relative w-full h-48 sm:h-72 group">
              {/* Cover Image */}
              <CustomImage
                loading="lazy"
                src={
                  userData?.coverImage?.includes("http")
                    ? userData?.coverImage
                    : process.env.NEXT_PUBLIC_SERVER_URL + userData?.coverImage
                }
                alt="Cover"
                className="w-full h-full object-cover rounded-md"
              />

              {/* Hover Overlay */}
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-md"
                onClick={() => userFileInputRef2.current.click()}
              >
                <Upload size={32} className="text-white" />
              </div>

              <input
                type="file"
                className="hidden"
                ref={userFileInputRef2}
                onChange={(event) => handleUserFilesChange(event, "coverImage")}
              />

            </div>

            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between w-full absolute bottom-[-50px] sm:bottom-[-90px] px-4 sm:px-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-end space-x-0 sm:space-x-4 text-center sm:text-left">
                <div className="relative group w-24 sm:w-40 rounded-sm overflow-hidden">
                  {/* Profile Image */}
                  <CustomImage
                    loading="lazy"
                    src={
                      userData?.profileImage?.includes("http")
                        ? userData?.profileImage
                        : process.env.NEXT_PUBLIC_SERVER_URL + userData?.profileImage
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => userFileInputRef.current.click()}
                  >
                    <Upload size={32} className="text-white" />
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    className="hidden"
                    ref={userFileInputRef}
                    onChange={(event) => handleUserFilesChange(event, "profileImage")}
                  />
                </div>

                {/* Name and Socials */}
                <div className="flex flex-col">
                  <EditableHeading
                    className={"text-2xl font-semibold"}
                    initialName={userData?.profileName} onChange={(e) => {
                      updateUserImages("profileName", e);
                    }}
                  />
                  <h4 className="text-gray-500 text-sm">
                    {userData?.location}
                  </h4>
                  <div className="flex space-x-3 mt-1 text-gray-500">
                    <EditableSocialMediaLinks
                      links={userData?.socialMediaLinks || []}
                      setLinks={(links) => {
                        updateUserImages("socialMediaLinks", JSON.stringify(links));
                      }}
                    />
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
          <p className="mt-20 sm:mt-28 text-gray-600 text-sm px-2 sm:px-0">
            <EditableHeading
              initialName={userData?.bio || "Add a bio here"}
              onChange={(e) => {
                updateUserImages("bio", e);
              }}
            />
          </p>

          {/* Tags */}
          <div className="mt-4 flex space-x-2">
            <EditableTagsAdder
              tags={
                userData?.tags || []
              }
              setTags={(tags) => {
                updateUserImages("tags", tags);
              }}
            />
          </div>


          {/* STATS TODO */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            <div key={1} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
              <h1 className="text-lg font-semibold">
                {campaigns?.length}
              </h1>
              <p className="text-gray-600">
                Campaigns
              </p>
            </div>
            <div key={2} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
              <h1 className="text-lg font-semibold">
                {products?.length || 0}
              </h1>
              <p className="text-gray-600">
                Products
              </p>
            </div>
            <div key={3} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
              <h1 className="text-lg font-semibold">
                {partnerships?.length || 0}
              </h1>
              <p className="text-gray-600">Campaigns Completed</p>
            </div>
            <div key={4} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
              <h1 className="text-lg font-semibold">
                {/* COMPANY SIZE */} 0
              </h1>
              <p className="text-gray-600">
                Company Size
              </p>
            </div>
            <div key={5} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
              <h1 className="text-lg font-semibold">
                {userData?.followers?.length || 0}
              </h1>
              <p className="text-gray-600">
                Followers
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          <Tabs tabs={tabs} />
        </motion.div>
      </div>
    </div>

  );
}


// types 

type EditableHeadingProps = {
  initialName: string;
  onChange: (name: string) => void;
  className: string;
};

const EditableHeading = ({ initialName, onChange, className }: EditableHeadingProps) => {
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleBlur = (e) => {
    setName(e.target.innerText);
  };

  const handleChange = () => {
    if (name === initialName) return;
    onChange(name);
  }

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <h2
          className={`${className} border-b border-gray-400 focus:outline-none`}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
        >
          {name}
        </h2>
      ) : (
        <h2 className={className}>{name}</h2>
      )}

      <button
        onClick={() => {
          if (isEditing) handleChange();
          setIsEditing(!isEditing);
        }}
        className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 transition"
      >
        {isEditing ? <Check size={10} /> : <Pencil size={10} />}
      </button>
    </div>
  );
};

const EditableTagsAdder = ({ tags, setTags }: { tags: string[]; setTags: (tags: string[]) => void }) => {
  const [tagText, setTagText] = useState("");

  console.log(tags);
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagText) {
      setTags([...tags, tagText]);
      setTagText("");
    }
  }

  return (
    <div className="w-full sm:w-1/3 mt-3">
      <h1 className="text-sm font-bold text-left mb-1">Audience Interests:</h1>
      <Input
        value={tagText}
        onChange={(e) => setTagText(e.target.value)}
        onKeyPress={handleAddTag}
        placeholder="Press Enter to add tags"
        className="w-full"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {tags?.filter((item) => item).map((tag, index) => (
          <div
            key={index}
            className="font-bold border border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm flex items-center"
          >
            {tag}
            <span
              className="ml-2 text-red-500 cursor-pointer"
              onClick={() => setTags(tags?.filter((item) => item !== tag))}
            >
              ✕
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const EditableSocialMediaLinks = ({ links, setLinks }: { links: any[]; setLinks: (links: any[]) => void }) => {
  const [platform, setPlatform] = useState("");
  const [link, setLink] = useState("");
  const [isAdd, setIsAdd] = useState(false);

  const handleAddLink = () => {
    if (platform && link) {
      setLinks([...links, { platform, link }]);
      setPlatform("");
      setLink("");
      setModal(false);
    }
  }

  const [modal, setModal] = useState(false);

  const platforms = [
    { value: "medium", label: "Medium" },
    { value: "spotify", label: "Spotify" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "website", label: "Website" }
  ];


  return (
    <div className="w-full">
      {/* <h1 className="text-sm font-bold text-left mb-1">Social Media Links:</h1> */}
      <Modal
        title={
          !isAdd ? "Edit Link" : "Add Link"
        }
        visible={modal}
        onCancel={() => {
          setPlatform("");
          setIsAdd(false);
          setLink("");
          setModal(false);
        }}
        footer={null}
        centered
        className="rounded-lg"
      >
        <div className="space-y-4">
          {isAdd && <div>
            <label htmlFor="platform" className="text-gray-700 font-medium">Platform</label>
            <Select
              placeholder="Select Platform"
              className="w-full rounded-md border-gray-300"
              value={platform}
              onChange={(value) => setPlatform(value)}
              disabled={!isAdd}
            >
              {platforms.map((platform) => (
                <Select.Option key={platform.value} value={platform.value}>
                  {platform.label}
                </Select.Option>
              ))}
            </Select>

          </div>}

          <div>
            <label htmlFor="link" className="text-gray-700 font-medium">Link</label>
            <Input
              id="link"
              placeholder="Enter Link"
              className="w-full rounded-md border-gray-300"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div className="flex">

            {!isAdd && <AntdButton
              onClick={() => {
                setLinks(links.filter((item) => item.platform !== platform && item.link !== link));
                setModal(false);
              }}
              className="w-full bg-red-500 text-white hover:bg-red-600 rounded-md py-2 mt-4"
            >
              Delete Link
            </AntdButton>}

            <AntdButton
              onClick={() => {
                if (isAdd) handleAddLink();
                else {
                  setLinks(links.map((item) => {
                    if (item.platform === platform) {
                      item.link = link;
                    }
                    return item;
                  }));
                  setModal(false);
                }
              }}
              className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-md py-2 mt-4"
            >
              {isAdd ? "Add Link" : "Save Changes"}
            </AntdButton>
          </div>
        </div>
      </Modal>



      <div className="flex space-x-4 mt-2 text-gray-600">
        {links.filter((item) => item.link).map((link, index) => (
          <div
            key={index}
            onClick={() => {
              setPlatform(link.platform);
              setLink(link.link);
              setIsAdd(false);
              setModal(true);
            }}
            className="cursor-pointer transition duration-200 ease-in-out transform hover:bg-gray-100 rounded-full hover:scale-105"
          >
            <img
              loading="lazy"
              src={`/icons/${link.platform}.svg`}
              alt={link.platform}
              className="w-6 h-6"
            />
          </div>
        ))}
        {/* // dashed border cirlce for account adding  */}
        <div
          onClick={() => {
            setModal(true)
            setIsAdd(true);
          }}
          className="flex items-center justify-center w-6 h-6 border-dashed border-2 rounded-full cursor-pointer hover:border-gray-400 bg-[#F6F6F8]"
        >
          <Plus size={16} />
        </div>
      </div>




    </div>
  );
}