/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Button, DatePicker, Input, Modal, Select, TimePicker } from "antd";
import { ArrowLeft, Bold, Clock, Earth, Ellipsis, Forward, Image, Italic, Link as LinkIcon, ThumbsUp, MessageCircleMore, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";


type PostMakerProps = object;

export default function PostMaker({ }: PostMakerProps) {
    const [selectedCampaign, setSelectedCampaign] = useState("");
    const [relatedCampaigns, setRelatedCampaigns] = useState([]);
    const [postContent, setPostContent] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isReadMore, setIsReadMore] = useState(false);

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

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        if (userData?._id) {
            getRelatedCampaigns(userData._id);
        }
    }, [userData]);

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
        formData.append("type", "AI Text Creator");

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
            />
            {SchedulePostModal()}
        </div>
    );
}


const Header = () => (
    <Link href="/dashboard" className="flex items-center w-[90%] py-4 mt-4 h-[5vh]">
        <ArrowLeft className="text-neutral-900 mr-2" />
        <p className="text-xl text-neutral-900 font-bold">Post Maker</p>
    </Link>
);

const MainContent = ({ postContent, setPostContent, handleTextFormatting, handleImageUpload, relatedCampaigns, selectedCampaign, setSelectedCampaign, userData, publishToLinkedIn, setIsModalVisible, imagePreview, isReadMore, setIsReadMore }) => (
    <div className="flex flex-col md:flex-row w-[90%] mt-4 space-x-0 md:space-x-4 space-y-4 md:space-y-0 sm:h-[80vh] bg-white p-6 rounded-md shadow-md">
        <PostEditor
            postContent={postContent}
            setPostContent={setPostContent}
            handleTextFormatting={handleTextFormatting}
            handleImageUpload={handleImageUpload}
            relatedCampaigns={relatedCampaigns}
            selectedCampaign={selectedCampaign}
            setSelectedCampaign={setSelectedCampaign}
            publishToLinkedIn={publishToLinkedIn}
            setIsModalVisible={setIsModalVisible}
        />
        <PostPreview userData={userData} postContent={postContent} imagePreview={imagePreview} isReadMore={isReadMore} setIsReadMore={setIsReadMore} />
    </div>
);



