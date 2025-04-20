/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Button, DatePicker, Modal, TimePicker } from "antd";
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

    useEffect(() => {
        getUserData();

    }, []);

    useEffect(() => {
        if (userData?._id) {
            getRelatedCampaigns(userData._id);
        }
    }, [userData]);

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

    const saveDraftToLocalStorage = async () => {
        if (!postContent) {
            toast.error("Please write something before saving as a draft");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("postContent", postContent);
            formData.append("selectedCampaign", selectedCampaign);
            formData.append("createdAt", new Date().toISOString());
            formData.append("isCampaignPost", isSelectSharingModalOpenValue === "1" ? true : false);

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
        const formData = new FormData();
        formData.append("content", postContent);
        formData.append("hookType", "AI Text Creator");
        formData.append("isCampaignPost", isSelectSharingModalOpenValue === "1" ? true : false);

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
                    description: "Your post has been shared to LinkedIn",
                });
            }
        } catch (error) {
            console.error("Error sharing post to LinkedIn:", error);
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

    const draftSelectionModal = () => {
        return (
            <Modal
                centered
                open={isDraftModalOpen}
                onCancel={() => setIsDraftModalOpen(false)}
                width={700}
                okText="Save Current Post as Draft"
                onOk={() => {
                    saveDraftToLocalStorage();
                    setIsDraftModalOpen(false);
                }}
                title={<h2 className="text-xl font-bold">Your Drafts</h2>}
            >
                <div className="flex flex-col gap-4" style={{
                    maxHeight: "80vh",
                    overflow: "auto",
                }}>
                    {drafts && drafts.length > 0 ? (
                        drafts.map((draft, index) => (
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
                                            {draft.isCampaignPost ? `Campaign: ${draft.selectedCampaign || "-"}` : 'Independent Post'}
                                        </p>
                                        {draft?.createdAt && <p className="text-xs text-gray-400">
                                            {new Date(draft.createdAt).toLocaleDateString()}
                                        </p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="small"
                                            onClick={() => loadDraft(draft)}
                                        >
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
                relatedProducts={[]}
                isSelectSharingModalOpen={isSelectSharingModalOpenValue}
                setIsSelectSharingModalOpen={setIsSelectSharingModalOpenValue}
                setIsDraftModalOpen={setIsDraftModalOpen}
                saveDraftToLocalStorage={saveDraftToLocalStorage}
            />
            {selectSharingModal()}
            {draftSelectionModal()}
        </div>
    );
}







