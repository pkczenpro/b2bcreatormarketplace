import { useState } from "react";
import { Modal, Input, Switch, Divider } from "antd";
import CustomInput from "@/components/Input/Input";
const { TextArea } = Input;

interface AddProductModalProps {
  modal: boolean;
  setModal: (value: boolean) => void;
}

export default function CreatorDashboard({
  modal,
  setModal,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    productName: "",
    productLogo: null,
    publicVisibility: false,
    productDescription: "",
    productImages: [] as File[],
  });

  console.log(formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prevData) => ({
      ...prevData,
      publicVisibility: checked,
    }));
  };

  const handleFileChange = (name: string, files: File[]) => {
    if (name === "productImages") {

      setFormData((prevData) => ({
        ...prevData,
        productImages: [...prevData.productImages, ...files.target.files],
      }));
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: files?.target?.files[0],
    }));
  };

  return (
    <Modal
      width="60%"
      centered
      title={
        <h2 className="text-text-large font-semibold text-neutral-800">
          Add a New Product
        </h2>
      }
      open={modal}
      onOk={() => setModal(false)}
      onCancel={() => setModal(false)}
    >
      <Divider />
      {/* overflow */}
      <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
        <h3 className="text-text-large font-medium mb-4 text-neutral-600">Basic Information</h3>
        <div className="flex space-x-6">
          <div className="w-1/2">
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="productName"
              >
                Product Name
              </label>
              <Input
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Enter Product Name"
                className="mt-1 p-2 border rounded-lg w-[80%]"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="productLogo"
              >
                Product Logo
              </label>
              <div className="w-[80%]">
                <CustomInput
                  type="file"
                  onChange={(files) => handleFileChange("productLogo", files)}
                  required
                  name="coverPicture"
                />
              </div>

              {formData.productLogo && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(formData.productLogo)}
                    alt="Product Logo"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Public Visibility
              </label>
              <Switch
                checked={formData.publicVisibility}
                onChange={handleSwitchChange}
                className="mt-1"
              />
            </div>
          </div>

          <div className="w-1/2">
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="productDescription"
              >
                Brief Description
              </label>
              <TextArea
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleInputChange}
                placeholder="Tell others about your product"
                className="mt-1 p-2 border rounded-lg w-full"
                style={{
                  height: "150px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        <h3 className="text-xl font-semibold mb-4">Additional Media</h3>
        <div className="flex space-x-6">
          <div className="w-1/2">
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="productImages"
              >
                Product Image
              </label>
              <div className="w-full">
                <CustomInput
                  type="file"
                  required
                  name="productImages"
                  multiple={true}
                  onChange={(files) => handleFileChange("productImages", files)}
                />
              </div>
            </div>

            {/* Display uploaded product images */}
            <div className="mt-4">
              {formData.productImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {formData.productImages.map((file, index) => (
                    <div key={index} className="w-full">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded Product Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
