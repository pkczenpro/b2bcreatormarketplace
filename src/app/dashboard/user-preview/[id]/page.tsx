/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Button/Button";
import { MessageSquare } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import { useParams } from "next/navigation";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import CustomImage from "@/components/CustomImage";
import { Modal, Tooltip } from "antd";

export default function CreatorDashboard() {
    const [userData, setUserData] = useState<any>(null);
    const [showSections, setShowSections] = React.useState({
        services: false,
        partnerships: false,
        work: false,
        linkedin: false,
        testimonials: false,
        textBlock: false,
        statBlock: false,
    });

    const params = useParams();
    const getUserDetails = async () => {
        const userId = params.id;
        if (!userId) return;
        let res = null;
        try {
            res = await api.get(`/users/creator/${userId}`);
            setUserData(res.data);

            setShowSections({
                services: res.data.services.length > 0,
                partnerships: res.data.previousWork.length > 0,
                work: res.data.featuredWork.length > 0,
                // linkedin: res.data.socialMediaLinks.length > 0,
                testimonials: res.data.testimonials.length > 0,
                textBlock: res.data.textBlock.length > 0,
                statBlock: res.data.stats.length > 0,
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    React.useEffect(() => {
        getUserDetails();
    }, []);

    const [showImageInPopup, setShowImageInPopup] = useState(false);
    const [image, setImage] = useState("");
    const showImageInPopupModal = () => {
        return (
            <Modal
                centered
                open={showImageInPopup}
                onCancel={() => setShowImageInPopup(false)}
                footer={null}
            >
                <img src={image} alt="Image" className="w-full h-full object-contain" />
            </Modal>
        )
    }

    if (!userData) return <div>Loading...</div>;
    if (userData.userType !== "creator") return <div>404</div>;




    //done
    const ServicesDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <div className="flex justify-between mb-2">
                    <h2 className="uppercase mb-4">Available Services</h2>
                </div>

                {/* Service Cards */}
                {userData?.services.map((service: any, index: number) => (
                    <div key={index} className="bg-white p-6 flex flex-col rounded-md shadow-sm mb-4">
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
            </div >
        );
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
                                    onClick={() => {
                                        setImage(userData?.previousWork[index].image)
                                        setShowImageInPopup(true)
                                    }}
                                />

                            </div>
                        </div>
                    ))}
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
                                    onClick={() => {
                                        setImage(userData?.featuredWork[index].image)
                                        setShowImageInPopup(true)
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    const LinkedInDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-4">
                    <img loading="lazy" src="/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
                    <h2 className="uppercase text-lg font-semibold">ANDREWS LINKEDIN</h2>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
                    veniam saepe officiis fugiat quidem maxime, laudantium eligendi
                    pariatur ex soluta animi aut nihil commodi ipsum quisquam perferendis
                    aperiam. Facilis eligendi nisi ullam voluptates blanditiis sed rerum
                    consectetur maiores rem hic.
                </p>

                {/* Audience Interests */}
                <div className="w-full sm:w-1/3 mt-3">
                    <h1 className="text-sm font-bold text-left mb-1">Audience Interests:</h1>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap md:flex-nowrap sm:flex-nowrap gap-4 mt-4">
                    {Array(4).fill(null).map((_, index) => (
                        <div key={index} className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md">
                            <h1 className="text-lg font-semibold">1,200</h1>
                            <p className="text-gray-600">#Jobs Completed</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    const StatCard = ({ value, title, _id }: { value: number; title: string; _id: string }) => {
        return (
            <div className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md relative">
                <h1 className="text-lg font-semibold">{value?.toLocaleString()}</h1>
                <p className="text-gray-600">{title}</p>
            </div>
        );
    };
    const TestimonialCard = ({ text, name, position, image, _id }: { text: string; name: string; position: string; image: string, _id: string }) => {
        return (
            <div className="flex flex-col bg-white shadow-sm p-4 rounded-md relative">
                <p>&quot;{text}&quot;</p>
                <div className="flex items-center mt-6 ml-auto">
                    <CustomImage loading="lazy" alt={name} className="w-12 h-12 rounded-full"
                        src={
                            image?.includes("http")
                                ? image
                                : process.env.NEXT_PUBLIC_SERVER_URL + image
                        }

                    />
                    <div className="flex flex-col ml-4">
                        <h1 className="font-semibold">{name}</h1>
                        <p className="text-sm text-gray-500">{position}</p>
                    </div>
                </div>
            </div>
        );
    };
    const TestimonialsDiv = () => {
        const testimonials = userData?.testimonials || [];

        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Testimonials</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testimonials.map((item, index) => (
                        <TestimonialCard key={index} {...item} />
                    ))}
                </div>
            </div>
        );
    };
    const StatBlockDiv = () => {
        const stats = userData?.stats || [];

        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Statistics</h2>
                <div className="flex gap-4 mt-4">
                    {stats?.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
            </div>
        );
    };
    const TextBlockDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <div className="flex justify-between">
                    <h2 className="uppercase mb-4">About Me</h2>
                </div>
                <p className="text-gray-600 text-sm">
                    {userData?.textBlock[0]?.description}
                </p>
            </div>
        );
    };




    return (
        <div className="flex flex-col sm:flex-row">
            {showImageInPopupModal()}
            <LeftMenu />
            <div className="flex flex-col items-center justify-start w-full h-full p-8 md:p-16 sm:p-16 min-h-screen bg-neutral-50 overflow-y-auto max-h-screen max-w-[1500px]">
                <div className="flex flex-col bg-white rounded-md shadow-sm p-4 sm:p-8 w-full">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div>
                            <div className="relative">
                                {/* Cover Image */}
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
                                        className="w-full h-full object-contain rounded-md"
                                    />
                                </div>

                                {/* Profile Section */}
                                <div className="flex items-end justify-between w-[100%] mt-4 absolute bottom-[-80px] pl-12">
                                    {/* Profile Picture and Info */}
                                    <div className="flex items-end space-x-4">
                                        <div className="relative group w-24 sm:w-48 rounded-sm overflow-hidden">
                                            {/* Profile Image */}
                                            <CustomImage
                                                loading="lazy"
                                                src={
                                                    userData?.profileImage?.includes("http")
                                                        ? userData?.profileImage
                                                        : process.env.NEXT_PUBLIC_SERVER_URL + userData?.profileImage
                                                }
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Name and Socials */}
                                        <div className="flex flex-col">
                                            <h2 className="text-2xl font-semibold mb-1">
                                                {userData?.name || "Creator Name"}
                                            </h2>
                                            <div className="flex space-x-3 mt-1 text-gray-500">
                                                {
                                                    userData?.socialMediaLinks.filter((item) => item.link).map((link: any, index: number) => (
                                                        <a key={index} href={link.link} target="_blank" rel="noreferrer">
                                                            <Tooltip
                                                                title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                                                                placement="top"
                                                                color="#000000"
                                                                overlayInnerStyle={{ color: "#ffffff" }}
                                                            >
                                                                <img loading="lazy"
                                                                    src={`/icons/${link.platform}.svg`}
                                                                    alt={link.platform}
                                                                    className="w-6 h-6"
                                                                />
                                                            </Tooltip>
                                                        </a>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat Button */}
                                    <Link href={`/dashboard/inbox?user=${userData?._id}`}>
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
                        </div>

                        {/* Bio */}
                        <p className="mt-24 text-gray-600 text-sm">
                            {userData?.bio}
                        </p>

                        {/* Tags */}
                        <div className="mt-4 flex space-x-2">
                            {userData?.tags.filter((item) => item).map((tag: string, index: number) => (
                                <span key={index} className="font-bold inline-block border-[1px] border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Sections */}
                        <div className="mt-12 space-y-6">
                            {showSections.services && ServicesDiv()}
                            {showSections.partnerships && PartnershipsDiv()}
                            {showSections.work && WorkDiv()}
                            {showSections.linkedin && LinkedInDiv()}
                            {showSections.testimonials && TestimonialsDiv()}
                            {showSections.textBlock && TextBlockDiv()}
                            {showSections.statBlock && StatBlockDiv()}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
