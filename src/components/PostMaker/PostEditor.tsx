import React, { useState } from "react";
import { Button, Input, Select, Tooltip } from "antd";
import { CheckIcon, ClipboardIcon, ImagePlus, Linkedin, Send, Sparkles, X } from "lucide-react";
import api from "@/utils/axiosInstance";
import { string_to_unicode_variant as toUnicodeVariant } from "string-to-unicode-variant";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip as RadixTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { title } from "process";
import { toast } from "sonner";

const schema = z.object({
    post: z.string().min(1, "Post cannot be empty"),
});

type FormData = z.infer<typeof schema>;

const PostEditor = ({
    postContent,
    setPostContent,
    handleTextFormatting,
    handleImageUpload,
    relatedCampaigns,
    selectedCampaign,
    setSelectedCampaign,
    publishToLinkedIn,
    setIsModalVisible,

    relatedProducts,
}) => {
    const [aiPrompt, setAiPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);

    const [brandName, setBrandName] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [hookType, setHookType] = useState("");

    const generatePostWithAI = async () => {
        if (!aiPrompt) return;
        setLoading(true);
        try {
            const response = await api.post("/campaigns/generate-post", {
                prompt: aiPrompt,
                selectedCampaign,
                selectedProduct,
                brandName,
                hookType
            });
            setPostContent(response.data.post);
        } catch (error) {
            console.error("AI Generation Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fileInputRef = React.useRef(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { post: "" }
    });

    const onFormat = (variants: ("bold" | "italic" | "monospace" | "script" | "strikethrough" | "underline")[]) => {
        const textarea = document.getElementById("postTextarea") as HTMLTextAreaElement;
        if (!textarea) return;

        const { selectionStart, selectionEnd } = textarea;
        const currentText = postContent; // Use prop directly

        if (selectionStart !== null && selectionEnd !== null && selectionStart !== selectionEnd) {
            const selectedText = currentText.slice(selectionStart, selectionEnd);

            const formattedText = variants.reduce((text, variant) => {
                return toUnicodeVariant(text, variant, [
                    variant === "strikethrough" ? "strike" : "",
                    variant === "underline" ? "underline" : "",
                ]);
            }, selectedText);

            const updatedText = currentText.slice(0, selectionStart) + formattedText + currentText.slice(selectionEnd);
            setPostContent(updatedText); // Update state directly
        }
    };
    const onImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            setUploadedImages([...uploadedImages, ...files]);
            handleImageUpload(files); // Pass files to the parent handler
        }
    };
    const characterCount = postContent.length;
    const characterLimit = 3000;

    const saveDraftToLocalStorage = () => {
        const draft = {
            postContent,
            selectedCampaign,
            selectedProduct,
            brandName,
            hookType,
            uploadedImages
        };
        localStorage.setItem("draft", JSON.stringify(draft));
        toast.success("✨ Your draft has been saved! You can come back to it anytime.");
    };

    const loadDraftFromLocalStorage = () => {
        const draft = localStorage.getItem("draft");
        if (draft) {
            const { postContent, selectedCampaign, selectedProduct, brandName, hookType, uploadedImages } = JSON.parse(draft);
            setPostContent(postContent);
            setSelectedCampaign(selectedCampaign);
            setSelectedProduct(selectedProduct);
            setBrandName(brandName);
            setHookType(hookType);
            setUploadedImages(uploadedImages);

            toast.success("📄 Loaded your saved draft. Ready to pick up where you left off!");
        }
    };
    React.useEffect(() => {
        loadDraftFromLocalStorage();
    }, []);
    return (
        <div className="flex flex-col w-full max-w-xl mx-auto bg-white py-6 gap-5">

            <div className="flex">
                {/* Campaign Selection */}
                <div className="w-full mr-2">
                    <p className="font-semibold text-neutral-700 mb-2">Select Campaign</p>
                    <Select
                        className="w-full"
                        placeholder="Choose campaign"
                        value={selectedCampaign}
                        onChange={setSelectedCampaign}
                        options={relatedCampaigns.map((c) => ({ label: c.title, value: c._id }))}
                    />
                </div>

                {/* Product Selection */}
                <div className="w-full">
                    <p className="font-semibold text-neutral-700 mb-2">Select Product</p>
                    {/* <Select
                        className="w-full"
                        value={selectedProduct}
                        onChange={setSelectedProduct}
                        options={relatedProducts?.map((c) => ({ label: c.title, value: c._id }))}
                    /> */}
                    <Input
                        className="w-full"
                        placeholder="Choose product"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    // options={relatedProducts?.map((c) => ({ label: c.title, value: c._id }))}
                    />
                </div>
                <div className="w-full">
                    <p className="font-semibold text-neutral-700 mb-2">Brand Name</p>
                    {/* <Select
                        className="w-full"
                        value={selectedProduct}
                        onChange={setSelectedProduct}
                        options={relatedProducts?.map((c) => ({ label: c.title, value: c._id }))}
                    /> */}
                    <Input
                        className="w-full"
                        placeholder="Choose brand name"
                        value={brandName}
                        onChange={(e) =>
                            setBrandName(e.target.value)
                        }
                    />

                </div>
            </div>

            {/* Product Selection */}
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">Hook Type</p>
                <Select
                    className="w-full"
                    value={hookType}
                    onChange={setHookType}
                    options={[
                        { title: "Trending and Timely Hook" },
                        { title: "Value Driven Hook" },
                        { title: "Curiosity Driven Hook" },
                        { title: "Lead Magnet Style Hook" },
                        { title: "Awareness Type Hook" },
                    ]?.map((c) => ({ label: c.title, value: c.title }))}
                />
            </div>

            {/* AI Content Generator */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-neutral-700 flex items-center gap-2">
                        <Sparkles size={18} className="text-yellow-500" />
                        Generate post with AI
                    </p>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Describe your idea..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                    />
                    <Button
                        type="primary"
                        loading={loading}
                        icon={<Send size={16} />}
                        onClick={generatePostWithAI}
                    >
                        Generate
                    </Button>
                </div>
            </div>

            {/* Post Content Area */}
            <div>
                <div>
                    <p className="font-semibold text-neutral-700 mb-2">Write your Post</p>
                    <Input.TextArea
                        id="postTextarea"
                        rows={12}
                        placeholder="Start writing here..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                    />
                </div>

                {/* Text Formatting Toolbar */}
                <div className="flex items-center gap-2 flex-wrap mt-2">
                    {["bold", "italic", "monospace", "script", "strikethrough", "underline"].map((variant) => (
                        <Tooltip key={variant} title={variant.charAt(0).toUpperCase() + variant.slice(1)}>
                            <button
                                onClick={() => onFormat([variant as any])}
                                className="px-3 py-1 border rounded text-sm hover:bg-neutral-100 focus:outline-none"
                            >
                                {variant}
                            </button>
                        </Tooltip>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-4 m-auto">
                    {/* <TooltipProvider>
                        <RadixTooltip>
                            <TooltipTrigger asChild>
                                <button onClick={handleCopy} className="flex items-center gap-1 text-blue-600 hover:underline">
                                    {copied ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
                                    {copied ? "Copied!" : "Copy Post"}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Copy to clipboard</TooltipContent>
                        </RadixTooltip>
                    </TooltipProvider> */}

                    <p className="text-sm text-neutral-500">{characterCount}/{characterLimit} characters</p>

                </div>
            </div>

            <div className="flex items-center justify-between">
                {/* Image Upload Area */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        icon={<ImagePlus size={16} />}
                        type="default"
                        onClick={() => fileInputRef.current?.click()}
                    >
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

                    {/* Preview Uploaded Images */}
                    <div className="flex gap-2 mt-2">
                        {uploadedImages?.map((file, index) => (
                            <div key={index} className="w-16 h-16">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center gap-2">
                    <div className="flex gap-2">
                        <Button
                            icon={<ClipboardIcon size={16} />}
                            onClick={() => {
                                saveDraftToLocalStorage();
                            }}
                        >
                            Save as Draft
                        </Button>
                        <Button
                            type="primary"
                            icon={<Linkedin size={16} />}
                            onClick={publishToLinkedIn}
                        >
                            Publish to LinkedIn
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default PostEditor;
