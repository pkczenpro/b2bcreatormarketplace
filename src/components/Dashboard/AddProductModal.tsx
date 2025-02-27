import { useState } from "react";
import { Modal, Input, Switch } from "antd";

const { TextArea } = Input;

interface AddProductModalProps {
    modal: boolean;
    setModal: (value: boolean) => void;
}

export default function CreatorDashboard({ modal, setModal }: AddProductModalProps) {
    const [formData, setFormData] = useState({
        productName: "",
        productLogo: null,
        publicVisibility: false,
        productDescription: "",
        productImage: "",
    });

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

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files[0],
        }));
    };

    return (
        <Modal
            width="60%"
            centered
            title="Add Product"
            visible={modal}
            onOk={() => setModal(false)}
            onCancel={() => setModal(false)}
        >
            <div>
                <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                <div className="flex space-x-6">
                    <div className="w-1/2">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="productName">
                                Product Name
                            </label>
                            <Input
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                placeholder="Product Name"
                                className="mt-1 p-2 border rounded-lg w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="productLogo">
                                Product Logo
                            </label>
                            <input
                                type="file"
                                id="productLogo"
                                name="productLogo"
                                onChange={handleFileChange}
                                className="mt-1 p-2 w-full border rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Public Visibility</label>
                            <Switch
                                checked={formData.publicVisibility}
                                onChange={handleSwitchChange}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div className="w-1/2">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="productDescription">
                                Product Description
                            </label>
                            <TextArea
                                id="productDescription"
                                name="productDescription"
                                value={formData.productDescription}
                                onChange={handleInputChange}
                                placeholder="Product Description"
                                className="mt-1 p-2 border rounded-lg w-full"
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
                            <label className="block text-sm font-medium text-gray-700" htmlFor="productImage">
                                Product Image
                            </label>
                            <Input
                                id="productImage"
                                name="productImage"
                                value={formData.productImage}
                                onChange={handleInputChange}
                                placeholder="Product Image URL"
                                className="mt-1 p-2 border rounded-lg w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
