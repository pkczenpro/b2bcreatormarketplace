import { Button, DatePicker, Input, Modal, Select, Typography, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import Template_1 from "./TEMPLATES/Template_1";
import { ChevronLeft, ChevronRight, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";
import moment from "moment";
import { ClockCircleOutlined } from "@ant-design/icons";

const TEMPLATES = [
    { id: 1, name: "Template 1", size: "288x360", component: Template_1, bgColor: "#000" },
    { id: 2, name: "Template 2", size: "288x360", component: null, bgColor: "#7CA3C2" },
    { id: 3, name: "Template 3", size: "288x360", component: null, bgColor: "#BF8A5B" },
    { id: 4, name: "Template 4", size: "288x360", component: null, bgColor: "#814EB3" },
];



const DEFAULT_TEMPLATE = {
    editableTopic: {
        label: "Topic",
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center",
        hidden: false,
    },
    editableTitle: {
        label: "Title",
        color: "#ffffff",
        fontSize: 64,
        textAlign: "center",
        hidden: false,
    },
    editableTagline: {
        label: "Tagline",
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center",
        hidden: false,
    },
    editableProfileName: {
        label: null,
        color: "#ffffff",
        fontSize: 16,
        textAlign: "left",
        hidden: false,
    },
    editableProfileUsername: {
        label: null,
        color: "#ffffff",
        fontSize: 16,
        textAlign: "left",
        hidden: false,
    },
    editableButton: {
        label: "Button",
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center",
        hidden: false,
    },
    isLastItem: false, // If the last item
    swipeButton: true, // Show Swipe Button
    bgColor: "#000", // Background Color
    showProfileImage: true, // Show Profile Image
    backgroundImage: { // Background Image
        image: null,
        opacity: 1,
    },
    profileImage: { // Profile Image
        image: null,
        opacity: 1,
    },
    showEditingDiv: false, // Show the editing div
    emoji: null, // Emoji
    isHeadImage: false, // removes profile pic and puts it on the top instead of tagline
}


const { Title } = Typography;



const CarouselEditor = () => {

    const [userData, setUserData] = useState(null);
    const getUserData = async () => {
        try {
            const response = await api.get("/users/user");
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [posts, setPosts] = useState([0]);
    const [backgroundColor, setBackgroundColor] = useState("#000");

    const fontFamilies = ["Arial", "Courier New", "Georgia", "Lucida Console", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana"];
    const templateSizes = [
        {
            value: "360x360",
            label: "LinkedIn (4:5)"
        },
        {
            value: "288x360",
            label: "LinkedIn (1:1)"
        }
    ];

    const [postsData, setPostsData] = useState([
        {
            index: 0,
            postData: {
                ...DEFAULT_TEMPLATE,
                index: 0,
                showEditingDiv: false,
            }
        }
    ]);

    console.log("postsData", postsData);

    const [selectedSize, setSelectedSize] = useState("288x360");

    const addPost = () => {
        const newIndex = posts.length;
        setPosts([...posts, newIndex]);
        setPostsData([
            ...postsData,
            {
                index: newIndex,
                postData: {
                    ...DEFAULT_TEMPLATE,
                    index: newIndex,
                    showEditingDiv: false,
                }
            }
        ]);
    };

    const deletePost = (index) => {
        setPosts(posts.filter((_, i) => i !== index));
    };

    const exportPost = (index) => {
        const postElement = document.getElementById(`post-${index}`);
        if (postElement) {
            html2canvas(postElement, { backgroundColor: null }).then((canvas) => {
                setImageFile([...imageFile, canvas.toDataURL("image/png")]);
            });
        }
    };

    const [showTemplates, setShowTemplates] = useState(false);
    const showTemplatesModal = () => {
        return (
            <Modal
                width={"70vw"}
                title="Select Template"
                open={showTemplates}
                onCancel={() => setShowTemplates(false)}
                footer={null}
                centered
            >
                <div className="flex flex-col">
                    <div className="max-w-[75vw] flex justify-start items-center overflow-x-auto p-4 scroll-smooth h-[100%]">
                        <div className="flex flex-row space-x-8">
                            {TEMPLATES.map((item, index) => {
                                const TemplateComponent = item.component;
                                return (
                                    <div key={index} className="relative">
                                        <div id={`post-${index}`} className="flex flex-col justify-center items-center text-center" style={{ width: `${parseInt(selectedSize.split("x")[0]) * 1.5}px`, height: `${parseInt(selectedTemplate.size.split("x")[1]) * 1.5}px`, fontFamily: fontFamily }}>
                                            <TemplateComponent
                                                index={index}
                                                isLastItem={index === posts.length - 1 && posts.length > 1}
                                                data={postsData.find((item) => item.index === index)?.postData || postsData[0].postData} // Use find() to get the first matching item
                                                setData={(e) => {
                                                    const updatedPostsData = postsData.map((item) => {
                                                        if (item.index === index) {
                                                            return { ...item, postData: { ...item.postData, ...e } };
                                                        }
                                                        return item;
                                                    });
                                                    setPostsData(updatedPostsData);
                                                }}
                                            />

                                            <button className="w-full bg-primary-500 text-white py-2 rounded-md mt-4" onClick={() => {
                                                setSelectedTemplate(item);
                                                setShowTemplates(false);
                                            }
                                            }>
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }


    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    // Scroll left function
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    // Scroll right function
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    const [relatedCampaigns, setRelatedCampaigns] = useState([]);


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

    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [postContent, setPostContent] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const publishToLinkedIn = async () => {
        const imageFilesToAdd = [];

        setPostsData((prevPostsData) => {
            // set showEditingDiv to false for all posts
            return prevPostsData.map((post) => ({
                ...post,
                postData: {
                    ...post.postData,
                    showEditingDiv: false,
                },
            }));
        });

        // timeout 
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Process each post to extract images
        for (const index of posts) {
            const postElement = document.getElementById(`post-${index}`);
            if (postElement) {
                await html2canvas(postElement, { backgroundColor: null }).then((canvas) => {
                    // Convert canvas to data URL
                    const dataUrl = canvas.toDataURL("image/png");

                    // Convert data URL to Blob
                    const blob = dataURLtoBlob(dataUrl);

                    // Create a File from the Blob (using a timestamp as the filename)
                    const file = new File([blob], `image-${Date.now()}.png`, { type: "image/png" });

                    // Push the file to the imageFilesToAdd array
                    imageFilesToAdd.push(file);
                });
            }
        }

        // After all posts are processed, update the state with the new files
        setImageFile((prevFiles) => [...(prevFiles || []), ...imageFilesToAdd]);

        // Create the form data for the API request
        const formData = new FormData();
        formData.append("content", postContent);
        formData.append("type", "Carousel Maker");
        formData.append("isCampaign", isSelectSharingModalOpenValue);

        for (const i of imageFilesToAdd) {
            formData.append("images", i);
        }

        if (imageFilesToAdd.length === 0) {
            toast.error("Please add at least one post to share", {
                position: "top-center",
                description: "Please add at least one post to share",
            });
            return;
        }

        // Check if a campaign is selected, otherwise show an error


        // Make the API request to submit the form data
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
                description: isSelectSharingModalOpenValue === "0" ? "Your post has been shared to LinkedIn" : "Your post has been shared to campaign, wait for brand approval",
            });
        } catch (error) {
            console.error("Error sharing post to LinkedIn:", error);
        }
    };

    // Helper function to convert data URL to Blob
    const dataURLtoBlob = (dataUrl) => {
        const byteString = atob(dataUrl.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }
        return new Blob([arrayBuffer], { type: 'image/png' });
    };

    const [aiPrompt, setAiPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const generatePostWithAI = async () => {
        // if (!aiPrompt) return;
        setLoading(true);
        try {
            const response = await api.post("/campaigns/generate-carousel",
                { keywords: aiPrompt, posts: postsData, campaignId: selectedCampaign }
            );
            setPostsData(response.data);
        } catch (error) {
            console.error("AI Generation Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = (index) => {
        setPosts(posts.filter((_, i) => i !== index));
        setPostsData(postsData.filter((item) => item.index !== index));
    }

    const [isSelectSharingModalOpenValue, setIsSelectSharingModalOpenValue] = useState("0");
    const [isSelectSharingModalOpen, setIsSelectSharingModalOpen] = useState(true);
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

    const [schedulePostModalOpen, setSchedulePostModalOpen] = useState(false);
    const [scheduledDate, setScheduledDate] = useState(null);  // moment object
    const [scheduledDateString, setScheduledDateString] = useState("");

    const schedulePost = async () => {

        if (!scheduledDate) {
            toast.error("Please select a scheduled date.");
            return;
        }

        const imageFilesToAdd = [];

        setPostsData((prevPostsData) => {
            // set showEditingDiv to false for all posts
            return prevPostsData.map((post) => ({
                ...post,
                postData: {
                    ...post.postData,
                    showEditingDiv: false,
                },
            }));
        });

        // timeout 
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Process each post to extract images
        for (const index of posts) {
            const postElement = document.getElementById(`post-${index}`);
            if (postElement) {
                await html2canvas(postElement, { backgroundColor: null }).then((canvas) => {
                    // Convert canvas to data URL
                    const dataUrl = canvas.toDataURL("image/png");

                    // Convert data URL to Blob
                    const blob = dataURLtoBlob(dataUrl);

                    // Create a File from the Blob (using a timestamp as the filename)
                    const file = new File([blob], `image-${Date.now()}.png`, { type: "image/png" });

                    // Push the file to the imageFilesToAdd array
                    imageFilesToAdd.push(file);
                });
            }
        }

        // After all posts are processed, update the state with the new files
        setImageFile((prevFiles) => [...(prevFiles || []), ...imageFilesToAdd]);


        // Convert the selected scheduledDate (local time) to UTC using Moment.js
        const scheduledDateUtc = moment(scheduledDateString).local().utc().toISOString();  // Convert to UTC

        const formData = new FormData();
        formData.append("textContent", postContent);
        formData.append("type", "Carousel Maker");
        formData.append("scheduledDate", scheduledDateUtc);

        for (const i of imageFilesToAdd) {
            formData.append("images", i);
        }

        try {
            const response = await api.post("/campaigns/schedule-post", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Post scheduled successfully, your post will be shared at " + moment(scheduledDateUtc).format("DD/MM/YYYY HH:mm"));
            setSchedulePostModalOpen(false);
        } catch (error) {
            console.error("Schedule Post Error:", error);
            toast.error("Failed to schedule post");
        }
    };

    const schedulePostModal = () => {
        return (
            <Modal
                open={schedulePostModalOpen}
                onCancel={() => setSchedulePostModalOpen(false)}
                onOk={schedulePost}
                okText="Schedule Post"
                cancelText="Cancel"
                centered
                title={
                    <Space>
                        <ClockCircleOutlined />
                        <Title level={4} style={{ margin: 0 }}>
                            Schedule Post
                        </Title>
                    </Space>
                }
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        Select a date and time to publish your post:
                        <br />
                        <DatePicker
                            showTime
                            style={{ width: '100%', marginTop: 8 }}
                            onChange={(mainDate, date) => {
                                setScheduledDate(mainDate)
                                setScheduledDateString(date)
                            }} // set moment object
                            value={scheduledDate} // Make sure value is managed
                            format="YYYY-MM-DD HH:mm:ss" // Optional, to display in a specific format
                        />
                    </div>
                </Space>
            </Modal>
        );
    };

    return (
        <div className="w-full">
            {schedulePostModal()}
            {selectSharingModal()}
            {/* AI Content Generator */}
            <div className="w-full bg-white p-6 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-neutral-700 flex items-center gap-2">
                        <Sparkles size={18} className="text-yellow-500" />
                        Generate post content with AI
                    </p>
                </div>
                <div className="flex gap-2">
                    <Input.TextArea
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

            <div className="flex w-full min-h-[80vh]">
                {showTemplatesModal()}

                <div className="min-w-[15vw] max-w-[15vw] max-h-[80vh] border-r border-neutral-200 p-6 flex flex-col justify-between bg-white">
                    <div>
                        {/* Campaign Selection */}
                        {isSelectSharingModalOpenValue === "1" && <div className="mb-4">
                            <h3 className="font-medium mb-2">
                                Select a Campaign
                            </h3>
                            <Select className="mb-4 w-full" placeholder="Select Campaign" onChange={setSelectedCampaign}>
                                {relatedCampaigns.map((campaign) => (
                                    <Select.Option key={campaign?._id} value={campaign?._id}>
                                        {campaign?.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>}
                        <h3 className="font-medium mb-2">Template Size</h3>
                        <Select className="w-full mb-2" value={selectedSize} onChange={(value) => setSelectedSize(value)}>
                            {templateSizes.map((size) => (
                                <Select.Option key={size.value} value={size.value}>{size.label}</Select.Option>
                            ))}
                        </Select>
                        <Select className="w-full mb-2" value={selectedTemplate.name} onChange={(value) => {
                            const template = TEMPLATES.find((template) => template.name === value);
                            if (template) {
                                setSelectedTemplate(template);
                                setPostsData((prevPostsData) => {
                                    // set showEditingDiv to false for all posts
                                    return prevPostsData.map((post) => ({
                                        ...post,
                                        postData: {
                                            ...post.postData,
                                            bgColor: template.bgColor,
                                        },
                                    }));
                                });
                            }
                        }}>
                            {TEMPLATES.map((template) => (
                                <Select.Option key={template.id} value={template.name}>{template.name}</Select.Option>
                            ))}
                        </Select>

                        {/* <Button
                        className="w-full"
                        onClick={() => {
                            setShowTemplates(true);
                        }}
                    >
                        Change Carousel Template
                    </Button> */}

                        <div className="border-t border-neutral-200 my-4"></div>

                        <h3 className="font-medium mb-2">Font</h3>
                        <Select className="w-full mb-2" value={fontFamily} onChange={(value) => setFontFamily(value)}>
                            {fontFamilies.map((font, index) => (
                                <Select.Option key={index} value={font}>{font}</Select.Option>
                            ))}
                        </Select>



                        <div className="border-t border-neutral-200 my-4"></div>
                        <Button className="w-full mb-2" size="small" onClick={addPost}>Add Post</Button>
                        {isSelectSharingModalOpenValue != 1 && <Button className="w-full mb-2" size="small" onClick={() => {
                            setSchedulePostModalOpen(true);
                        }}>
                            Schedule Post
                        </Button>}
                    </div>
                    <div>
                        <Button
                            type="primary"
                            className="w-full mb-2 bg-primary-700 text-white"
                            onClick={publishToLinkedIn}
                            disabled={loading}
                        >
                            {loading ? "Publishing..." : "Publish To LinkedIn"}
                        </Button>
                    </div>
                </div>

                <motion.div key={selectedTemplate.id} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }} className="w-full bg-white relative z-2">
                    <button
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow-md"
                        onClick={scrollLeft}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow-md"
                        onClick={scrollRight}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="min-w-[100%] max-w-[79vw] flex justify-start items-center overflow-x-hidden scroll-smooth h-[100%] px-24 py-12" ref={scrollContainerRef}>
                        <div className="flex space-x-6">
                            {posts.map((index) => {
                                return (
                                    <div key={index} id={`post-${index}`} className="flex justify-center items-center text-center" >
                                        <Template_1
                                            selectedSize={selectedSize}
                                            fontFamily={fontFamily}
                                            index={index}
                                            backgroundColor={selectedTemplate.bgColor || backgroundColor}
                                            template={selectedTemplate.id}
                                            data={postsData.find((item) => item.index === index)?.postData || postsData[0].postData} // Use find() to get the first matching item
                                            setData={(e) => {
                                                const updatedPostsData = postsData.map((item) => {
                                                    if (item.index === index) {
                                                        return { ...item, postData: { ...item.postData, ...e } };
                                                    }
                                                    return item;
                                                });
                                                setPostsData(updatedPostsData);
                                            }}
                                            deleteItem={deleteItem}
                                        />

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>


            </div>
        </div>
    );
};

export default CarouselEditor;
