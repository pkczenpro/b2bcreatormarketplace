import { Modal, Divider, Image } from "antd";
import { Rate } from "antd";
import { ExternalLink, FileText, Video } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";

interface Product {
    productName: string;
    productLogo: string;
    productDescription: string;
    publicVisibility: boolean;
    rating?: number;
    additionalDetails?: string;
    loomVideoLink?: string;
    g2Link?: string;
    capterraLink?: string;
    productHunt?: string;
    productLink?: string;
    productImages?: string[];
    resources?: string[];
}

interface ShowProductModalProps {
    modal: boolean;
    setModal: (value: boolean) => void;
    product: Product | null;
}

export default function ShowProductModal({
    modal,
    setModal,
    product,
}: ShowProductModalProps) {
    if (!product) return null;

    const isImageFile = (file: string) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        return imageExtensions.some(ext => file.toLowerCase().endsWith(ext));
    };

    const renderFileType = (file: string) => {
        const fileUrl = file.includes("http")
            ? file
            : `${process.env.NEXT_PUBLIC_SERVER_URL}${file}`;

        if (isImageFile(file)) {
            return (
                <Image
                    src={fileUrl}
                    alt="Product Image"
                    className="rounded-md object-cover max-h-48"
                    preview={true}
                />
            );
        } else {
            return (
                <div className="border rounded-md p-4 flex items-center space-x-2">
                    <FileText className="text-neutral-400 w-6 h-6" />
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        View Document <ExternalLink className="inline w-4 h-4 ml-1" />
                    </a>
                </div>
            );
        }
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
                    <div className="w-full flex justify-center bg-neutral-100 rounded-lg p-4 h-full">
                        {product.productLogo ? <img
                            loading="lazy"
                            src={
                                product?.productLogo?.includes("http")
                                    ? product.productLogo
                                    : `${process.env.NEXT_PUBLIC_SERVER_URL}${product.productLogo}`
                            }
                            alt={product.productName}
                            className="h-48 object-contain"
                        /> : <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon size={24} />
                        </div>}
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
                                className="block text-blue-600 hover:underline flex items-center"
                            >
                                <Video className="w-4 h-4 mr-2" />
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

                        {product.productHunt && (
                            <a
                                href={product.productHunt}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline"
                            >
                                Product Hunt <ExternalLink className="inline w-4 h-4 ml-1" />
                            </a>
                        )}

                        {product.productLink && (
                            <a
                                href={product.productLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline"
                            >
                                Product Link <ExternalLink className="inline w-4 h-4 ml-1" />
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
                </div>
            </>

            {/* Resources Section */}
            {product.resources && product.resources.length > 0 && (
                <>
                    <Divider className="mt-6" />
                    <h4 className="text-lg font-medium text-neutral-800 mb-3">Resources</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {product.resources.map((resource: string, index: number) => (
                            <div key={index} className="bg-neutral-100 rounded-lg p-2 flex items-center justify-center">
                                {renderFileType(resource)}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Loom Video Section */}
            {product.loomVideoLink && product.loomVideoLink !== "" && product.loomVideoLink !== "null" && product?.loomVideoLink?.includes("/share/") && (
                <>
                    <Divider className="mt-6" />
                    <h4 className="text-lg font-medium text-neutral-800 mb-3">Demo Video</h4>
                    <div className="bg-neutral-100 rounded-lg p-4">
                        <iframe
                            src={product.loomVideoLink.replace("/share/", "/embed/")}
                            frameBorder="0"
                            allowFullScreen
                            className="w-full aspect-video rounded-md"
                        />
                    </div>
                </>
            )}
        </Modal>
    );
}
