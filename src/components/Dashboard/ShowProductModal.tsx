import { Modal, Input, Switch, Divider, Image, Tooltip } from "antd";
import { Rate } from "antd";
import { ExternalLink } from "lucide-react"; // optional icon
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

    const formatDate = (date: string) =>
        new Date(date).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        });

    const renderFileType = (file: string) => {
        const fileUrl = file.includes("http")
            ? file
            : `${process.env.NEXT_PUBLIC_SERVER_URL}${file}`;
        return (
            <Image
                src={fileUrl}
                alt="Product Image"
                className="rounded-md object-cover max-h-48"
                preview={true}
            />
        );
    };

    return (
        <Modal
            width="70%"
            centered
            title={
                <h2 className="text-2xl font-semibold text-neutral-800">
                    {product.productName}
                </h2>
            }
            open={modal}
            onOk={() => setModal(false)}
            onCancel={() => setModal(false)}
            footer={null}
        >
            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Section: Logo + Description */}
                <div className="flex flex-col gap-4">
                    <div className="w-full flex justify-center bg-neutral-100 rounded-lg p-4">
                        <img
                            loading="lazy"
                            src={
                                product?.productLogo?.includes("http")
                                    ? product.productLogo
                                    : `${process.env.NEXT_PUBLIC_SERVER_URL}${product.productLogo}`
                            }
                            alt={product.productName}
                            className="h-48 object-contain"
                        />
                    </div>
                    <p className="text-sm text-gray-700">{product.productDescription}</p>
                </div>

                {/* Right Section: Metadata */}
                <div className="text-sm text-gray-700 space-y-2">
                    {product.additionalDetails && (
                        <p>
                            <strong>Details:</strong> {product.additionalDetails}
                        </p>
                    )}
                    <p>
                        <strong>Visibility:</strong>{" "}
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${product.publicVisibility
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {product.publicVisibility ? "Public" : "Private"}
                        </span>
                    </p>

                    <p>
                        <strong>Rating:</strong> {product.rating?.toFixed(1) || "Not rated"}
                    </p>
                    <Rate disabled allowHalf defaultValue={product.rating} />
                    {/* Links */}
                    <div className="space-y-2 mt-3">
                        {product.loomVideoLink && (
                            <a
                                href={product.loomVideoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline"
                            >
                                Loom Video <ExternalLink className="inline w-4 h-4 ml-1" />
                            </a>
                        )}
                        {product.g2Link && (
                            <a
                                href={product.g2Link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline"
                            >
                                G2 Reviews <ExternalLink className="inline w-4 h-4 ml-1" />
                            </a>
                        )}
                        {product.capterraLink && (
                            <a
                                href={product.capterraLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline"
                            >
                                Capterra Page <ExternalLink className="inline w-4 h-4 ml-1" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Divider & Images */}

            <>
                <Divider className="mt-6" />
                <h4 className="text-lg font-medium text-neutral-800 mb-3">Product Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {product?.productImages?.map((image: string, index: number) => (
                        <div
                            key={index}
                            className="bg-neutral-100 rounded-lg p-2 flex items-center justify-center"
                        >
                            {renderFileType(image)}
                        </div>
                    ))}
                    {product?.loomVideoLink && (
                        <div className="bg-neutral-100 rounded-lg p-2 flex items-center justify-center">
                            <iframe src={product?.loomVideoLink?.replace("/share/", "/embed/")} frameBorder="0" allowFullScreen className="w-full h-full"></iframe>
                        </div>
                    )}
                    {product?.resources?.map((resource: string, index: number) => (
                        <div key={index} className="bg-neutral-100 rounded-lg p-2 flex items-center justify-center">
                            <img loading="lazy" src={resource} alt="Product Image" className="w-full h-full object-cover rounded-md" />
                        </div>
                    ))}
                </div>
            </>

        </Modal>
    );
}
