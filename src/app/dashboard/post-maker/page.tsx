/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Button, Modal, Select } from "antd";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import MainContent from "@/components/PostMaker/MainContent";
import Header from "@/components/PostMaker/Header";



type PostMakerProps = object;

export default function PostMaker({ }: PostMakerProps) {
    const [selectedCampaign, setSelectedCampaign] = useState("");
    const [relatedCampaigns, setRelatedCampaigns] = useState([]);
    const [postContent, setPostContent] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isReadMore, setIsReadMore] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isSelectSharingModalOpenValue, setIsSelectSharingModalOpenValue] = useState("0");
    const [isSelectSharingModalOpen, setIsSelectSharingModalOpen] = useState(true);
    const [drafts, setDrafts] = useState([]);
    const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [brandName, setBrandName] = useState("");

    const getUserData = async () => {
        try {
            const response = await api.get("/users/user");
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const getRelatedCampaigns = async (userId) => {
        if (!userId) return; // Prevent unnecessary API calls
        try {
            const response = await api.get(`/campaigns/related-cg/${userId}`);
            setRelatedCampaigns(response.data);
        } catch (error) {
            console.error("Error fetching related campaigns:", error);
        }
    };


    const getRelatedProducts = async (userId) => {
        if (!userId) return; // Prevent unnecessary API calls
        try {
            const response = await api.get(`/campaigns/related-products/${userId}`);
            setRelatedProducts(response.data.products || []);
            setBrandName(response.data?.brandName || ""); // Set the brand name from the first product
        } catch (error) {
            console.error("Error fetching related campaigns:", error);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        if (userData?._id) {
            getRelatedCampaigns(userData._id);
        }
    }, [userData]);

    useEffect(() => {
        if (selectedCampaign) {
            getRelatedProducts(selectedCampaign);
        }
    }, [selectedCampaign]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event
        if (files && files?.length) {
            // uploading all images
            const imageFiles = Array.from(files);
            const imageUrls = imageFiles.map((file) => URL.createObjectURL(file));

            setImagePreview(imageUrls);
            setImageFile(imageFiles);
        }
    };

    const handleTextFormatting = (format) => {
        document.execCommand(format, false, null); // Executes the formatting command
    };

    const getLinkedInAuthUrl = () => {
        const scopes = ["openid", "profile", "email", "w_member_social"].join(" ");
        const linkedInClientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
        const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
        const redirectUri = `${DOMAIN}/auth/linkedin/access_token_callback`; // Change in production

        localStorage.setItem("lastUrl", "/dashboard/post-maker");

        return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedInClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    };

    const handleLinkedinAccess = () => {
        const linkedInAuthUrl = getLinkedInAuthUrl();
        window.location.href = linkedInAuthUrl;
    };

    const saveDraftToLocalStorage = async (selectedCategory) => {
        if (!postContent) {
            toast.error("Please write something before saving as a draft");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("postContent", postContent);
            formData.append("selectedCampaign", selectedCampaign);
            formData.append("createdAt", new Date().toISOString());
            formData.append("isCampaignPost", isSelectSharingModalOpenValue);
            formData.append("category", selectedCategory);

            if (imageFile) {
                imageFile?.forEach((file) => formData.append("images", file));
            }

            await api.post("/users/save-draft", formData);
            getDrafts();

            toast.success("✨ Your draft has been saved! You can come back to it anytime.");
        } catch (error) {
            console.error("Error saving draft:", error);
            toast.error("Failed to save draft. Please try again.");
        }
    };

    const publishToLinkedIn = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("content", postContent);
        formData.append("type", "AI Text Creator");
        formData.append("isCampaign", isSelectSharingModalOpenValue);

        if (imagePreview && imageFile) {
            imageFile?.forEach((file) => formData.append("images", file));
        }


        try {
            const res = await api.post(`/campaigns/${selectedCampaign || "independent"}/creators/${userData._id}/submit`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res?.data.error_code === 400) {
                toast.error(res.message, {
                    position: "top-center",
                    description: res.message,
                });
                saveDraftToLocalStorage();
                handleLinkedinAccess();

            } else {
                toast.success("Post shared successfully", {
                    position: "top-center",
                    description: isSelectSharingModalOpenValue === "1" ? "Post shared to campaign, waiting for brand approval" : "Post shared to LinkedIn",
                });
            }
        } catch (error) {
            console.error("Error sharing post to LinkedIn:", error);
        } finally {
            setLoading(false);
        }
    };

    const getDrafts = async () => {
        try {
            const response = await api.get("/users/get-drafts");
            setDrafts(response.data.drafts.drafts || []);
        } catch (error) {
            console.error("Error fetching drafts:", error);
            toast.error("Failed to load drafts");
        }
    };

    useEffect(() => {
        getDrafts();
    }, []);

    const loadDraft = (draft) => {
        setPostContent(draft.postContent);
        if (draft.selectedCampaign) {
            setSelectedCampaign(draft.selectedCampaign);
        }
        setIsDraftModalOpen(false);
        toast.success("Draft loaded successfully");
    };

    const deleteDraft = async (draftId) => {
        try {
            await api.delete(`/users/delete-draft/${draftId}`);
            getDrafts(); // Refresh drafts list
            toast.success("Draft deleted successfully");
        } catch (error) {
            console.error("Error deleting draft:", error);
            toast.error("Failed to delete draft");
        }
    };

    // Define the categories
    const draftCategories = [
        "📌 Thought Leadership",
        "🧠 Frameworks",
        "🛠️ Behind the Build",
        "📚 Lessons Learned",
        "💬 Conversations",
        "🔍 What I'm Seeing",
        "✍️ Content Drops",
        "🔍 Draft/ Non Published"
    ];

    const draftSelectionModal = () => {
        // Group drafts by category
        const [filterGroup, setFilterGroup] = useState("📌 Thought Leadership");

        const groupedDrafts = drafts?.reduce((acc, draft) => {
            const category = draft.category || "Draft/ Non Published";
            if (!acc[category]) acc[category] = [];
            acc[category].push(draft);
            return acc;
        }, {});

        return (
            <Modal
                centered
                open={isDraftModalOpen}
                onCancel={() => setIsDraftModalOpen(false)}
                width={700}
                okText="Save Current Post as Draft"
                onOk={() => {
                    setCategoryModalOpen(true);
                }}
                title={<h2 className="text-xl font-bold">Your Drafts</h2>}
            >
                {groupedDrafts && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(groupedDrafts).map((category) => (
                                <span
                                    key={category}
                                    className="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium text-gray-700"
                                    onClick={() => setFilterGroup(category)}
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div
                    className="flex flex-col gap-6"
                    style={{ maxHeight: "70vh", overflowY: "auto" }}
                >
                    {groupedDrafts ? (
                        Object.entries(groupedDrafts)
                            .filter(([category]) => filterGroup === "All" || category === filterGroup)
                            .map(([category, drafts]) => (
                                <div key={category}>
                                    <h3 className="text-lg font-semibold mb-2">{category}</h3>
                                    <div className="flex flex-col gap-3">
                                        {drafts.map((draft, index) => (
                                            <div
                                                key={draft._id || index}
                                                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg mb-1">
                                                            {draft.postContent.substring(0, 50)}
                                                            {draft.postContent.length > 50 ? '...' : ''}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {draft.isCampaignPost
                                                                ? `Campaign: ${draft.selectedCampaign || "-"}`
                                                                : "Independent Post"}
                                                        </p>
                                                        {draft?.createdAt && (
                                                            <p className="text-xs text-gray-400">
                                                                {new Date(draft.createdAt).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button size="small" onClick={() => loadDraft(draft)}>
                                                            Load
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            danger
                                                            onClick={() => deleteDraft(draft._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">You don't have any drafts yet.</p>
                        </div>
                    )}
                </div>
            </Modal>

        );
    };

    const selectSharingModal = () => {
        return (
            <Modal
                centered
                open={isSelectSharingModalOpen}
                footer={null}
                width={500}
                className="select-sharing-modal"
                closable={false}
            >
                <div className="flex flex-col items-center justify-center p-6">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        How would you like to share this?
                    </h2>

                    <div className="w-full space-y-4">
                        <Button
                            className="w-full h-16 flex items-center justify-center gap-3 text-lg hover:bg-primary-50"
                            onClick={() => {
                                // Handle independent sharing
                                setIsSelectSharingModalOpen(false);
                                setIsSelectSharingModalOpenValue("0");
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <span className="font-semibold">Share Post Independently</span>
                                <span className="text-sm text-gray-500">Post directly to your profile</span>
                            </div>
                        </Button>

                        <Button
                            className="w-full h-16 flex items-center justify-center gap-3 text-lg hover:bg-primary-50"
                            type="primary"
                            onClick={() => {
                                // Handle campaign sharing
                                setIsSelectSharingModalOpen(false);
                                setIsSelectSharingModalOpenValue("1");
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <span className="font-semibold text-white">Share Post as a Campaign Post</span>
                                <span className="text-sm text-white opacity-70 text-center">Include in a marketing campaign</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </Modal>
        )
    }
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState("");

    return (
        <div className="w-full bg-neutral-50 flex flex-col items-center justify-start min-h-screen">
            <Header />
            <MainContent
                postContent={postContent}
                setPostContent={setPostContent}
                handleTextFormatting={handleTextFormatting}
                handleImageUpload={handleImageUpload}
                relatedCampaigns={relatedCampaigns}
                selectedCampaign={selectedCampaign}
                setSelectedCampaign={setSelectedCampaign}
                userData={userData}
                publishToLinkedIn={publishToLinkedIn}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                isReadMore={isReadMore}
                setIsReadMore={setIsReadMore}

                isSelectSharingModalOpen={isSelectSharingModalOpenValue}
                setIsSelectSharingModalOpen={setIsSelectSharingModalOpenValue}
                setIsDraftModalOpen={setIsDraftModalOpen}
                saveDraftToLocalStorage={saveDraftToLocalStorage}
                loading={loading}
                draftCategories={draftCategories}

                setRelatedProducts={setSelectedProduct}
                relatedProduct={selectedProduct}
                relatedProductsOptions={relatedProducts}

                brandName={brandName}
                setBrandName={setBrandName}
            />
            {selectSharingModal()}
            {draftSelectionModal()}

            <Modal
                open={categoryModalOpen}
                onCancel={() => setCategoryModalOpen(false)}
                footer={null}
                centered
                width={500}
            >
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Select Category</h2>
                    <div className="flex flex-wrap gap-2">
                        {draftCategories.map((cat) => (
                            <Button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`${category === cat ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                    <Button
                        onClick={() => {
                            setCategoryModalOpen(false);
                            saveDraftToLocalStorage(category);
                        }}
                    >
                        Save
                    </Button>
                </div>
            </Modal>
        </div>
    );
}







