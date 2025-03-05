"use client";

import { useState } from "react";
import { Modal, Input, Switch, Divider } from "antd";
import CustomInput from "@/components/Input/Input";
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prevData) => ({ ...prevData, publicVisibility: checked }));
  };

  const handleFileChange = (name: string, files: File[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "productImages" ? [...prevData.productImages, ...files.target.files] : files?.target?.files[0],
    }));
  };

  return (
    <Modal
      width="50%"
      centered
      title={<h2 className="text-lg font-semibold text-neutral-800">Add a New Product</h2>}
      open={modal}
      onOk={() => setModal(false)}
      onCancel={() => setModal(false)}
    >
      <Divider />
      <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
        {/* Left Section: Basic Info */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-neutral-600">Basic Information</h3>
          <Input name="productName" value={formData.productName} onChange={handleInputChange} placeholder="Product Name" className="p-2 border rounded-lg w-full" />
          <CustomInput type="file" onChange={(files) => handleFileChange("productLogo", files)} name="productLogo" />
          <div className="flex">
            <span className="text-neutral-600 mr-2">Public Visibility: </span>
            <Switch checked={formData.publicVisibility} onChange={handleSwitchChange} />
          </div>
          <TextArea name="productDescription" value={formData.productDescription} onChange={handleInputChange} placeholder="Brief Description" className="p-2 border rounded-lg w-full" />
          <Input name="productLink" value={formData.productLink} onChange={handleInputChange} placeholder="Product Link" className="p-2 border rounded-lg w-full" />
          <CustomInput type="file" multiple name="productImages" onChange={(files) => handleFileChange("productImages", files)} />
          {formData.productImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.productImages.map((file, index) => (
                <img key={index} src={URL.createObjectURL(file)} alt="Product Image" className="w-full h-20 object-cover rounded-md" />
              ))}
            </div>
          )}
        </div>

        {/* Right Section: Media & Additional Details */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-neutral-600">Media & Additional Details</h3>
          <Input name="loomVideoLink" value={formData.loomVideoLink} onChange={handleInputChange} placeholder="Loom Video Link" className="p-2 border rounded-lg w-full" />
          <Input name="g2Link" value={formData.g2Link} onChange={handleInputChange} placeholder="G2 Link (Optional)" className="p-2 border rounded-lg w-full" />
          <Input name="capterraLink" value={formData.capterraLink} onChange={handleInputChange} placeholder="Capterra Link" className="p-2 border rounded-lg w-full" />
          <Input.TextArea name="additionalDetails" value={formData.additionalDetails} onChange={handleInputChange} placeholder="Additional Details" className="p-2 border rounded-lg w-full" />
          <Input.TextArea name="productHunt" value={formData.productHunt} onChange={handleInputChange} placeholder="Product Hunt" className="p-2 border rounded-lg w-full" />
        </div>
      </div>
    </Modal>
  );
}
