/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Button/Button";
import Tabs from "@/components/Tabs/Tabs";
import { ArrowRight, Eye, View, Video, Image } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import ShowProductModal from "@/components/Dashboard/ShowProductModal";
import { useParams } from "next/navigation";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { toast } from "sonner";
import CustomImage from "@/components/CustomImage";
import { Rate } from "antd";

interface SocialMediaLink {
    platform: string;
    url: string;
}

interface Campaign {
    _id: string;
    title: string;
    description: string;
    status: string;
    tags: string[];
    contentType: string[];
    visibility: boolean;
}

interface Partnership {
    _id: string;
    name: string;
    profileImage: string;
    bio: string;
    tags: string[];
    user_id: string;
    campaigns: Campaign[];
}

interface Product {
    _id: string;
    productName: string;
    productLogo: string;
    productDescription: string;
    productLink: string;
    loomVideoLink: string;
    rating: number;
    publicVisibility: boolean;
}

interface UserData {
    profileName: string;
    coverImage?: string;
    profileImage?: string;
    location?: string;
    bio?: string;
    tags?: string[];
    followers?: number;
    socialMediaLinks?: SocialMediaLink[];
    campaigns: Campaign[];
    products: Product[];
    partnerships: Partnership[];
}

export default function BrandDashboard() {
    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

    useEffect(() => {
        setLoggedInUserId(JSON.parse(localStorage.getItem("user") || "{}")._id);
    }, []);

    const [userData, setUserData] = useState<UserData | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
    const [products, setProducts] = useState<Product[] | null>(null);
    const [partnerships, setPartnerships] = useState<Partnership[] | null>(null);

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

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return '';
        return imagePath.includes('http') ? imagePath : `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${imagePath}`;
    };

    const tabs = [
        {
            id: 1,
            label: "Campaigns",
            content: (
                <>
                    {campaigns?.filter((campaign: Campaign) => campaign.visibility).map((campaign: Campaign, index: number) => (
                        <Link href={`/dashboard/campaigns-details/${campaign._id}`} key={index}>
                            <div className="border border-neutral-100 mt-6 rounded-md p-6 cursor-pointer transition-all hover:shadow-md hover:transition-all">
                                {/* Date or status if going on */}
                                <span className="text-md font-bold text-success-500 rounded-sm">
                                    {campaign.status ? "Active" : "Inactive"}
                                </span>
                                <h3 className="text-h5 font-bold text-left mb-1">
                                    {campaign.title}
                                </h3>
                                <p className="text-neutral-600 text-left mb-6">
                                    {campaign.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        {campaign.tags
                                            ?.filter((tag: string) => tag)
                                            .map((tag: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="font-bold inline-block border-[1px] border-neutral-600 text-neutral-600 px-2 py-1 rounded-sm text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                    </div>
                                    <div className="flex space-x-2">
                                        {campaign.contentType?.filter((tag: string) => tag).map((tag: string, index: number) => (
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
                    {partnerships && partnerships.length > 0 && partnerships.map((partnership: Partnership, index: number) => (
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
                <div className="mt-10">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8">
                        Product Catalogue of {userData?.profileName}
                    </h3>

                    <div className="space-y-4">
                        {products?.map((product: Product, index: number) => {
                            const productLogo = product.productLogo?.includes("http")
                                ? product.productLogo
                                : process.env.NEXT_PUBLIC_SERVER_URL + product.productLogo;



                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-center p-4">
                                        {/* Product Logo */}
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mr-4">
                                            {productLogo.includes("null") || !product.productLogo ? (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Image size={24} />
                                                </div>
                                            ) : (
                                                <img
                                                    loading="lazy"
                                                    src={productLogo || "/images/product.png"}
                                                    alt={product.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-grow">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-lg font-semibold text-gray-900">
                                                    {product.productName}
                                                </h4>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="primary"
                                                        size="small"
                                                        className="rounded-full"
                                                        onClick={() => {
                                                            setShowProductModal(true);
                                                            setSelectedProduct(product);
                                                        }}
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {product.productDescription}
                                            </p>

                                            <div className="flex items-center mt-2 space-x-4">
                                                <div className="flex items-center">
                                                    <Rate
                                                        allowHalf
                                                        defaultValue={product.rating || 0}
                                                        onChange={(value) => handleRateProduct(product._id, value)}
                                                        className="text-sm"
                                                    />
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        {product.rating?.toFixed(1) || "Not rated"}
                                                    </span>
                                                </div>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${product.publicVisibility
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {product.publicVisibility ? "Public" : "Private"}
                                                </span>
                                            </div>

                                            {/* Links */}
                                            <div className="flex items-center mt-3 space-x-4">
                                                {product.productLink && (
                                                    <a
                                                        href={product.productLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline flex items-center"
                                                    >
                                                        <View size={14} className="mr-1" />
                                                        View Product
                                                    </a>
                                                )}
                                                {product.loomVideoLink && (
                                                    <a
                                                        href={product.loomVideoLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline flex items-center"
                                                    >
                                                        <Video size={14} className="mr-1" />
                                                        Watch Demo
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ),
        },
    ].filter(Boolean);

    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


    const followBrand = async () => {
        try {
            const res = await api.get("/users/follow-brand/" + params.id);
            toast.success(res.data.message, {
                position: "top-right",
            });
            getBrand();
        } catch (error) {
            console.log(error);
        }
    }

    const formatFollowers = (count?: number) => {
        console.log(count);
        if (!count) return '0';
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString() || "0";
    };

    return (
        <div className="flex flex-col sm:flex-row w-full">
            <LeftMenu />
            <div className="flex flex-col items-center justify-start h-full py-12 px-4 sm:px-6 lg:px-8 w-full overflow-y-auto max-h-screen">
                <ShowProductModal modal={showProductModal} setModal={setShowProductModal} product={selectedProduct} />

                <div className="flex flex-col w-full max-w-6xl px-6 py-8 bg-white rounded-md">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <div className="relative">
                            {/* Cover Image */}
                            {userData?.coverImage && (
                                <div className="relative h-64 w-full z-0">
                                    <img
                                        src={getImageUrl(userData.coverImage)}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Profile Section */}
                            <div className="absolute bottom-[-50px] sm:bottom-[-85px] w-full flex flex-col sm:flex-row items-center sm:items-end justify-between px-4 sm:px-12">
                                <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left space-x-0 sm:space-x-4">

                                    {/* Profile Image */}
                                    {userData?.profileImage && (
                                        <div className="relative z-50">
                                            <img
                                                src={getImageUrl(userData.profileImage)}
                                                alt="Profile"
                                                className="h-32 w-32"
                                            />
                                        </div>
                                    )}

                                    {/* Name and Socials */}
                                    <div className="mt-3 sm:mt-0">
                                        {userData?.profileName && (
                                            <h2 className="text-xl sm:text-2xl font-semibold">
                                                {userData.profileName}
                                            </h2>
                                        )}
                                        {userData?.location !== "undefined" && userData?.location && (
                                            <h4 className="text-gray-500 text-sm">{userData.location}</h4>
                                        )}
                                        <div className="flex justify-center sm:justify-start space-x-3 mt-1 text-gray-500">
                                            {userData?.socialMediaLinks
                                                ?.filter((link: SocialMediaLink) => link.url)
                                                .map((link: SocialMediaLink, index: number) => (
                                                    <a key={index} href={link.url} target="_blank" rel="noreferrer">
                                                        <img
                                                            loading="lazy"
                                                            src={`/icons/${link.platform}.svg`}
                                                            alt={link.platform}
                                                            className="w-5 h-5"
                                                        />
                                                    </a>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Follow Button */}
                                <Button
                                    onClick={followBrand}
                                    size="small"
                                    variant={userData?.followers.includes(loggedInUserId) ? "outline" : "primary"}
                                    className="mt-4 sm:mt-0 text-sm flex px-3 py-1 items-center max-w-[200px]"
                                >
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
                            {userData?.tags?.map((tag: string, index: number) => (
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
                                <h1 className="text-lg font-semibold">
                                    {campaigns?.filter((campaign: any) => campaign.status === "done").length || 0}
                                </h1>
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
                                    {formatFollowers(userData?.followers?.length)}
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
