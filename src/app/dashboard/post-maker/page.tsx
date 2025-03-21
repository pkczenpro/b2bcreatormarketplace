/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Button, DatePicker, Input, Modal, Select, TimePicker } from "antd";
import { ArrowLeft, Bold, Clock, Earth, Ellipsis, Forward, Image, Italic, Link as LinkIcon, ThumbsUp, MessageCircleMore, Send } from "lucide-react";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";

type PostMakerProps = object;

export default function PostMaker({ }: PostMakerProps) {
    const [selectedCampaign, setSelectedCampaign] = useState("");
    console.log(selectedCampaign);
    const [postContent, setPostContent] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isReadMore, setIsReadMore] = useState(false);

    const [userData, setUserData] = useState(null);
    const getUserData = async () => {
        const response = await api.get("/users/user");
        setUserData(response.data);
    }
    useEffect(() => {
        getUserData();
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            setImageFile(file);
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

    const linkedInClientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const redirectUri = "https://b2bcreatormarketplace.vercel.app/auth/linkedin/access_token_callback"; // Change in production

    const handleLogin = () => {
        const scopes = [
            "openid",
            "profile",
            "email",
            "w_member_social",
        ].join(" ");
        const userType = userData?.userType;

        const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedInClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${userType}&scope=${encodeURIComponent(scopes)}`;
        window.location.href = linkedInAuthUrl; // Redirect to LinkedIn login };
    }


    const publishToLinkedIn = async () => {
        const accessToken = userData?.linkedin?.access_token; // Get this from OAuth
        const USER_ID = userData?.linkedin?.id;

        const formData = new FormData();
        formData.append("postContent", postContent);
        formData.append("accessToken", accessToken);
        formData.append("userId", USER_ID);

        if (imagePreview) {
            formData.append("mediaType",
                // IMAGE, VIDEO, DOCUMENT 
                "IMAGE"
            )
            formData.append("image", imageFile);
        }


        console.log(formData)
        try {
            const res = await api.post("/users/share-content", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Post shared successfully", {
                position: "top-center",
                description: "Your post has been shared to LinkedIn",
            });
            setPostContent("");
            setImagePreview(null);
            setImageFile(null);
        } catch (ex) {
            console.log(ex);
        }
    };



    return (
        <div className="w-full bg-neutral-50 flex flex-col items-center justify-start min-h-screen">
            <Link
                href="/dashboard"
                className="flex items-center w-[90%] py-4 mt-4 h-[5vh]">
                <ArrowLeft className="text-neutral-900 mr-2" />
                <p className="text-xl text-neutral-900 font-bold">Post Maker</p>
            </Link>

            <div className="flex flex-col md:flex-row w-[90%] mt-4 space-x-0 md:space-x-4 space-y-4 md:space-y-0 sm:h-[80vh] bg-white p-6 rounded-md shadow-md">
                <div className="flex flex-col w-full md:w-1/2 px-4 py-4">
                    <Select
                        className="mb-4"
                        placeholder="Select Campaign"
                        onChange={setSelectedCampaign}
                    >
                        <Select.Option value="1">Option 1</Select.Option>
                        <Select.Option value="2">Option 2</Select.Option>
                        <Select.Option value="3">Option 3</Select.Option>
                    </Select>

                    <label htmlFor="post-content" className="font-medium mb-2">Write a post</label>

                    <Input.TextArea
                        id="post-content"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="What do you want to talk about?"
                        className="mb-4"
                        autoSize={{ minRows: 20 }}
                    />


                    <div className="flex space-x-4 mb-4">
                        <button onClick={() => handleTextFormatting("bold")}>
                            <Bold size={20} />
                        </button>
                        <button onClick={() => handleTextFormatting("italic")}>
                            <Italic size={20} />
                        </button>
                        <button onClick={() => handleTextFormatting("createLink")}>
                            <LinkIcon size={20} />
                        </button>
                        <label className="cursor-pointer">
                            <Image size={20} />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </div>

                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-sm text-neutral-500">Saved at 12:48 PM</span>
                        <div className="flex space-x-2">
                            <Button
                                icon={<Clock size={16} />}
                                onClick={() => setIsModalVisible(true)}
                            >
                                Schedule Post
                            </Button>
                            <Button type="primary" className="bg-primary-700" onClick={() => {
                                if (userData?.linkedin?.access_token) {
                                    publishToLinkedIn(userData?.linkedin?.access_token);
                                } else {
                                    handleLogin();
                                }
                            }}>
                                Publish to LinkedIn
                            </Button>



                        </div>
                    </div>
                </div>

                {/* Right Side - Post Preview */}
                <div className="flex flex-col w-full md:w-1/2 px-4 py-4 h-full">
                    <div className="p-6 rounded-md min-h-[30vh] flex-grow bg-neutral-50">
                        <div className="p-6 flex flex-col justify-between min-h-[50%] max-h-[100%] bg-white rounded-md shadow-md">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-2">
                                    <img loading="lazy" src={
                                        userData?.profilePicture?.includes("http") ?
                                            userData?.profilePicture :
                                            `https://b2b-backend-a26e-git-main-omardaklbabs-projects.vercel.app/${userData?.profilePicture}`

                                    } alt="Profile" className="w-8 h-8 rounded-full" />
                                    <div>
                                        <h1 className="text-sm font-medium">
                                            {userData?.name}
                                        </h1>
                                        <p className="text-xs text-neutral-500">325 followers</p>
                                        <p className="text-xs text-neutral-500 flex items-center">
                                            20h
                                            <span className="mx-1 text-black">•</span>
                                            <Earth size={12} />
                                        </p>
                                    </div>
                                </div>
                                <Ellipsis size={20} />
                            </div>

                            <div className="max-w-full max-h-[350px] overflow-y-auto">
                                <p className={`text-neutral-800 break-words mt-4 ${isReadMore ? '' : 'max-h-[150px] overflow-y-auto'}`}>
                                    {isReadMore ? postContent : `${postContent.slice(0, 200)}...`}
                                    {postContent.length > 200 && (
                                        <button
                                            onClick={() => setIsReadMore(!isReadMore)}
                                            className="text-blue-500 cursor-pointer mt-2"
                                        >
                                            {isReadMore ? 'Read less' : 'Read more'}
                                        </button>
                                    )}
                                </p>
                            </div>

                            {imagePreview && (
                                <img loading="lazy"
                                    src={imagePreview}
                                    alt="Uploaded preview"
                                    className="mt-4 rounded-md max-h-[200px] h-auto object-cover"
                                />
                            )}

                            <div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center space-x-2">
                                        <img loading="lazy" src="/icons/Like.png" alt="Like" className="w-5 h-5" />
                                        <img loading="lazy" src="/icons/Celebrate.png" alt="Celebrate" className="w-5 h-5" />
                                        <img loading="lazy" src="/icons/Support.png" alt="Support" className="w-5 h-5" />
                                        <img loading="lazy" src="/icons/Love.png" alt="Love" className="w-5 h-5" />
                                        <img loading="lazy" src="/icons/Insightfull.png" alt="Insightful" className="w-5 h-5" />
                                        <img loading="lazy" src="/icons/Curious.png" alt="Curious" className="w-5 h-5" />
                                        <p className="text-xs text-neutral-500">88</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500">4 comments</p>
                                    </div>
                                </div>

                                <div className="border-t border-neutral-200 mt-4"></div>

                                <div className="flex items-center mt-4 space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <ThumbsUp size={20} className="text-neutral-600" />
                                        <p className="text-neutral-600">Like</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MessageCircleMore size={20} className="text-neutral-600" />
                                        <p className="text-neutral-600">Comment</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Forward size={20} className="text-neutral-600" />
                                        <p className="text-neutral-600">Share</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Send size={20} className="text-neutral-600" />
                                        <p className="text-neutral-600">Send</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            {/* Schedule Post Modal */}
            {SchedulePostModal()}
        </div>
    );
}
