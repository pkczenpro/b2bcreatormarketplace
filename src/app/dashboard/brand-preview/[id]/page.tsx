/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Button/Button";
import Tabs from "@/components/Tabs/Tabs";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import ShowProductModal from "@/components/Dashboard/ShowProductModal";
import { useParams } from "next/navigation";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";


export default function BrandDashboard() {
    const [userData, setUserData] = useState<any>(null);
    const [campaigns, setCampaigns] = useState<any>(null);
    const [partnerships, setPartnerships] = useState<any>(null);
    const [products, setProducts] = useState<any>(null);
    const params = useParams();
    const getBrand = async () => {
        try {
            const res = await api.get("/users/brand/" + params.id);
            setUserData(res.data);
            setCampaigns(res.data.campaigns);
            // setPartnerships(res.data.partnerships);
            setProducts(res.data.products);
        } catch (error) {
            console.log(error);
        }
    }


    React.useEffect(() => {
        getBrand();
    }, [params.id]);


    const tabs = [
        {
            id: 1,
            label: "Campaigns",
            content: (
                <>
                    {campaigns?.map((campaign: any, index: number) => (
                        <Link href={`/dashboard/campaigns-details/${campaign._id}`} key={index}>
                            <div className="border border-neutral-100 mt-6 rounded-md p-6 cursor-pointer transition-all hover:shadow-md hover:transition-all">
                                {/* Date or status if going on */}
                                <span className="text-md font-bold text-success-500 rounded-sm">
                                    {campaign.status}
                                </span>
                                <h3 className="text-h5 font-bold text-left mb-1">
                                    {campaign.title}
                                </h3>
                                <p className="text-neutral-600 text-left mb-6">
                                    {campaign.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        {campaign?.tags?.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex space-x-2">
                                        {campaign.contentType.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </>
            ),
        },
        {
            id: 2,
            label: "Partnerships",
            content: (
                <>
                    <div className="border border-neutral-100 mt-6 rounded-md p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 mb-4">
                                <img loading="lazy" src="/images/profile.png" alt="" />
                                <span className="text-xl font-bold">Andrew Bishop</span>
                            </div>
                            <Link href="/dashboard/user-preview/ID_USER" target="_blank">
                                <div className="flex items-center space-x-2 text-primary-700 font-medium">
                                    View Storefront
                                    <ArrowRight size={18} />
                                </div>
                            </Link>
                        </div>

                        <p className="text-neutral-600 text-left mb-6">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
                            aspernatur voluptates ad, officiis commodi laborum!
                        </p>

                        <div className="flex space-x-2">
                            {["Tech", "Design", "Marketing"].map((tag, index) => (
                                <span
                                    key={index}
                                    className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 my-6"></div>

                        <div className="flex space-x-2">
                            {["Campaign Name 1", "Campaign Name 2", "Campaign Name 3"].map(
                                (tag, index) => (
                                    <span
                                        key={index}
                                        className="font-bold inline-block border-[1px] border-primary-600 text-primary-600 px-2 py-1 rounded-sm text-sm"
                                    >
                                        {tag}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </>
            ),
        },
        products?.length > 0 && {
            id: 3,
            label: "Products",
            content: (
                <div className="mt-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-h5 font-bold text-left">
                            Product Catalogue of {userData?.profileName}
                        </h3>

                    </div>

                    {products?.filter((item) => item.publicVisibility).map((product: any, index: number) => (
                        <div key={index} className="border border-neutral-100 mt-6 p-6 rounded-md flex items-center space-x-4 mb-4 cursor-pointer" onClick={() => {
                            setShowProductModal(true);
                            setSelectedProduct(product);
                        }}>
                            <img loading="lazy"
                                src={product?.productLogo}
                                alt=""
                                className="w-48 h-48 object-cover rounded-md"
                            />
                            <div className="flex flex-col">
                                <h2 className="text-h5 font-bold mb-2">
                                    {product.productName}
                                </h2>
                                <p className="text-neutral-600">
                                    {product.productDescription}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            ),
        },
    ].filter(Boolean);

    console.log(products)

    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    return (
        <div className="flex flex-col sm:flex-row w-full">
            <LeftMenu />
            <div className="flex flex-col items-center justify-start h-full py-12 px-4 sm:px-6 lg:px-8 w-full">
                <ShowProductModal modal={showProductModal} setModal={setShowProductModal} product={selectedProduct} />

                <div className="flex flex-col w-full max-w-6xl px-6 py-8 bg-white rounded-md shadow-sm">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <div className="relative">
                            {/* Cover Image */}
                            <div className="relative w-full h-48 sm:h-72">
                                <img loading="lazy" src={userData?.coverImage} alt="Cover" className="w-full h-full object-cover rounded-md" />
                            </div>

                            {/* Profile Section */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between w-full absolute bottom-[-50px] sm:bottom-[-85px] px-4 sm:px-12">
                                <div className="flex flex-col sm:flex-row items-center sm:items-end space-x-0 sm:space-x-4 text-center sm:text-left">
                                    <div className="w-24 sm:w-40 rounded-sm overflow-hidden">
                                        <img loading="lazy" src={userData?.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Name and Socials */}
                                    <div className="mt-3 sm:mt-0">
                                        <h2 className="text-xl sm:text-2xl font-semibold">
                                            {userData?.profileName}
                                        </h2>
                                        <h4 className="text-gray-500 text-sm">
                                            {userData?.location}
                                        </h4>
                                        <div className="flex justify-center sm:justify-start space-x-3 mt-1 text-gray-500">
                                            {userData?.socialMediaLinks.map((link: any, index: number) => (
                                                <a key={index} href={link.link} target="_blank" rel="noreferrer">
                                                    <img loading="lazy"
                                                        src={`/icons/${link.platform}.svg`}
                                                        alt={link.platform}
                                                        className="w-6 h-6"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Button */}
                                <Button size="small" variant="primary" className="mt-4 sm:mt-0 text-sm flex px-3 py-1 items-center max-w-[200px]">
                                    Follow
                                </Button>
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="mt-20 sm:mt-28 text-gray-600 text-sm px-2 sm:px-0">
                            {userData?.bio}
                        </p>

                        {/* Tags */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {userData?.tags.map((tag: string, index: number) => (
                                <span key={index} className="font-bold inline-block border-[1px] border-primary-700 text-primary-700 px-2 py-1 rounded-sm text-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                            {Array(5).fill(0).map((_, index) => (
                                <div key={index} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
                                    <h1 className="text-lg font-semibold">1,200</h1>
                                    <p className="text-gray-600">#Jobs Completed</p>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-6"></div>

                        <Tabs tabs={tabs} />
                    </motion.div>
                </div>
            </div>
        </div>

    );
}
