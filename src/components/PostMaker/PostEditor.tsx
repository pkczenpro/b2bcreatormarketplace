import React, { useRef, useState } from "react";
import { Button, Input, Modal, Select, Tooltip } from "antd";
import {
    ImagePlus,
    Linkedin,
    Send,
    Sparkles
} from "lucide-react";
import api from "@/utils/axiosInstance";
import { string_to_unicode_variant as toUnicodeVariant } from "string-to-unicode-variant";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoadingOutlined } from "@ant-design/icons";

const schema = z.object({
    post: z.string().min(1, "Post cannot be empty"),
});

type FormData = z.infer<typeof schema>;

const hookOptions = [
    "Trending and Timely Hook",
    "Value Driven Hook",
    "Curiosity Driven Hook",
    "Lead Magnet Style Hook",
    "Awareness Type Hook",
];

const PostEditor = ({
    postContent,
    setPostContent,
    handleTextFormatting,
    handleImageUpload,
    relatedCampaigns,
    selectedCampaign,
    setSelectedCampaign,
    publishToLinkedIn,
    isSelectSharingModalOpen,
    setIsSelectSharingModalOpen,
    relatedProducts,
    publishLoading
}) => {
    const [aiPrompt, setAiPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    const [brandName, setBrandName] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [hookType, setHookType] = useState("");

    const fileInputRef = useRef(null);

    const { handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { post: "" },
    });

    const generatePostWithAI = async () => {
        if (!aiPrompt) return;
        setLoading(true);
        try {
            const response = await api.post("/campaigns/generate-post", {
                prompt: aiPrompt,
                selectedCampaign,
                selectedProduct,
                brandName,
                hookType,
            });
            setPostContent(response.data.post);
        } catch (error) {
            console.error("AI Generation Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const onFormat = (variants: string[]) => {
        const textarea = document.getElementById("postTextarea") as HTMLTextAreaElement;
        if (!textarea) return;

        const { selectionStart, selectionEnd } = textarea;
        if (selectionStart !== selectionEnd) {
            const selectedText = postContent.slice(selectionStart, selectionEnd);
            const formattedText = variants.reduce((text, variant) => {
                return toUnicodeVariant(text, variant, [
                    variant === "strikethrough" ? "strike" : "",
                    variant === "underline" ? "underline" : "",
                ]);
            }, selectedText);

            const updatedText = postContent.slice(0, selectionStart) + formattedText + postContent.slice(selectionEnd);
            setPostContent(updatedText);
        }
    };

    const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setUploadedImages(prev => [...prev, ...files]);
        handleImageUpload(files);
    };

    const characterCount = postContent.length;
    const characterLimit = 3000;

    return (
        <div className="flex flex-col w-full mx-auto bg-white py-6 gap-5">

            {/* Campaign & Product Section */}
            {isSelectSharingModalOpen === "1" && (
                <div className="flex gap-2">
                    <div className="w-full">
                        <p className="font-semibold text-neutral-700 mb-2">Select Campaign</p>
                        <Select
                            className="w-full"
                            placeholder="Choose campaign"
                            value={selectedCampaign}
                            onChange={setSelectedCampaign}
                            options={relatedCampaigns.map(c => ({ label: c.title, value: c._id }))}
                        />
                    </div>
                    <div className="w-full">
                        <p className="font-semibold text-neutral-700 mb-2">Select Product</p>
                        <Input
                            className="w-full"
                            placeholder="Choose product"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        />
                    </div>
                    <div className="w-full">
                        <p className="font-semibold text-neutral-700 mb-2">Brand Name</p>
                        <Input
                            className="w-full"
                            placeholder="Enter brand name"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Hook Type */}
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">Hook Type</p>
                <Select
                    className="w-full"
                    value={hookType}
                    onChange={setHookType}
                    options={hookOptions.map(hook => ({ label: hook, value: hook }))}
                />
            </div>

            {/* AI Prompt */}
            <div>
                <p className="font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                    <Sparkles size={18} className="text-yellow-500" />
                    Generate post with AI
                </p>
                <div className="flex gap-2">
                    <Input
                        placeholder="Describe your idea..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                    />
                    <Button type="primary" loading={loading} icon={<Send size={16} />} onClick={generatePostWithAI}>
                        Generate
                    </Button>
                </div>
            </div>

            {/* Post Editor */}
            <div>
                <p className="font-semibold text-neutral-700 mb-2">Write your Post</p>
                <Input.TextArea
                    id="postTextarea"
                    rows={12}
                    placeholder="Start writing here..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                />

                {/* Formatting Toolbar */}
                <div className="flex items-center gap-2 flex-wrap mt-2">
                    {["bold", "italic", "monospace", "script", "strikethrough", "underline"].map(variant => (
                        <Tooltip key={variant} title={variant.charAt(0).toUpperCase() + variant.slice(1)}>
                            <button
                                onClick={() => onFormat([variant])}
                                className="px-3 py-1 border rounded text-sm hover:bg-neutral-100 focus:outline-none"
                            >
                                {variant}
                            </button>
                        </Tooltip>
                    ))}
                </div>

                <p className="text-sm text-neutral-500 mt-4">{characterCount}/{characterLimit} characters</p>
            </div>

            {/* Image Upload + Submit Section */}
            <div className="flex items-start justify-between">
                <div>
                    <Button icon={<ImagePlus size={16} />} onClick={() => fileInputRef.current?.click()}>
                        Add Image
                    </Button>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                        onChange={onImageUpload}
                    />
                    <div className="flex gap-2 mt-2">
                        {uploadedImages.map((file, idx) => (
                            <img
                                key={idx}
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-16 h-16 object-cover rounded"
                            />
                        ))}
                    </div>
                </div>

                <Button type="primary" icon={<Linkedin size={16} />} onClick={publishToLinkedIn} loading={publishLoading || loading}>
                    Publish to LinkedIn {publishLoading || loading && <LoadingOutlined size={16} />}
                </Button>
            </div>
        </div>
    );
};

export default PostEditor;
