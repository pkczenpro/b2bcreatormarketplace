"use client";

import { useState } from "react";
import { Modal, Input, Switch, Divider, Button, message } from "antd";
import CustomInput from "@/components/Input/Input";
import axios from "axios";
import api from "@/utils/axiosInstance";

const { TextArea } = Input;

interface AddProductModalProps {
  modal: boolean;
  setModal: (value: boolean) => void;
}

export default function AddProduct({ modal, setModal }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    productName: "",
    productLogo: null,
    publicVisibility: false,
    productDescription: "",
    productImages: [] as File[],
    productLink: "",
    loomVideoLink: "",
    g2Link: "",
    capterraLink: "",
    additionalDetails: "",
    productHunt: "",
    resources: [] as File[],
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prevData) => ({ ...prevData, publicVisibility: checked }));
  };

  const handleFileChange = (name: string, e: any) => {
    const files = e.target.files;
    if (name === "productImages") {
      setFormData((prevData) => ({
        ...prevData,
        productImages: [...prevData.productImages, ...files],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        productLogo: files[0],
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
      } else {
        formDataToSend.append(key, value as string);
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
    } catch (error) {
      message.error("Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      width="50%"
      centered
      title={<h2 className="text-lg font-semibold text-neutral-800">Add a New Product</h2>}
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
      <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
        {/* Left Section */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-neutral-600">Basic Information</h3>
          <Input name="productName" value={formData.productName} onChange={handleInputChange} placeholder="Product Name" className="p-2 border rounded-lg w-full" />
          <CustomInput type="file" onChange={(e) => handleFileChange("productLogo", e)} name="productLogo" />
          <div className="flex">
            <span className="text-neutral-600 mr-2">Public Visibility: </span>
            <Switch checked={formData.publicVisibility} onChange={handleSwitchChange} />
          </div>
          <TextArea name="productDescription" value={formData.productDescription} onChange={handleInputChange} placeholder="Brief Description" className="p-2 border rounded-lg w-full" />
          <Input name="productLink" value={formData.productLink} onChange={handleInputChange} placeholder="Product Link" className="p-2 border rounded-lg w-full" />
          <CustomInput type="file" multiple name="productImages" onChange={(e) => handleFileChange("productImages", e)} />
          {formData.productImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.productImages.map((file, index) => (
                <img loading="lazy" key={index} src={URL.createObjectURL(file)} alt="Product Image" className="w-full h-20 object-cover rounded-md" />
              ))}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-neutral-600">Media & Additional Details</h3>
          <Input name="loomVideoLink" value={formData.loomVideoLink} onChange={handleInputChange} placeholder="Loom Video Link" className="p-2 border rounded-lg w-full" />
          <Input name="g2Link" value={formData.g2Link} onChange={handleInputChange} placeholder="G2 Link (Optional)" className="p-2 border rounded-lg w-full" />
          <Input name="capterraLink" value={formData.capterraLink} onChange={handleInputChange} placeholder="Capterra Link" className="p-2 border rounded-lg w-full" />
          <TextArea name="additionalDetails" value={formData.additionalDetails} onChange={handleInputChange} placeholder="Additional Details" className="p-2 border rounded-lg w-full" />
          <TextArea name="productHunt" value={formData.productHunt} onChange={handleInputChange} placeholder="Product Hunt" className="p-2 border rounded-lg w-full" />
          <CustomInput type="file" multiple name="resources" onChange={(e) => handleFileChange("resources", e)} />
          {formData.resources.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.resources.map((file, index) => (
                <div key={index}>
                  <img loading="lazy" src={URL.createObjectURL(file)} alt="Product Image" className="w-full h-20 object-cover rounded-md" />
                  <p>{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
