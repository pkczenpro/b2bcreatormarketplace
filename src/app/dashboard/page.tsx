/* eslint-disable @next/next/no-img-element */
'use client';

import Button from "@/components/Button/Button";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import Input from "@/components/Input/Input";
import { Select } from "antd";
import { BriefcaseBusiness, MessageSquare, Plus, Menu, Handshake, Linkedin, MessageSquareText, TextQuote, ChartLine } from "lucide-react";

import React from "react";

type DashboardProps = object;

export default function Dashboard({ }: DashboardProps) {
    const [openDropdown, setOpenDropdown] = React.useState(false);

    const dropdownItems = [
        { name: "Available Services", icon: <Menu size={16} className="mr-2" />, underline: false, key: "services" },
        { name: "Previous Partnerships", icon: <Handshake size={16} className="mr-2" />, underline: false, key: "partnerships" },
        { name: "Featured Work", icon: <BriefcaseBusiness size={16} className="mr-2" />, underline: true, key: "work" },
        { name: "Your LinkedIn", icon: <Linkedin size={16} className="mr-2" />, underline: false, key: "linkedin" },
        { name: "Testimonials", icon: <MessageSquareText size={16} className="mr-2" />, underline: true, key: "testimonials" },
        { name: "Text Block", icon: <TextQuote size={16} className="mr-2" />, underline: false, key: "textBlock" },
        { name: "Stat Block", icon: <ChartLine size={16} className="mr-2" />, underline: true, key: "statBlock" },
    ];
    const [showSections, setShowSections] = React.useState({
        services: true,
        partnerships: true,
        work: true,
        linkedin: true,
        testimonials: true,
        textBlock: true,
        statBlock: true,
    });

    const ServicesDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">
                    Available Services
                </h2>

                {/* CARD ITEM */}
                <div className="bg-white p-6 flex flex-col rounded-md shadow-sm mb-4">
                    <div className="text-[16px] font-bold mb-2">
                        Service Name #1
                    </div>
                    <div className="flex justify-between items-end">
                        <p className="text-[14px] text-neutral-700 w-3/4">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, quae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat, odio dignissimos officia molestias placeat dolor doloremque libero quasi quis temporibus, magni exercitationem facere culpa qui?
                        </p>
                        <span className="text-text-large font-medium text-neutral-900">
                            $18/hour
                        </span>
                    </div>
                </div>
                {/* CARD ITEM CLOSE */}
                <div className="bg-white p-6 flex flex-col rounded-md shadow-sm mb-4">
                    <div className="text-[16px] font-bold mb-2">
                        Service Name #1
                    </div>
                    <div className="flex justify-between items-end">
                        <p className="text-[14px] text-neutral-700 w-3/4">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, quae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat, odio dignissimos officia molestias placeat dolor doloremque libero quasi quis temporibus, magni exercitationem facere culpa qui?
                        </p>
                        <span className="text-text-large font-medium text-neutral-900">
                            $18/hour
                        </span>
                    </div>
                </div>

                {/* ADD MODAL */}
                <div className="bg-white p-6 flex flex-col rounded-md shadow-sm">
                    <div className="text-[16px] font-bold mb-2">
                        <Input placeholder="Add Service Name Here" className="w-[70%]" />
                    </div>
                    <div className="flex justify-between items-end">
                        <p className="text-[15px] text-neutral-700 w-3/4">
                            <Input
                                placeholder="Add Service Description Here"
                                className="w-[70%]"
                            />
                        </p>
                        <div className="flex items-center space-x-2">
                            <div>
                                <Input placeholder="Enter Amount" className="w-24" />
                            </div>
                            <span>per</span>
                            <div>
                                <Select
                                    placeholder="Select Basis"
                                >
                                    <Select.Option value="hour">Hour</Select.Option>
                                    <Select.Option value="day">Day</Select.Option>
                                    <Select.Option value="week">Week</Select.Option>
                                    <Select.Option value="month">Month</Select.Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <Button
                        size="small"
                        variant="primary"
                        className="text-sm mt-4 w-[30%] ml-auto"
                    >
                        Add Service
                    </Button>
                </div>
            </div>
        );
    }
    const PartnershipsDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Previous Partnerships</h2>
                {/* CARD ITEM */}
                <div className="flex flex-row mb-4 space-x-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                            {/* White BOX */}
                            <div className="bg-white w-52 h-36 rounded-md"></div>
                            {/* White BOX CLOSE */}
                        </div>
                    ))}
                    {/* Last Box with Plus Icon */}
                    <div className="flex items-center border border-dashed justify-center w-[18%] h-36 bg-transparent rounded-md cursor-pointer">
                        <span className="text-3xl text-gray-600">+</span>
                    </div>
                </div>
            </div>
        );
    };


    const WorkDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Featured Work</h2>
                {/* CARD ITEM */}
                <div className="flex flex-row mb-4 space-x-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                            {/* White BOX */}
                            <div className="bg-white w-52 h-36 rounded-md"></div>
                            {/* White BOX CLOSE */}
                        </div>
                    ))}
                    {/* Last Box with Plus Icon */}
                    <div className="flex items-center border border-dashed justify-center w-[18%] h-36 bg-transparent rounded-md cursor-pointer">
                        <span className="text-3xl text-gray-600">+</span>
                    </div>
                </div>
            </div>
        );
    }

    const LinkedInDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Your LinkedIn</h2>
                {/* CARD ITEM */}
                <div className="flex flex-row mb-4 space-x-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                            {/* White BOX */}
                            <div className="bg-white w-52 h-36 rounded-md"></div>
                            {/* White BOX CLOSE */}
                        </div>
                    ))}
                    {/* Last Box with Plus Icon */}
                    <div className="flex items-center border border-dashed justify-center w-[18%] h-36 bg-transparent rounded-md cursor-pointer">
                        <span className="text-3xl text-gray-600">+</span>
                    </div>
                </div>
            </div>
        );
    }

    const TestimonialsDiv = () => {
        return (
            <div className="flex flex-col w-full">
                <h1 className="text-lg font-semibold">Testimonials</h1>
                <div className="bg-neutral-100 w-full h-[1px] my-4">
                    omar
                </div>
            </div>
        );
    }

    const TextBlockDiv = () => {
        return (
            <div className="flex flex-col w-full">
                <h1 className="text-lg font-semibold">Text Block</h1>
                <div className="bg-neutral-100 w-full h-[1px] my-4">
                    omar
                </div>
            </div>
        );
    }

    const StatBlockDiv = () => {
        return (
            <div className="flex flex-col w-full">
                <h1 className="text-lg font-semibold">Stat Block</h1>
                <div className="bg-neutral-100 w-full h-[1px] my-4">
                    omar
                </div>
            </div>
        );
    }



    return (
        <div className="flex">
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50">
                {/* Content */}
                <div className="flex flex-col items-center justify-start h-full py-12">
                    <div className="flex flex-col w-[90%] px-8 py-8 bg-white rounded-md shadow-sm">
                        <div>
                            <div className="relative">

                                {/* Cover Image */}
                                <div className="relative w-full h-60">
                                    <img
                                        src="/images/wallpaper.png"
                                        alt="Cover"
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>

                                {/* Profile Section */}
                                <div className="flex items-end justify-between w-[100%] mt-4 absolute bottom-[-70px] pl-12">

                                    {/* Profile Picture and Info */}
                                    <div className="flex items-end space-x-4">
                                        <div className="rounded-sm overflow-hidden">
                                            <img
                                                src="/images/profile_2.png"
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Name and Socials */}
                                        <div className="flex flex-col">
                                            <h2 className="text-2xl font-semibold">Andrew Bishop</h2>
                                            <div className="flex space-x-3 mt-1 text-gray-500">
                                                <a href="#" className="hover:text-gray-700">🔗</a>
                                                <a href="#" className="hover:text-gray-700">🎙</a>
                                                <a href="#" className="hover:text-gray-700">🌎</a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat Button */}
                                    <Button
                                        size="small"
                                        variant="primary"
                                        className="text-sm flex px-3 py-1 items-center max-w-[150px]"
                                    >
                                        <MessageSquare size={16} className="mr-2" />
                                        Have a Chat
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="mt-24 text-gray-600 text-sm">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates veniam saepe officiis fugiat quidem maxime, laudantium eligendi pariatur ex soluta animi aut nihil commodi ipsum quisquam perferendis aperiam. Facilis eligendi nisi ullam voluptates blanditiis sed rerum consectetur maiores rem hic, soluta quisquam, facere numquam aliquam repellat doloremque delectus? Cum fugit voluptatibus quod, animi repellat amet obcaecati beatae excepturi corrupti esse vel neque quis, magni, odit distinctio? Ducimus perspiciatis molestias quam id rerum, placeat exercitationem assumenda, distinctio, hic illo laborum. Impedit totam odit rem at esse magnam saepe velit, aperiam molestias quas natus delectus et itaque, labore ipsum ad aspernatur. Facere! </p>

                        {/* Tags */}
                        <div className="mt-4 flex space-x-2">
                            <span className="font-bold inline-block border-[1px] border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm">
                                #Marketing
                            </span>
                            <span className="font-bold inline-block border-[1px] border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm">
                                #Design
                            </span>
                            <span className="font-bold inline-block border-[1px] border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm">
                                #Tech
                            </span>
                        </div>

                        {/* Sections */}
                        <div className="mt-12 space-y-6">
                            {showSections.services && <ServicesDiv />}
                            {showSections.partnerships && <PartnershipsDiv />}
                            {showSections.work && <WorkDiv />}
                            {showSections.linkedin && <LinkedInDiv />}
                            {showSections.testimonials && <TestimonialsDiv />}
                            {showSections.textBlock && <TextBlockDiv />}
                            {showSections.statBlock && <StatBlockDiv />}
                        </div>

                        {/* Add a section */}
                        <div className="relative">
                            <div
                                className="flex items-center space-x-2 cursor-pointer mt-12"
                                onMouseOver={() => setOpenDropdown(true)}
                                onMouseLeave={() => setOpenDropdown(false)}
                            >
                                <Plus size={16} className="text-primary-700" />
                                <p className="text-primary-700 font-medium">Add more</p>
                            </div>

                            {openDropdown && (
                                <div
                                    onMouseOver={() => setOpenDropdown(true)}
                                    onMouseLeave={() => setOpenDropdown(false)}
                                    className="absolute ml-24 bg-white rounded-lg shadow-md px-6 py-4 z-1000">
                                    {dropdownItems.map((item, index) => (
                                        <div
                                            onClick={() => setShowSections({ ...showSections, [item.key]: true })}
                                            key={index} className="text-neutral-900 flex items-center cursor-pointer py-1">
                                            {item.icon}
                                            <p className="font-medium text-neutral-900">{item.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
}

