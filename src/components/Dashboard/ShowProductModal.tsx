import { useState } from "react";
import { Modal, Input, Switch, Divider, Image } from "antd";
import CustomInput from "@/components/Input/Input";
const { TextArea } = Input;

interface ShowProductModalProps {
    modal: boolean;
    setModal: (value: boolean) => void;
    product: any;
}

export default function ShowProductModal({
    modal,
    setModal,
    product,
}: ShowProductModalProps) {
    if (!product) return null;
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
                <img loading="lazy"
                    src={
                        product?.productLogo?.includes("http")
                            ? product?.productLogo
                            : process.env.NEXT_PUBLIC_SERVER_URL + "/uploads/" + product?.productLogo
                    }
                    alt=""
                    className="w-48 h-48 object-cover rounded-md"
                />
                <p className="text-text-medium font-normal text-neutral-800 ml-4">
                    {product.productDescription}
                </p>
            </div>

            <Divider />
            <div className="flex items-center justify-between mb-4 space-x-4">
                {product.productImages.map((image: string, index: number) => (
                    <div key={index}
                        className="flex items-center justify-center w-1/4 h-1/4 bg-neutral-100 rounded-md"
                    >{renderFileType(image)}</div>
                ))}
            </div>

        </Modal>
    );
}


const renderFileType = (file: string) => {
    const fileUrl = file.includes("http")
        ? file
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${file}`;

    return <Image src={fileUrl} alt="Product Image" className="w-1/4" />;
};
