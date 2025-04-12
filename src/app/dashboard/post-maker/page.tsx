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
    const [selectedBrandId, setSelectedBrandId] = useState("");

    const [relatedCampaigns, setRelatedCampaigns] = useState([]);
    const [postContent, setPostContent] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isReadMore, setIsReadMore] = useState(false);


    const [relatedProducts, setRelatedProducts] = useState([]);
    const [userData, setUserData] = useState(null);
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

    // const getRelatedProducts = async (userId) => {
    //     if (!userId) return; // Prevent unnecessary API calls
    //     try {
    //         const response = await api.get(`/campaigns/related-cg/${userId}`);
    //         setRelatedCampaigns(response.data);
    //     } catch (error) {
    //         console.error("Error fetching related campaigns:", error);
    //     }
    // }

    useEffect(() => {
        getUserData();

    }, []);

    useEffect(() => {
        if (userData?._id) {
            getRelatedCampaigns(userData._id);
        }
    }, [userData]);

    // useEffect(() => {
    //     if (selectedCampaign) {
    //         getRelatedProducts(selectedCampaign);
    //     }
    // }, [selectedCampaign]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && files?.length) {
            // uploading all images
            const imageFiles = Array.from(files);
            const imageUrls = imageFiles.map((file) => URL.createObjectURL(file));

            setImagePreview(imageUrls);
            setImageFile(imageFiles);
        }
    };

    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const onChange = (date: any, dateString: string) => {
        setDate(dateString);
    }

    const onTimeChange = (time: any, timeString: string) => {
        setTime(timeString);
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const SchedulePostModal = () => {
        return (
            <Modal
                centered
                title="Schedule Post"
                open={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                footer={[]}
                width={400}
            >
                <label>
                    <span className="font-medium">Date</span>
                </label>
                <DatePicker
                    onChange={onChange}
                    className="w-full mb-2"
                    value={date}
                />
                <label htmlFor="">
                    <span className="font-medium">Time</span>
                </label>
                <TimePicker
                    onChange={onTimeChange}
                    className="w-full"
                    format={"HH:mm"}
                    value={time}
                />

                <div className="mt-4">
                    <Button
                        className="mr-2 bg-primary-700"
                        type="primary"
                        size="small"
                        onClick={() => setIsModalVisible(false)}
                    >
                        Schedule
                    </Button>
                    <Button

                        size="small"
                        onClick={() => setIsModalVisible(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </Modal>
        )
    }

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

    const publishToLinkedIn = async () => {
        const formData = new FormData();
        formData.append("content", postContent);
        formData.append("hookType", "AI Text Creator");

        if (imagePreview && imageFile) {
            imageFile.forEach((file) => formData.append("images", file));
        }

        if (!selectedCampaign) {
            toast.error("Please select a campaign to share this post", {
                position: "top-center",
                description: "Please select a campaign to share this post",
            });
            return;
        }
        try {
            const res = await api.post(`/campaigns/${selectedCampaign}/creators/${userData._id}/submit`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res?.data.error_code === 400) {
                toast.error(res.message, {
                    position: "top-center",
                    description: res.message,
                });
                handleLinkedinAccess();
                return;
            }

            toast.success("Post shared successfully", {
                position: "top-center",
                description: "Your post has been shared to LinkedIn",
            });
        } catch (error) {
            console.error("Error sharing post to LinkedIn:", error);
        }
    };



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
                setIsModalVisible={setIsModalVisible}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                isReadMore={isReadMore}
                setIsReadMore={setIsReadMore}
                relatedProducts={[]}
            />
            {SchedulePostModal()}
        </div>
    );
}







