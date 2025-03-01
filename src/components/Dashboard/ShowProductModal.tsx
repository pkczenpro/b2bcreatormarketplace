import { useState } from "react";
import { Modal, Input, Switch, Divider, Image } from "antd";
import CustomInput from "@/components/Input/Input";
const { TextArea } = Input;

interface ShowProductModalProps {
    modal: boolean;
    setModal: (value: boolean) => void;
    // product: any;
}

export default function ShowProductModal({
    modal,
    setModal,
    // product,
}: ShowProductModalProps) {
    const product = {
        productName: "Product Name",
        productDescription: "Product DescriptionProduct DeProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionscriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct DescriptionProduct Description",
        productLogo: null,
        productImages: [] as File[],
        publicVisibility: false,
    }
    return (
        <Modal
            width="60%"
            centered
            title={
                <h2 className="text-text-large font-semibold text-neutral-800">
                    {product.productName}
                </h2>
            }
            open={modal}
            onOk={() => setModal(false)}
            onCancel={() => setModal(false)}
            footer={null}
        >
            <div className="flex flex-row items-start">
                <img src="/images/product.png" alt="" />
                <p className="text-text-medium font-normal text-neutral-800 ml-4">
                    {product.productDescription}
                </p>
            </div>

            <Divider />

            <div className="flex items-center justify-between">
                <Image
                    src="/images/prod1.png"
                    alt="Product Logo"
                    className="w-1/4"
                />
                <Image
                    src="/images/prod2.png"
                    alt="Product Logo"
                    className="w-1/4"
                />
                <Image
                    src="/images/prod3.png"
                    alt="Product Logo"
                    className="w-1/4"
                />
                <Image
                    src="/images/prod4.png"
                    alt="Product Logo"
                    className="w-1/4"
                />
            </div>
        </Modal>
    );
}
