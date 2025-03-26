import { Button, Modal, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import Template_1 from "./TEMPLATES/Template_1";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";

const TEMPLATES = [
    { id: 1, name: "Template 1", size: "288x360", component: Template_1, bgColor: "#000" },
    { id: 2, name: "Template 2", size: "288x360", component: null, bgColor: "#7CA3C2" },
    { id: 3, name: "Template 3", size: "288x360", component: null, bgColor: "#BF8A5B" },
    { id: 4, name: "Template 4", size: "288x360", component: null, bgColor: "#814EB3" },
];

const CarouselEditor = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [posts, setPosts] = useState([0]);
    const [backgroundColor, setBackgroundColor] = useState("#1677ff");

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

    const [selectedSize, setSelectedSize] = useState("288x360");

    const addPost = () => {
        setPosts([...posts, posts.length]);
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
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const publishToLinkedIn = async () => {
        const imageFilesToAdd = [];

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


        // Log the file objects to verify
        console.log("Image Files (as File objects):", imageFilesToAdd);

        // Create the form data for the API request
        const formData = new FormData();
        formData.append("content", postContent);
        formData.append("type", "Carousel Maker");

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
        if (!selectedCampaign) {
            toast.error("Please select a campaign to share this post", {
                position: "top-center",
                description: "Please select a campaign to share this post",
            });
            return;
        }

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
                description: "Your post has been shared to LinkedIn",
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



    return (
        <div className="flex w-full min-h-[80vh]">
            {showTemplatesModal()}
            <div className="min-w-[15vw] max-w-[15vw] max-h-[80vh] border-r border-neutral-200 p-6 flex flex-col justify-between bg-white">
                <div>
                    {/* Campaign Selection */}
                    <h3 className="font-medium mb-2">
                        Select a Campaign
                    </h3>
                    <Select className="mb-4 w-full" placeholder="Select Campaign" onChange={setSelectedCampaign}>
                        {relatedCampaigns.map((campaign) => (
                            <Select.Option key={campaign._id} value={campaign._id}>
                                {campaign.title}
                            </Select.Option>
                        ))}
                    </Select>
                    <h3 className="font-medium mb-2">Template Size</h3>
                    <Select className="w-full mb-2" value={selectedSize} onChange={(value) => setSelectedSize(value)}>
                        {templateSizes.map((size) => (
                            <Select.Option key={size.value} value={size.value}>{size.label}</Select.Option>
                        ))}
                    </Select>
                    <Select className="w-full mb-2" value={selectedTemplate.name} onChange={(value) => setSelectedTemplate(TEMPLATES.find((t) => t.name === value) || selectedTemplate)}>
                        {TEMPLATES.map((template) => (
                            <Select.Option key={template.id} value={template.name}>{template.name}</Select.Option>
                        ))}
                    </Select>

                    <Button
                        className="w-full"
                        onClick={() => {
                            setShowTemplates(true);
                        }}
                    >
                        Change Carousel Template
                    </Button>

                    <div className="border-t border-neutral-200 my-4"></div>

                    <h3 className="font-medium mb-2">Font</h3>
                    <Select className="w-full mb-2" value={fontFamily} onChange={(value) => setFontFamily(value)}>
                        {fontFamilies.map((font, index) => (
                            <Select.Option key={index} value={font}>{font}</Select.Option>
                        ))}
                    </Select>



                    <div className="border-t border-neutral-200 my-4"></div>
                    <Button className="w-full mb-2" size="small" onClick={addPost}>Add Post</Button>
                </div>


                <div>
                    <Button
                        type="primary"
                        className="w-full mb-2 bg-primary-700 text-white"
                        onClick={publishToLinkedIn}
                    >
                        Publish To LinkedIn
                    </Button>
                    {/* <Button className="w-full flex items-center">
                        <Clock
                            size={16}
                        />   Schedule Post
                    </Button> */}
                </div>
            </div>

            <motion.div key={selectedTemplate.id} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }} className="w-full bg-white relative z-2">
                {/* <CanvasBackground /> */}
                {/* Scroll Buttons */}
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
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div >


        </div >
    );
};

export default CarouselEditor;
