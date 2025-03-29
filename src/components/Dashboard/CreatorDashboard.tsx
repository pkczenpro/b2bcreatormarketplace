/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Button/Button";
import PopupDropdown from "@/components/PopupDropdown/PopupDropdown";
import { Select, Input, Spin, Card } from "antd";
import { ArrowRight, Check, MessageSquare, Pencil, Plus, Trash, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";


type CreatorDashboardProps = {
    isPreview?: boolean;
};

export default function CreatorDashboard({
    isPreview
}: CreatorDashboardProps) {
    const [userData, setUserData] = useState<any>(null);
    const getUserDetails = async () => {
        setLoading(true);
        const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "")._id : null;
        if (!userId) return;
        let res = null;
        try {
            res = await api.get(`/users/user`);
            setUserData(res.data);
        }
        catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        getUserDetails();
    }, []);

    const [showSections, setShowSections] = React.useState({
        services: false,
        partnerships: false,
        work: false,
        linkedin: false,
        testimonials: false,
        textBlock: false,
        statBlock: false,
    });

    useEffect(() => {
        setShowSections({
            services: userData?.services.length > 0,
            partnerships: userData?.previousWork.length > 0,
            work: userData?.featuredWork.length > 0,
            linkedin: false,
            testimonials: userData?.testimonials.length > 0,
            textBlock: userData?.textBlock.length > 0,
            statBlock: userData?.stats.length > 0,
        });
    }, [userData]);

    const [data, setData] = useState({});
    const handleChange = (field: string, value: string) => {
        setData({ ...data, [field]: value });
    }

    const resetAllState = () => {
        setData({});
        setTestimProfile(null);
        setTestimName("");
        setTestimPosition("");
        setTestimText("");
        setStatNumber("");
        setStatLabel("");
        setContent("");
    }

    const [loading, setLoading] = useState(false);
    const handleUserData = async (field: string, operation: string, itemId: string, data: unknown) => {
        setLoading(true);
        const userId = userData?._id;
        if (!userId) return;
        let res = null;
        let url = `/users/${userId}/${field}/${operation}`;
        if (operation !== "add") url += `/${itemId}`;
        try {
            const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
            res = await api.post(url, data, { headers });
            if (res.data.success) {
                toast.success(res.data.message, { position: "top-center" });
            }
            resetAllState();
            getUserDetails();
        } catch (err) {
            console.error("Error in handleUserData:", err.response?.data || err.message);
        } finally {
            setUploadLoading(false);
            setLoading(false);
        }
    };


    //done
    const ServicesDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <div className="flex justify-between mb-2">
                    <h2 className="uppercase mb-4">Available Services</h2>
                </div>

                {/* Service Cards */}
                {userData?.services.map((service: any, index: number) => (
                    <div key={index} className="bg-white p-6 flex flex-col rounded-md shadow-sm mb-4 relative">
                        <button
                            onClick={() => {
                                handleUserData("services", "delete", service._id, {})
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                            <Trash size={16} />
                        </button>
                        <div className="text-[16px] font-bold mb-2">
                            {service.title}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-end">
                            <p className="text-[14px] text-neutral-700 sm:w-3/4">
                                {service.description}
                            </p>
                            <span className="text-text-medium font-medium text-neutral-900 mt-4 sm:mt-0">
                                ${service.price} / {service.basis}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Add Service Modal */}
                {!isPreview && (
                    <div className="bg-white p-6 flex flex-col rounded-md shadow-sm">
                        <div className="text-[16px] font-bold mb-2">
                            <Input
                                name="title"
                                value={data.title || ""}
                                onChange={(e) => {
                                    handleChange("title", e.target.value);
                                }}
                                placeholder="Add Service Name Here"
                                className="w-full sm:w-[70%]" />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-end">
                            <div className="text-[15px] text-neutral-700 sm:w-3/4">
                                <Input
                                    placeholder="Add Service Description Here"
                                    className="w-full sm:w-[70%]"
                                    value={data.description || ""}
                                    onChange={(e) => {
                                        handleChange("description", e.target.value);
                                    }}
                                />
                            </div>
                            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                                <Input placeholder="Enter Amount" className="w-24"
                                    value={data.price || ""}
                                    onChange={(e) => {
                                        handleChange("price", e.target.value);
                                    }}
                                />
                                <span>per</span>
                                <Select
                                    placeholder="Select Basis"
                                    className="w-24"
                                    value={data.basis || ""}
                                    onChange={(value) => {
                                        handleChange("basis", value);
                                    }}
                                >
                                    <Select.Option value="hour">Hour</Select.Option>
                                    <Select.Option value="day">Day</Select.Option>
                                    <Select.Option value="week">Week</Select.Option>
                                    <Select.Option value="month">Month</Select.Option>
                                </Select>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                handleUserData("services", "add", "", data)
                            }}
                            size="small" variant="primary" className="text-sm mt-4 w-full sm:w-[30%] ml-auto" >
                            Add Service
                        </Button>
                    </div>
                )
                }
            </div >
        );
    };

    const fileInputRef = React.useRef(null);
    const fileInputRef2 = React.useRef(null);
    const [uploadLoading, setUploadLoading] = React.useState(false);
    const handleFileChange = (event, key) => {
        setUploadLoading(true);
        const file = event.target.files;
        if (file) {
            const formData = new FormData();
            formData.append("image", file[0]);
            handleUserData(key, "add", "", formData);
        }
    };
    const PartnershipsDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Previous Partnerships</h2>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {userData?.previousWork?.map((_, index) => (
                        <div key={index} className="flex items-center justify-center relative group">
                            {/* Responsive Card */}
                            <div className="bg-white w-full aspect-[4/3] rounded-md overflow-hidden relative">
                                <img loading="lazy"
                                    src={
                                        userData?.previousWork[index].image?.includes("http")
                                            ? userData?.previousWork[index].image
                                            : process.env.NEXT_PUBLIC_SERVER_URL + userData?.previousWork[index].image
                                    }
                                    alt="Previous Work"
                                    className="w-full h-full object-cover rounded-md"
                                />


                                {/* Hover Effect: Delete Icon with Black Opacity */}
                                <div className="absolute inset-0 bg-red-300 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            handleUserData("previousWork", "delete", userData?.previousWork[index]._id, {})
                                        }}
                                        className="text-white text-3xl cursor-pointer"
                                    >
                                        <Trash
                                            className="text-red-500"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Last Box with Plus Icon */}
                    {!isPreview && (
                        <div
                            className="flex items-center justify-center border border-dashed w-full aspect-[4/3] bg-transparent rounded-md cursor-pointer"
                            onClick={() => fileInputRef.current.click()} // Click trigger
                        >
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    handleFileChange(e, "previousWork");
                                    e.target.value = "";
                                }}
                                disabled={uploadLoading}
                            />
                            <span className="text-3xl text-gray-600">+</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };
    const WorkDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">
                    Feautered Work
                </h2>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {userData?.featuredWork?.map((_, index) => (
                        <div key={index} className="flex items-center justify-center relative group">
                            {/* Responsive Card */}
                            <div className="bg-white w-full aspect-[4/3] rounded-md overflow-hidden relative">
                                <img loading="lazy"
                                    src={
                                        userData?.featuredWork[index].image?.includes("http")
                                            ? userData?.featuredWork[index].image
                                            : process.env.NEXT_PUBLIC_SERVER_URL + userData?.featuredWork[index].image
                                    }
                                    alt="Previous Work"
                                    className="w-full h-full object-cover rounded-md"
                                />

                                {/* Hover Effect: Delete Icon with Black Opacity */}
                                <div className="absolute inset-0 bg-red-300 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            handleUserData("featuredWork", "delete", userData?.featuredWork[index]._id, {})
                                        }}
                                        className="text-white text-3xl cursor-pointer"
                                    >
                                        <Trash
                                            className="text-red-500"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Last Box with Plus Icon */}
                    {!isPreview && (
                        <div
                            className="flex items-center justify-center border border-dashed w-full aspect-[4/3] bg-transparent rounded-md cursor-pointer"
                            onClick={() => fileInputRef2.current.click()} // Click trigger
                        >
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef2}
                                onChange={(e) => {
                                    handleFileChange(e, "featuredWork");
                                }} // Handle file selection
                                disabled={uploadLoading}
                            />
                            <span className="text-3xl text-gray-600">+</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };
    // const LinkedInDiv = () => {
    //     return (
    //         <div className="w-full bg-neutral-50 p-6 rounded-sm">
    //             {/* Header */}
    //             <div className="flex items-center space-x-3 mb-4">
    //                 <img loading="lazy" src="/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
    //                 <h2 className="uppercase text-lg font-semibold">ANDREWS LINKEDIN</h2>
    //             </div>

    //             {/* Description */}
    //             <p className="text-gray-600 text-sm leading-relaxed">
    //                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
    //                 veniam saepe officiis fugiat quidem maxime, laudantium eligendi
    //                 pariatur ex soluta animi aut nihil commodi ipsum quisquam perferendis
    //                 aperiam. Facilis eligendi nisi ullam voluptates blanditiis sed rerum
    //                 consectetur maiores rem hic.
    //             </p>

    //             {/* Audience Interests */}
    //             <div className="w-full sm:w-1/3 mt-3">
    //                 <h1 className="text-sm font-bold text-left mb-1">Audience Interests:</h1>
    //                 {!isPreview && (
    //                     <>
    //                         <Input
    //                             value={tagText}
    //                             onChange={(e) => setTagText(e.target.value)}
    //                             onKeyPress={handleAddTag}
    //                             placeholder="Press Enter to add tags"
    //                             className="w-full"
    //                         />
    //                         <div className="flex flex-wrap gap-2 mt-2">
    //                             {tags.map((tag, index) => (
    //                                 <div
    //                                     key={index}
    //                                     className="font-bold border border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm flex items-center"
    //                                 >
    //                                     {tag}
    //                                     <span
    //                                         className="ml-2 text-red-500 cursor-pointer"
    //                                         onClick={() => setTags(tags.filter((item) => item !== tag))}
    //                                     >
    //                                         ✕
    //                                     </span>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     </>
    //                 )}
    //             </div>

    //             {/* Stats */}
    //             <div className="flex flex-wrap md:flex-nowrap sm:flex-nowrap gap-4 mt-4">
    //                 {Array(4).fill(null).map((_, index) => (
    //                     <div key={index} className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md">
    //                         <h1 className="text-lg font-semibold">1,200</h1>
    //                         <p className="text-gray-600">#Jobs Completed</p>
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>
    //     );
    // };
    const StatCard = ({ value, title, _id }: { value: number; title: string; _id: string }) => {
        return (
            <div className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md relative">
                <button
                    onClick={() => {
                        handleUserData("stats", "delete", _id, {})
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                    <Trash size={16} />
                </button>
                <h1 className="text-lg font-semibold">{value?.toLocaleString()}</h1>
                <p className="text-gray-600">{title}</p>
            </div>
        );
    };
    const TestimonialCard = ({ text, name, position, image, _id }: { text: string; name: string; position: string; image: string, _id: string }) => {
        return (
            <div className="flex flex-col bg-white shadow-sm p-4 rounded-md relative">
                <button
                    onClick={() => {
                        handleUserData("testimonials", "delete", _id, {})
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                    <Trash size={16} />
                </button>
                <p>&quot;{text}&quot;</p>
                <div className="flex items-center mt-6 ml-auto">
                    <img loading="lazy" alt={name} className="w-12 h-12 rounded-full"
                        src={image.includes("http") ? image : process.env.NEXT_PUBLIC_SERVER_URL + image}
                    />
                    <div className="flex flex-col ml-4">
                        <h1 className="font-semibold">{name}</h1>
                        <p className="text-sm text-gray-500">{position}</p>
                    </div>
                </div>
            </div>
        );
    };
    const testRef = React.useRef(null);
    const [testimProfile, setTestimProfile] = React.useState(null);
    const [testimName, setTestimName] = React.useState("");
    const [testimPosition, setTestimPosition] = React.useState("");
    const [testimText, setTestimText] = React.useState("");

    const handleTestimonial = () => {
        const formData = new FormData();
        formData.append("image", testimProfile);
        formData.append("name", testimName);
        formData.append("position", testimPosition);
        formData.append("text", testimText);

        handleUserData("testimonials", "add", "", formData);
    }

    const TestimonialsDiv = () => {
        const testimonials = userData?.testimonials || [];

        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">

                <h2 className="uppercase mb-4">Testimonials</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testimonials.map((item, index) => (
                        <TestimonialCard key={index} {...item} />
                    ))}

                    {!isPreview && <div className="flex flex-col bg-white shadow-sm p-4 rounded-md">
                        <Input.TextArea
                            placeholder="Enter Testimonial"
                            className="w-full"
                            size="small"
                            value={testimText}
                            onChange={(e) => setTestimText(e.target.value)}
                        />
                        <div className="flex items-center mt-6 ml-auto">
                            <div
                                className="rounded-full w-12 h-12 flex items-center justify-center cursor-pointer border border-dashed"
                                onClick={() => testRef.current.click()}
                            >
                                <input
                                    type="file" className="hidden"
                                    ref={testRef}
                                    onChange={(e) => {
                                        setTestimProfile(e.target.files[0]);
                                    }}
                                />
                                {testimProfile ? (
                                    <img loading="lazy"
                                        src={URL.createObjectURL(testimProfile)}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : <Plus
                                    size={24}
                                    className="text-gray-400"
                                />}
                            </div>
                            <div className="flex flex-col ml-2">
                                <Input
                                    placeholder="Enter Name"
                                    className="w-full"
                                    size="small"
                                    value={testimName}
                                    onChange={(e) => setTestimName(e.target.value)}
                                />
                                <Input
                                    placeholder="Enter Position"
                                    className="w-full"
                                    size="small"
                                    value={testimPosition}
                                    onChange={(e) => setTestimPosition(e.target.value)}
                                />
                            </div>
                        </div>
                        <div
                            className="max-w-[150px] ml-auto mt-4"
                        >
                            <Button
                                size="xs"
                                onClick={handleTestimonial}
                                className="bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900">
                                Add Testimonial
                            </Button>
                        </div>
                    </div>}
                </div>
            </div>
        );
    };

    const [statNumber, setStatNumber] = useState("");
    const [statLabel, setStatLabel] = useState("");

    const handleState = () => {
        handleUserData("stats", "add", "", {
            value: statNumber,
            title: statLabel
        });

        setStatNumber("");
        setStatLabel("");
    }

    const StatBlockDiv = () => {
        const stats = userData?.stats || [];

        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Statistics</h2>
                <div className="flex gap-4 mt-4">
                    {stats?.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}

                    {!isPreview && <div className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md">
                        <Input
                            placeholder="Enter Number"
                            className="w-full"
                            size="small"
                            value={statNumber}
                            onChange={(e) => setStatNumber(e.target.value)}
                        />
                        <Input
                            placeholder="Enter Label"
                            className="w-full"
                            size="small"
                            value={statLabel}
                            onChange={(e) => setStatLabel(e.target.value)}
                        />
                        <div
                            className="max-w-[150px] ml-auto mt-4"
                        >
                            <Button
                                size="xs"
                                onClick={handleState}
                                className="bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900">
                                Add Stat
                            </Button>
                        </div>
                    </div>}
                </div>
            </div>
        );
    };

    const [content, setContent] = useState("");
    const [eye, setEye] = useState(false);
    const TextBlockDiv = () => {

        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <div className="flex justify-between">
                    <h2 className="uppercase mb-4">About Me</h2>
                    <button
                        onClick={() => {
                            setEye(!eye)
                            setContent(userData?.textBlock[0]?.description)
                        }}
                        className="text-gray-600 text-sm"
                    >
                        {eye ? "Preview" : "Edit"}
                    </button>
                </div>
                {
                    (isPreview || !eye) ? <p className="text-gray-600 text-sm">
                        {userData?.textBlock[0]?.description}
                    </p> :
                        <>
                            <Input.TextArea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="text-gray-600 text-sm"
                                autoSize={{ minRows: 4, maxRows: 10 }}
                            />
                            <div className="max-w-[200px] ml-auto">
                                <Button
                                    size="small"
                                    variant="primary"
                                    className="text-sm mt-2"
                                    onClick={() => {
                                        if (userData?.textBlock.length === 0) {
                                            handleUserData("textBlock", "add", '', { description: content })
                                            setEye(!eye)
                                        } else {
                                            handleUserData("textBlock", "update", userData?.textBlock[0]?._id, { description: content })
                                            setEye(!eye)
                                        }
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </>
                }
            </div>
        );
    };

    const userFileInputRef = useRef(null);
    const userFileInputRef2 = useRef(null);

    const handleUserFilesChange = (event, field) => {
        const file = event.target.files[0];
        if (file) {
            updateUserImages(field, file);
        }
        event.target.value = null;
    };

    const updateUserImages = async (field: string, image: any) => {
        const formData = new FormData();
        formData.append(field, image);
        try {
            const res = await api.put(`/users/user-update`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.success) {
                toast.success(res.data.message, { position: "top-center" });
                getUserDetails();
            }
        } catch (err) {
            console.error("Error in updateUserImages:", err.response?.data || err.message);
        }
    }


    return (
        <div className="flex flex-col items-center justify-start h-full p-8 md:p-16 sm:p-16 w-full">
            <div className="flex flex-col bg-white rounded-md shadow-sm p-4 sm:p-8 w-full relative">
                <LoadingOverlay
                    loading={loading}
                />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="relative">
                        <div className="relative w-full h-48 sm:h-72 group">
                            {/* Cover Image */}
                            <img
                                loading="lazy"
                                src={
                                    userData?.coverImage?.includes("http")
                                        ? userData?.coverImage
                                        : process.env.NEXT_PUBLIC_SERVER_URL + userData?.coverImage
                                }
                                alt="Cover"
                                className="w-full h-full object-cover rounded-md"
                            />

                            {/* Hover Overlay */}
                            <div
                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-md"
                                onClick={() => userFileInputRef2.current.click()}
                            >
                                <Upload size={32} className="text-white" />
                            </div>

                            <input
                                type="file"
                                className="hidden"
                                ref={userFileInputRef2}
                                onChange={(event) => handleUserFilesChange(event, "coverImage")}
                            />

                        </div>

                        {/* Profile Section */}
                        <div className="flex items-end justify-between w-[100%] mt-4 absolute bottom-[-80px] pl-12">
                            {/* Profile Picture and Info */}
                            <div className="flex items-end space-x-4">
                                <div className="relative group w-24 sm:w-48 rounded-sm overflow-hidden">
                                    {/* Profile Image */}
                                    <img
                                        loading="lazy"
                                        src={
                                            userData?.profileImage?.includes("http")
                                                ? userData?.profileImage
                                                : process.env.NEXT_PUBLIC_SERVER_URL + userData?.profileImage
                                        }
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Hover Overlay */}
                                    <div
                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                        onClick={() => userFileInputRef.current.click()}
                                    >
                                        <Upload size={32} className="text-white" />
                                    </div>

                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={userFileInputRef}
                                        onChange={(event) => handleUserFilesChange(event, "profileImage")}
                                    />
                                </div>

                                {/* Name and Socials */}
                                <div className="flex flex-col">
                                    <EditableHeading
                                        className={"text-2xl font-semibold"}
                                        initialName={userData?.name} onChange={(e) => {
                                            updateUserImages("name", e);
                                        }}
                                    />
                                    <div className="flex space-x-3 mt-1 text-gray-500">
                                        {
                                            userData?.socialMediaLinks.filter((item) => item.link).length > 0 ? userData?.socialMediaLinks.filter((item) => item.link).map((link: any, index: number) => (
                                                <a key={index} href={link.link} target="_blank" rel="noreferrer">
                                                    <img loading="lazy"
                                                        src={`/icons/${link.platform}.svg`}
                                                        alt={link.platform}
                                                        className="w-6 h-6"
                                                    />
                                                </a>
                                            )) : <span className="text-gray-500">Add social media links</span>
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Chat Button */}
                            <Link href="/dashboard/inbox">
                                <Button
                                    size="small"
                                    variant="primary"
                                    className="text-sm flex px-3 py-1 items-center max-w-[150px]"
                                >
                                    <MessageSquare size={16} className="mr-2" />
                                    Have a Chat
                                </Button>
                            </Link>
                        </div>

                    </div>



                    {/* Bio */}
                    <div className="mt-24 text-gray-600 text-sm">
                        <EditableHeading
                            initialName={userData?.bio || "Add a bio here"}
                            onChange={(e) => {
                                updateUserImages("bio", e);
                            }}
                        />
                    </div>

                    {/* Tags */}
                    <div className="mt-4 flex space-x-2">
                        <EditableTagsAdder
                            tags={
                                typeof userData?.tags === "string"
                                    ? userData?.tags.split(",")
                                    : [] // If it's not a string, fall back to an empty array
                            }
                            setTags={(tags) => {
                                updateUserImages("tags", tags);
                            }}
                        />
                    </div>


                    {!isPreview && <div className="mt-8">
                        <PopupDropdown
                            showSections={showSections}
                            setShowSections={setShowSections}
                        />
                    </div>}

                    {/* Sections */}
                    <div className="mt-12 space-y-6">
                        {showSections.services && ServicesDiv()}
                        {showSections.partnerships && PartnershipsDiv()}
                        {showSections.work && WorkDiv()}
                        {/* {showSections.linkedin && LinkedInDiv()} */}
                        {showSections.testimonials && TestimonialsDiv()}
                        {showSections.textBlock && TextBlockDiv()}
                        {showSections.statBlock && StatBlockDiv()}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// types 

type EditableHeadingProps = {
    initialName: string;
    onChange: (name: string) => void;
    className: string;
};

const EditableHeading = ({ initialName, onChange, className }: EditableHeadingProps) => {
    const [name, setName] = useState(initialName);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    const handleBlur = (e) => {
        setName(e.target.innerText);
    };

    const handleChange = () => {
        if (name === initialName) return;
        onChange(name);
    }

    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <h2
                    className={`${className} border-b border-gray-400 focus:outline-none`}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                >
                    {name}
                </h2>
            ) : (
                <h2 className={className}>{name}</h2>
            )}

            <button
                onClick={() => {
                    if (isEditing) handleChange();
                    setIsEditing(!isEditing);
                }}
                className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 transition"
            >
                {isEditing ? <Check size={10} /> : <Pencil size={10} />}
            </button>
        </div>
    );
};

const EditableTagsAdder = ({ tags, setTags }: { tags: string[]; setTags: (tags: string[]) => void }) => {
    const [tagText, setTagText] = useState("");

    const handleAddTag = (e) => {
        if (e.key === "Enter" && tagText) {
            setTags([...tags, tagText]);
            setTagText("");
        }
    }

    return (
        <div className="w-full sm:w-1/3 mt-3">
            <h1 className="text-sm font-bold text-left mb-1">Audience Interests:</h1>
            <Input
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
                onKeyPress={handleAddTag}
                placeholder="Press Enter to add tags"
                className="w-full"
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {tags?.map((tag, index) => (
                    <div
                        key={index}
                        className="font-bold border border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm flex items-center"
                    >
                        {tag}
                        <span
                            className="ml-2 text-red-500 cursor-pointer"
                            onClick={() => setTags(tags?.filter((item) => item !== tag))}
                        >
                            ✕
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}