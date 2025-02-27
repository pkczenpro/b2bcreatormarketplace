/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import PopupDropdown from "@/components/PopupDropdown/PopupDropdown";
import { Select } from "antd";
import { MessageSquare, Plus } from "lucide-react";

import React, { useState } from "react";

import { motion } from "framer-motion";

type CreatorDashboardProps = object;

export default function CreatorDashboard({ }: CreatorDashboardProps) {
    const [showSections, setShowSections] = React.useState({
        services: true,
        partnerships: true,
        work: true,
        linkedin: true,
        testimonials: true,
        textBlock: true,
        statBlock: true,
    });

    const [tags, setTags] = useState<string[]>([]);
    const [tagText, setTagText] = useState("");

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
            setTags([...tags, e.currentTarget.value.trim()]);
            setTagText("");
        }
    };

    const ServicesDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Available Services</h2>

                {/* CARD ITEM */}
                <div className="bg-white p-6 flex flex-col rounded-md shadow-sm mb-4">
                    <div className="text-[16px] font-bold mb-2">Service Name #1</div>
                    <div className="flex flex-col sm:flex-row justify-between items-end">
                        <p className="text-[14px] text-neutral-700 sm:w-3/4">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione,
                            quae. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Repellat, odio dignissimos officia molestias placeat dolor
                            doloremque libero quasi quis temporibus, magni exercitationem
                            facere culpa qui?
                        </p>
                        <span className="text-text-large font-medium text-neutral-900 mt-4 sm:mt-0">
                            $18/hour
                        </span>
                    </div>
                </div>
                {/* CARD ITEM CLOSE */}

                {/* ADD MODAL */}
                <div className="bg-white p-6 flex flex-col rounded-md shadow-sm">
                    <div className="text-[16px] font-bold mb-2">
                        <Input
                            placeholder="Add Service Name Here"
                            className="w-full sm:w-[70%]"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-end">
                        <div className="text-[15px] text-neutral-700 sm:w-3/4">
                            <Input
                                placeholder="Add Service Description Here"
                                className="w-full sm:w-[70%]"
                            />
                        </div>
                        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                            <div>
                                <Input placeholder="Enter Amount" className="w-24" />
                            </div>
                            <span>per</span>
                            <div>
                                <Select placeholder="Select Basis">
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
                        className="text-sm mt-4 w-full sm:w-[30%] ml-auto"
                    >
                        Add Service
                    </Button>
                </div>
            </div>
        );
    };

    const PartnershipsDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Previous Partnerships</h2>
                {/* CARD ITEM */}
                <div className="flex flex-wrap justify-start gap-4 mb-4">
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
                <div className="flex flex-wrap justify-start gap-4 mb-4">
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

    const LinkedInDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <img src="/icons/linkedin.svg" alt="LinkedIn" />
                    <h2 className="uppercase">ANDREWS LINKEDIN</h2>
                </div>
                {/* CARD ITEM */}
                <p className="text-gray-600 text-sm">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates
                    veniam saepe officiis fugiat quidem maxime, laudantium eligendi
                    pariatur ex soluta animi aut nihil commodi ipsum quisquam perferendis
                    aperiam. Facilis eligendi nisi ullam voluptates blanditiis sed rerum
                    consectetur maiores rem hic, soluta quisquam, facere numquam aliquam
                    repellat doloremque delectus? Cum fugit voluptatibus quod, animi
                    repellat amet obcaecati beatae excepturi corrupti esse vel neque quis,
                    magni, odit distinctio? Ducimus perspiciatis molestias quam id rerum,
                    placeat exercitationem assumenda, distinctio, hic illo laborum.
                    Impedit totam odit rem at esse magnam saepe velit, aperiam molestias
                    quas natus delectus et itaque, labore ipsum ad aspernatur. Facere!
                </p>

                <div className="w-full sm:w-1/3 mt-3">
                    <h1 className="text-sm font-bold text-left mb-1">
                        Audience Interests:
                    </h1>
                    <Input
                        value={tagText}
                        onChange={(e) => setTagText(e.target.value)}
                        onKeyPress={handleAddTag}
                        placeholder="Press Enter to add tags"
                        className="w-full"
                    />

                    <div className="mt-2">
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="font-bold inline-block border-[1px] border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm mr-2 mb-2"
                            >
                                {tag}{" "}
                                <span
                                    className="ml-2 cursor-pointer"
                                    onClick={() => setTags(tags.filter((item) => item !== tag))}
                                >
                                    x
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* STATS */}
                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md">
                        <h1 className="text-lg font-semibold">1,200</h1>
                        <p className="text-gray-600">#Jobs Completed</p>
                    </div>
                    <div className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md">
                        <h1 className="text-lg font-semibold">1,200</h1>
                        <p className="text-gray-600">#Jobs Completed</p>
                    </div>
                    <div className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md">
                        <h1 className="text-lg font-semibold">1,200</h1>
                        <p className="text-gray-600">#Jobs Completed</p>
                    </div>
                    <div className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md">
                        <h1 className="text-lg font-semibold">1,200</h1>
                        <p className="text-gray-600">#Jobs Completed</p>
                    </div>
                </div>
            </div>
        );
    };

    const TestimonialsDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Testimonials</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    {/* Testimonial 1 */}
                    <div className="flex flex-col bg-white shadow-sm p-4 rounded-md">
                        <p>
                            &quot;Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                            Cum tempora iusto officia nulla omnis aspernatur fugit minima
                            nesciunt, nemo quod ipsa alias optio qui quo?&quot;
                        </p>
                        <div className="flex items-center mt-6 ml-auto">
                            <img
                                src="/images/profile.png"
                                alt=""
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="flex flex-col ml-4">
                                <h1 className="font-semibold">John Doe</h1>
                                <p className="text-sm text-gray-500">CEO, Company Name</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="flex flex-col bg-white shadow-sm p-4 rounded-md">
                        <p>
                            &quot;Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                            Cum tempora iusto officia nulla omnis aspernatur fugit minima
                            nesciunt, nemo quod ipsa alias optio qui quo?&quot;
                        </p>
                        <div className="flex items-center mt-6 ml-auto">
                            <img
                                src="/images/profile.png"
                                alt=""
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="flex flex-col ml-4">
                                <h1 className="font-semibold">John Doe</h1>
                                <p className="text-sm text-gray-500">CEO, Company Name</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Testimonial 3 (Empty but could be used for future) */}
                <div className="mt-4 flex flex-col bg-white shadow-sm p-4 rounded-md">
                    <p>Add a testimonial here</p>
                    <div className="flex items-center mt-6 ml-auto">
                        <div>
                            <input
                                type="file"
                                className="hidden"
                                id="file-upload"
                                accept="image/*"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex items-center"
                            >
                                <div className="w-12 h-12 bg-neutral-100 border border-dashed border-neutral-500 rounded-full flex items-center justify-center">
                                    <Plus size={24} className="text-neutral-500" />
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col ml-4">
                            <h1 className="font-semibold">Add Name</h1>
                            <p className="text-sm text-gray-500">Add Company</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const TextBlockDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Simple Text Block</h2>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum tempora
                    iusto officia nulla omnis aspernatur fugit minima nesciunt, nemo quod
                    ipsa alias optio qui quo?
                </p>
            </div>
        );
    };

    const StatBlockDiv = () => {
        return (
            <div className="w-full bg-neutral-50 p-6 rounded-sm">
                <h2 className="uppercase mb-4">Simple Text Block</h2>
                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md">
                        <h1 className="text-lg font-semibold">1,200</h1>
                        <p className="text-gray-600">#Jobs Completed</p>
                    </div>
                    <div className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md">
                        <h1 className="text-lg font-semibold">1,200</h1>
                        <p className="text-gray-600">#Jobs Completed</p>
                    </div>
                    <div className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md">
                        <h1 className="text-lg font-semibold">1,200</h1>
                        <p className="text-gray-600">#Jobs Completed</p>
                    </div>
                    <div className="flex flex-col w-full sm:w-1/4 bg-white shadow-sm p-4 rounded-md">
                        <h1 className="text-lg font-semibold">1,200</h1>
                        <p className="text-gray-600">#Jobs Completed</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-start h-full py-12">

            <div className="flex flex-col w-[90%] px-8 py-8 bg-white rounded-md shadow-sm">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
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
                                            <a href="#" className="hover:text-gray-700">
                                                🔗
                                            </a>
                                            <a href="#" className="hover:text-gray-700">
                                                🎙
                                            </a>
                                            <a href="#" className="hover:text-gray-700">
                                                🌎
                                            </a>
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
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                        Voluptates veniam saepe officiis fugiat quidem maxime, laudantium
                        eligendi pariatur ex soluta animi aut nihil commodi ipsum quisquam
                        perferendis aperiam. Facilis eligendi nisi ullam voluptates
                        blanditiis sed rerum consectetur maiores rem hic, soluta quisquam,
                        facere numquam aliquam repellat doloremque delectus? Cum fugit
                        voluptatibus quod, animi repellat amet obcaecati beatae excepturi
                        corrupti esse vel neque quis, magni, odit distinctio? Ducimus
                        perspiciatis molestias quam id rerum, placeat exercitationem
                        assumenda, distinctio, hic illo laborum. Impedit totam odit rem at
                        esse magnam saepe velit, aperiam molestias quas natus delectus et
                        itaque, labore ipsum ad aspernatur. Facere!{" "}
                    </p>

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

                    <div className="mt-8">
                        <PopupDropdown
                        // todo: add props here
                        // showSections={showSections}
                        // setShowSections={setShowSections}
                        />
                    </div>

                </motion.div>
            </div>

        </div>
    );
}
