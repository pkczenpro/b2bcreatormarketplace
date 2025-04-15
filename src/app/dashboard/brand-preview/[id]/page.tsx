/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Button/Button";
import Tabs from "@/components/Tabs/Tabs";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import ShowProductModal from "@/components/Dashboard/ShowProductModal";
import { useParams } from "next/navigation";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { toast } from "sonner";
import CustomImage from "@/components/CustomImage";
import { Rate, Tooltip } from "antd";


export default function BrandDashboard() {
    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

    useEffect(() => {
        setLoggedInUserId(JSON.parse(localStorage.getItem("user") || "{}")._id);
    }, []);

    const [userData, setUserData] = useState<any>(null);
    const [campaigns, setCampaigns] = useState<any>(null);
    const [products, setProducts] = useState<any>(null);
    const [partnerships, setPartnerships] = useState(null);

    const params = useParams();
    const getBrand = async () => {
        try {
            const res = await api.get("/users/brand/" + params.id);
            setUserData(res.data);
            setCampaigns(res.data.campaigns);
            setProducts(res.data.products);
            setPartnerships(res.data.partnerships);
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        getBrand();
    }, [params.id]);

    const handleRateProduct = async (productId: string, rating: number) => {
        try {
            const res = await api.post(`/products/rate/${productId}`, { rating });
            toast.success(res.data.message, {
                position: "top-right",
                description: "You have rated this product",
            });
            getBrand();
        } catch (err) {
            console.error(err);
        }
    };


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
                                        {campaign
                                            ?.tags
                                            ?.filter((item) => item)
                                            .map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                    </div>
                                    <div className="flex space-x-2">
                                        {campaign.contentType?.filter((item) => item).map((tag, index) => (
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
                    {partnerships?.length > 0 && partnerships?.map((partnership: any, index: number) => (
                        <div key={index} className="border border-neutral-100 mt-6 rounded-md p-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4 mb-4">
                                    <CustomImage
                                        loading="lazy"
                                        className="w-16 h-16 object-cover rounded-full"
                                        src={
                                            partnership?.profileImage?.includes("http")
                                                ? partnership?.profileImage
                                                : process.env.NEXT_PUBLIC_SERVER_URL + partnership?.profileImage
                                        } alt="" />
                                    <span className="text-xl font-bold">
                                        {partnership?.name}
                                    </span>
                                </div>
                                <Link href={`/dashboard/user-preview/${partnership?.user_id}`} target="_blank">
                                    <div className="flex items-center space-x-2 text-primary-700 font-medium">
                                        View Storefront
                                        <ArrowRight size={18} />
                                    </div>
                                </Link>
                            </div>

                            {partnership.bio && <p className="text-neutral-600 text-left mb-6">
                                {partnership?.bio}
                            </p>}

                            {partnership.tags.length > 0 && <div className="flex space-x-2">
                                {
                                    partnership?.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                            </div>}

                            <div className="border-t border-gray-200 my-6"></div>

                            <div className="flex flex-wrap">
                                {partnership?.campaigns?.map(
                                    (tag, index) => (
                                        <Link
                                            key={index}
                                            href={`/dashboard/campaigns-details/${tag._id}`}
                                            target="_blank"
                                            className="mr-2 mb-2"
                                        >
                                            <span
                                                className="font-bold inline-block border-[1px] border-primary-600 text-primary-600 px-2 py-1 rounded-sm text-sm"
                                            >
                                                {tag.title}
                                            </span>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </>
            ),
        },
        {
            id: 3,
            label: "Products",
            content: (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Product Catalogue of {userData?.profileName}
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {products
                            ?.filter((item) => item.publicVisibility)
                            .map((product: any, index: number) => (
                                <div
                                    key={index}
                                    className="bg-white shadow-sm border border-neutral-100 hover:shadow-md transition-all duration-200 rounded-xl p-5 flex flex-col gap-4 cursor-pointer"

                                >
                                    <img
                                        loading="lazy"
                                        src={
                                            product.productLogo?.includes("http")
                                                ? product.productLogo
                                                : process.env.NEXT_PUBLIC_SERVER_URL + product.productLogo
                                        }
                                        alt=""
                                        className="w-full h-48 object-cover rounded-lg"
                                        onClick={() => {
                                            setShowProductModal(true);
                                            setSelectedProduct(product);
                                        }}
                                    />
                                    <div className="flex flex-col" onClick={() => {
                                        setShowProductModal(true);
                                        setSelectedProduct(product);
                                    }}>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {product.productName}
                                        </h2>
                                        <p className="text-sm text-neutral-600 mt-1 line-clamp-3">
                                            {product.productDescription}
                                        </p>
                                    </div>
                                    <Tooltip
                                        title="Rate this product"
                                        placement="top"
                                        arrowPointAtCenter
                                    >
                                        <div className="mt-auto pt-2 flex justify-between">
                                            <Rate
                                                allowHalf
                                                defaultValue={product.rating}
                                                onChange={(value) => handleRateProduct(product._id, value)}
                                                className="text-yellow-500"
                                            />

                                            <p className="text-sm text-neutral-500 mb-1">
                                                <span className="font-medium text-gray-700">
                                                    {product.rating?.toFixed(1) || "Not rated yet"}
                                                </span>
                                            </p>
                                        </div>
                                    </Tooltip>
                                </div>
                            ))}
                    </div>
                </div>
            ),
        }
    ].filter(Boolean);

    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


    const followBrand = async () => {
        try {
            const res = await api.get("/users/follow-brand/" + params.id);
            toast.success(res.data.message, {
                position: "top-right",
                description: "You are now following this brand",
            });
            getBrand();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col sm:flex-row w-full">
            <LeftMenu />
            <div className="flex flex-col items-center justify-start h-full py-12 px-4 sm:px-6 lg:px-8 w-full overflow-y-auto max-h-screen">
                <ShowProductModal modal={showProductModal} setModal={setShowProductModal} product={selectedProduct} />

                <div className="flex flex-col w-full max-w-6xl px-6 py-8 bg-white rounded-md shadow-sm">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <div className="relative">
                            {/* Cover Image */}
                            <div className="relative w-full h-48 sm:h-72">
                                <CustomImage loading="lazy" src={userData?.coverImage?.includes("http")
                                    ? userData?.coverImage
                                    : process.env.NEXT_PUBLIC_SERVER_URL + userData?.coverImage} alt="Cover" className="w-full h-full object-cover rounded-md" />
                            </div>

                            {/* Profile Section */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between w-full absolute bottom-[-50px] sm:bottom-[-85px] px-4 sm:px-12">
                                <div className="flex flex-col sm:flex-row items-center sm:items-end space-x-0 sm:space-x-4 text-center sm:text-left">
                                    <div className="w-24 sm:w-40 rounded-sm overflow-hidden">
                                        <CustomImage loading="lazy" src={userData?.profileImage?.includes("http")
                                            ? userData?.profileImage
                                            : process.env.NEXT_PUBLIC_SERVER_URL + userData?.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Name and Socials */}
                                    <div className="mt-3 sm:mt-0">
                                        {userData?.profileName && <h2 className="text-xl sm:text-2xl font-semibold">
                                            {userData?.profileName}
                                        </h2>}
                                        {userData?.location != "undefined" && userData?.location &&
                                            <h4 className="text-gray-500 text-sm">
                                                {userData?.location}
                                            </h4>}
                                        <div className="flex justify-center sm:justify-start space-x-3 mt-1 text-gray-500">
                                            {
                                                userData?.socialMediaLinks.filter((item) => item.link).map((link: any, index: number) => (
                                                    <a key={index} href={link.link} target="_blank" rel="noreferrer">
                                                        <img loading="lazy"
                                                            src={`/icons/${link.platform}.svg`}
                                                            alt={link.platform}
                                                            className="w-6 h-6"
                                                        />
                                                    </a>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={followBrand}
                                    size="small"
                                    variant={userData?.followers.includes(loggedInUserId) ? "outline" : "primary"}
                                    className="mt-4 sm:mt-0 text-sm flex px-3 py-1 items-center max-w-[200px]">
                                    {userData?.followers.includes(loggedInUserId) ? "Following" : "Follow"}
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
                        {/* STATS TODO */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                            <div key={1} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
                                <h1 className="text-lg font-semibold">
                                    {campaigns?.length}
                                </h1>
                                <p className="text-gray-600">
                                    Campaigns
                                </p>
                            </div>
                            <div key={2} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
                                <h1 className="text-lg font-semibold">
                                    {products?.length || 0}
                                </h1>
                                <p className="text-gray-600">
                                    Products
                                </p>
                            </div>
                            <div key={3} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
                                <h1 className="text-lg font-semibold">1,200</h1>
                                <p className="text-gray-600">Campaigns Completed</p>
                            </div>
                            <div key={4} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
                                <h1 className="text-lg font-semibold">
                                    {/* COMPANY SIZE */} 0
                                </h1>
                                <p className="text-gray-600">
                                    Company Size
                                </p>
                            </div>
                            <div key={5} className="flex flex-col bg-white p-4 rounded-md border border-gray-200 text-center">
                                <h1 className="text-lg font-semibold">
                                    {userData?.followers?.length || 0}
                                </h1>
                                <p className="text-gray-600">
                                    Followers
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-6"></div>

                        <Tabs
                            tabs={tabs}
                            localStorageKey="brand-dashboard-tabs"
                        />
                    </motion.div>
                </div>
            </div>
        </div>

    );
}
