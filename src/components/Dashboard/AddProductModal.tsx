"use client";

import { useState } from "react";
import { Modal, Input, Switch, Divider, Button, message, Tooltip } from "antd";
import CustomInput from "@/components/Input/Input";
import api from "@/utils/axiosInstance";
import { FaVideo, FaStar, FaLink, FaGlobe, FaProductHunt } from "react-icons/fa";
import { MdLink, MdVisibility, MdDescription } from "react-icons/md";
import { BsImage } from "react-icons/bs";

const { TextArea } = Input;

interface AddProductModalProps {
  modal: boolean;
  setModal: (value: boolean) => void;
}

interface FormData {
  productName: string;
  productLogo: File | null;
  publicVisibility: boolean;
  productDescription: string;
  productImages: File[];
  productLink: string;
  loomVideoLink: string;
  g2Link: string;
  capterraLink: string;
  additionalDetails: string;
  productHunt: string;
  resources: File[];
}

export default function AddProduct({ modal, setModal }: AddProductModalProps) {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    productLogo: null,
    publicVisibility: false,
    productDescription: "",
    productImages: [],
    productLink: "",
    loomVideoLink: "",
    g2Link: "",
    capterraLink: "",
    additionalDetails: "",
    productHunt: "",
    resources: [],
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prevData) => ({ ...prevData, publicVisibility: checked }));
  };

  const handleFileChange = (name: keyof FormData, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (name === "productImages") {
      setFormData((prevData) => ({
        ...prevData,
        productImages: [...prevData.productImages, ...Array.from(files)],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "productImages") {
        (value as File[]).forEach((file) => formDataToSend.append("productImages", file));
      } else if (key === "productLogo" && value) {
        formDataToSend.append("productLogo", value);
      } else if (value !== null && value !== undefined) {
        formDataToSend.append(key, value.toString());
      }
    });

    try {
      await api.post("/products", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Product added successfully!");
      setModal(false);
      setFormData({
        productName: "",
        productLogo: null,
        publicVisibility: false,
        productDescription: "",
        productImages: [],
        productLink: "",
        loomVideoLink: "",
        g2Link: "",
        capterraLink: "",
        additionalDetails: "",
        productHunt: "",
        resources: [],
      });
    } catch (error: unknown) {
      console.error("Error adding product:", error);
      message.error("Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      width="60%"
      centered
      title={
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-neutral-800">Add a New Product</h2>
          <Tooltip title="Fill in all required information about your product">
            <span className="text-neutral-400">ℹ️</span>
          </Tooltip>
        </div>
      }
      open={modal}
      onCancel={() => setModal(false)}
      footer={[
        <Button key="cancel" onClick={() => setModal(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Divider />
      <div className="grid grid-cols-2 gap-8 overflow-y-auto max-h-[70vh] p-4">
        {/* Left Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-neutral-700 mb-4 flex items-center">
              <MdDescription className="mr-2" /> Basic Information
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="font-medium">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="p-2 border rounded-lg w-full"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">
                  Product Logo <span className="text-red-500">*</span>
                </label>
                <CustomInput type="file" onChange={(e) => handleFileChange("productLogo", e)} name="productLogo" />
                <p className="text-xs text-neutral-500">Recommended size: 200x200px</p>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">Public Visibility</label>
                <div className="flex items-center space-x-2">
                  <Switch checked={formData.publicVisibility} onChange={handleSwitchChange} />
                  <span className="text-neutral-600">Make product visible to public</span>
                  <Tooltip title="Toggle to make your product visible to all users">
                    <MdVisibility className="text-neutral-400" />
                  </Tooltip>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <TextArea
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  className="p-2 border rounded-lg w-full"
                  rows={4}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">
                  Product Link <span className="text-red-500">*</span>
                </label>
                <Input
                  name="productLink"
                  value={formData.productLink}
                  onChange={handleInputChange}
                  placeholder="Enter product URL"
                  prefix={<MdLink className="text-neutral-400" />}
                  className="p-2 border rounded-lg w-full"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">Product Images</label>
                <CustomInput type="file" multiple name="productImages" onChange={(e) => handleFileChange("productImages", e)} />
                <p className="text-xs text-neutral-500">Upload multiple images to showcase your product</p>
                {formData.productImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {formData.productImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          loading="lazy"
                          src={URL.createObjectURL(file)}
                          alt="Product Image"
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                          <Button
                            type="text"
                            danger
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                productImages: prev.productImages.filter((_, i) => i !== index),
                              }));
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-neutral-700 mb-4 flex items-center">
              <BsImage className="mr-2" /> Media & Additional Details
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Loom Video Link</label>
                <Input
                  name="loomVideoLink"
                  value={formData.loomVideoLink}
                  onChange={handleInputChange}
                  placeholder="Enter Loom video URL"
                  prefix={<FaVideo className="text-neutral-400" />}
                  className="p-2 border rounded-lg w-full"
                />
                <p className="text-xs text-neutral-500">Add a demo video to showcase your product</p>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">G2 Link</label>
                <Input
                  name="g2Link"
                  value={formData.g2Link}
                  onChange={handleInputChange}
                  placeholder="Enter G2 profile URL"
                  prefix={<FaStar className="text-neutral-400" />}
                  className="p-2 border rounded-lg w-full"
                />
                <p className="text-xs text-neutral-500">Link to your G2 profile for social proof</p>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">Capterra Link</label>
                <Input
                  name="capterraLink"
                  value={formData.capterraLink}
                  onChange={handleInputChange}
                  placeholder="Enter Capterra profile URL"
                  prefix={<FaGlobe className="text-neutral-400" />}
                  className="p-2 border rounded-lg w-full"
                />
                <p className="text-xs text-neutral-500">Link to your Capterra profile</p>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">Additional Details</label>
                <TextArea
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                  placeholder="Enter additional details"
                  className="p-2 border rounded-lg w-full"
                  rows={4}
                />
                <p className="text-xs text-neutral-500">Add any extra information about your product</p>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">Product Hunt</label>
                <Input
                  name="productHunt"
                  value={formData.productHunt}
                  onChange={handleInputChange}
                  placeholder="Enter Product Hunt URL"
                  prefix={<FaProductHunt className="text-neutral-400" />}
                  className="p-2 border rounded-lg w-full"
                />
                <p className="text-xs text-neutral-500">Link to your Product Hunt page</p>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">Resources</label>
                <CustomInput type="file" multiple name="resources" onChange={(e) => handleFileChange("resources", e)} />
                <p className="text-xs text-neutral-500">Upload additional resources like PDFs, docs, etc.</p>
                {formData.resources.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {formData.resources.map((file, index) => (
                      <div key={index} className="border rounded-md p-2 group relative">
                        <div className="flex items-center space-x-2">
                          <FaLink className="text-neutral-400" />
                          <p className="text-sm text-neutral-600 truncate">{file.name}</p>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                          <Button
                            type="text"
                            danger
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                resources: prev.resources.filter((_, i) => i !== index),
                              }));
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