const PostEditor = ({ postContent, setPostContent, handleTextFormatting, handleImageUpload, relatedCampaigns, selectedCampaign, setSelectedCampaign, publishToLinkedIn, setIsModalVisible }) => {

    const [aiPrompt, setAiPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const generatePostWithAI = async () => {
        if (!aiPrompt) return;
        setLoading(true);
        try {
            const response = await api.post("/campaigns/generate-post", { prompt: aiPrompt, selectedCampaign });
            setPostContent(response.data);
        } catch (error) {
            console.error("AI Generation Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full md:w-1/2 px-4 py-4 bg-white rounded-lg shadow-md">
            {/* Campaign Selection */}
            <Select className="mb-4" placeholder="Select Campaign" onChange={setSelectedCampaign}>
                {relatedCampaigns.map((campaign) => (
                    <Select.Option key={campaign._id} value={campaign._id}>
                        {campaign.title}
                    </Select.Option>
                ))}
            </Select>

            {/* AI Prompt Input */}
            <div className="mb-4">
                <label htmlFor="ai-input" className="font-medium flex items-center gap-2">
                    <Sparkles size={18} className="text-yellow-500" />
                    Generate with AI
                </label>
                <Input
                    id="ai-input"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe your post in a few words..."
                    className="mt-1"
                />
                <Button
                    type="primary"
                    icon={<Send size={16} />}
                    className="mt-2 w-full"
                    loading={loading}
                    onClick={generatePostWithAI}
                >
                    Generate Post
                </Button>
            </div>

            {/* Post Editor */}
            <label htmlFor="post-content" className="font-medium mb-2">
                Write a post
            </label>
            <Input.TextArea
                id="post-content"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What do you want to talk about?"
                className="mb-4"
                autoSize={{ minRows: 8, maxRows: 20 }}
            />

            {/* Toolbar and Actions */}
            <Toolbar handleTextFormatting={handleTextFormatting} handleImageUpload={handleImageUpload} />
            <Actions setIsModalVisible={setIsModalVisible} publishToLinkedIn={publishToLinkedIn} />
        </div>
    )
}

const Toolbar = ({ handleTextFormatting, handleImageUpload }) => (
    <div className="flex space-x-4 mb-4">
        {["bold", "italic", "createLink"].map((format, index) => (
            <button key={index} onClick={() => handleTextFormatting(format)}>
                {format === "bold" ? <Bold size={20} /> : format === "italic" ? <Italic size={20} /> : <LinkIcon size={20} />}
            </button>
        ))}
        <label className="cursor-pointer">
            <Image size={20} />
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
        </label>
    </div>
);

const Actions = ({ setIsModalVisible, publishToLinkedIn }) => (
    <div className="flex justify-between items-end mt-auto">
        <span className="text-sm text-neutral-500">Saved at 12:48 PM</span>
        <div className="flex space-x-2">
            <Button icon={<Clock size={16} />} onClick={() => setIsModalVisible(true)}>
                Schedule Post
            </Button>
            <Button type="primary" className="bg-primary-700" onClick={publishToLinkedIn}>
                Publish to LinkedIn
            </Button>
        </div>
    </div>
);

const PostPreview = ({ userData, postContent, imagePreview, isReadMore, setIsReadMore }) => (
    <div className="flex flex-col w-full md:w-1/2 px-4 py-4 h-full">
        <div className="p-6 rounded-md min-h-[30vh] flex-grow bg-neutral-50">
            <div className="p-6 flex flex-col justify-between min-h-[50%] max-h-[100%] bg-white rounded-md shadow-md">
                <UserInfo userData={userData} />
                <PostContent postContent={postContent} isReadMore={isReadMore} setIsReadMore={setIsReadMore} imagePreview={imagePreview} />
            </div>
        </div>
    </div>
);

const PostContent = ({ postContent, imagePreview, isReadMore, setIsReadMore }) => (
    <div className="p-6 flex flex-col justify-between">
        {/* Post Content */}
        <div className="max-w-full max-h-[350px] overflow-y-auto">
            <p className={`text-neutral-800 break-words mt-4 ${isReadMore ? "" : "max-h-[250px] overflow-y-auto"}`}>
                {isReadMore ? postContent : `${postContent.slice(0, 200)}...`}
                {postContent.length > 200 && (
                    <button onClick={() => setIsReadMore(!isReadMore)} className="text-blue-500 cursor-pointer mt-2">
                        {isReadMore ? "Read less" : "Read more"}
                    </button>
                )}
            </p>
        </div>

        {/* Image Slider */}
        {imagePreview && imagePreview.length > 0 && (
            <Swiper
                spaceBetween={10}
                pagination={{ clickable: true }}
                modules={[
                    Pagination,
                    Autoplay
                ]}
                className="mt-4 rounded-md max-w-[80%]"
                autoplay={{ delay: 1000 }}
            >
                {imagePreview.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            loading="lazy"
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="rounded-md w-full max-h-[300px] object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        )}

        {/* Reactions & Actions */}
        <div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                    {["Like", "Celebrate", "Support", "Love", "Insightful", "Curious"].map((reaction) => (
                        <img key={reaction} loading="lazy" src={`/icons/${reaction}.png`} alt={reaction} className="w-5 h-5" />
                    ))}
                    <p className="text-xs text-neutral-500">88</p>
                </div>
                <p className="text-xs text-neutral-500">4 comments</p>
            </div>

            <div className="border-t border-neutral-200 mt-4"></div>

            {/* Post Actions */}
            <div className="flex items-center mt-4 space-x-6">
                {[
                    { icon: <ThumbsUp size={20} />, text: "Like" },
                    { icon: <MessageCircleMore size={20} />, text: "Comment" },
                    { icon: <Forward size={20} />, text: "Share" },
                    { icon: <Send size={20} />, text: "Send" },
                ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center space-x-2">
                        {icon}
                        <p className="text-neutral-600">{text}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


const UserInfo = ({ userData }) => (
    <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
            <img loading="lazy" src={userData?.profilePicture} alt="Profile" className="w-8 h-8 rounded-full" />
            <div>
                <h1 className="text-sm font-medium">{userData?.name}</h1>
                <p className="text-xs text-neutral-500">325 followers</p>
            </div>
        </div>
        <Ellipsis size={20} />
    </div>
);