/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Input, Table, Button } from "antd";
import { Search, Compass, Heart, Earth, Tag, Share2 } from "lucide-react";
import Link from "next/link";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import api from "@/utils/axiosInstance";
import CustomImage from "@/components/CustomImage";



export default function Dashboard() {
    const [industries, setIndustries] = useState([]);
    const [subIndustries, setSubIndustries] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loggedUserId, setLoggedUserId] = useState("");
    const [companies, setCompanies] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        search: "",
        industry: "",
        subIndustry: "",
        location: "",
        verified: false,
        activeCampaigns: false,
        socialMediaLinked: false,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("user");
            if (user) {
                setLoggedUserId(JSON.parse(user)._id);
            }
        }
    }, []);

    useEffect(() => {
        getBrands();
    }, []);

    const getBrands = async () => {
        setLoading(true);
        try {
            const res = await api.get("/users/brands");
            setCompanies(res.data);
            setFilteredData(res.data);
            setIndustries(res.data.filter((item) => item.category).map((brand) => brand.category));
            setSubIndustries(res.data.filter((item) => item.subCategory).map((brand) => brand.subCategory));
            setLocations(res.data.filter((item) => item.region).map((brand) => brand.region));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (allBrands, filterValues) => {
        const { search, industry, subIndustry, location, verified, activeCampaigns, socialMediaLinked } = filterValues;

        return allBrands.filter((brand) => {
            const matchesSearch =
                brand.name.toLowerCase().includes(search.toLowerCase()) ||
                brand.description.toLowerCase().includes(search.toLowerCase());

            const matchesIndustry = industry ? brand.category.toLowerCase() === industry.toLowerCase() : true;
            const matchesSubIndustry = subIndustry ? brand.subCategory.toLowerCase() === subIndustry.toLowerCase() : true;
            const matchesLocation = location ? brand.region.toLowerCase() === location.toLowerCase() : true;
            const matchesSocial = socialMediaLinked
                ? brand.socialMediaLinks?.some((link) => link.link && link.link !== "")
                : true;

            return matchesSearch && matchesIndustry && matchesLocation && matchesSocial && matchesSubIndustry;
        });
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        const filtered = applyFilters(companies, newFilters);
        setFilteredData(filtered);
    };

    const followBrand = async (id) => {
        try {
            await api.get("/users/follow-brand/" + id);
            getBrands();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <LeftMenu />
            <div className="flex flex-col w-full p-6 overflow-y-auto max-h-screen">
                <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow mb-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            Discover Brands
                            <Compass className="w-6 h-6 text-neutral-600" />
                        </h1>
                        <p className="text-gray-600">Find brands looking to collaborate and sponsor.</p>
                    </div>
                    <Input
                        prefix={<Search className="w-5 h-5 text-gray-500" />}
                        placeholder="Search brands..."
                        className="w-80 border border-gray-300 p-2 rounded-lg"
                        onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                    />
                </div>

                <BrandFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    industries={industries}
                    locations={locations}
                    subIndustries={subIndustries}
                />

                <div className="bg-white p-6 rounded-2xl shadow mt-6 w-full">
                    <h3 className="text-xl font-semibold mb-4">Featured Brands</h3>
                    <Table
                        dataSource={filteredData}
                        pagination={false}
                        rowKey="_id"
                        size="middle"
                        loading={loading}
                        columns={[
                            {
                                title: "Brand",
                                dataIndex: "name",
                                sorter: (a, b) => a?.name?.localeCompare(b?.name),
                                render: (name, record) => (
                                    <div className="flex items-center space-x-4 p-2">
                                        <button onClick={() => followBrand(record._id)}>
                                            <Heart
                                                className={`w-5 h-5 transition ${record.followers.includes(loggedUserId)
                                                    ? "text-red-500 hover:text-gray-400"
                                                    : "text-gray-300 hover:text-red-500"
                                                    }`}
                                            />
                                        </button>
                                        <CustomImage
                                            src={record.image}
                                            alt="brand logo"
                                            className="w-14 h-14 rounded-full border shadow"
                                        />
                                        <div>
                                            <Link
                                                href={`/dashboard/brands/${record._id}`}
                                                className="text-lg font-semibold text-gray-800 hover:text-blue-500"
                                            >
                                                {name}
                                            </Link>
                                            <p className="text-sm text-gray-500">{record.description}</p>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                title: "Region",
                                dataIndex: "region",
                                render: (region) => <span className="text-gray-700">{region}</span>,
                                sorter: (a, b) => a?.region?.localeCompare(b?.region),
                            },
                            {
                                title: "Category",
                                dataIndex: "category",
                                render: (region) => <span className="text-gray-700">{region}</span>,
                                sorter: (a, b) => a?.category?.localeCompare(b?.category),
                            },
                            {
                                title: "Actions",
                                key: "actions",
                                render: (_, record) => (
                                    <div className="flex flex-col gap-2">
                                        <Link href={`/dashboard/brand-preview/${record._id}`}>
                                            <Button className="bg-black text-white w-full">View Campaigns</Button>
                                        </Link>
                                        <Link href={`/dashboard/store-front`}>
                                            <Button className="border border-gray-400 w-full">I'm Interested</Button>
                                        </Link>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}



const BrandFilters = ({
    filters,
    onFilterChange,
    industries,
    locations,
    subIndustries,
}) => {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6 space-y-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Industry Select */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1 flex items-center gap-2 font-medium">
                        <Tag className="w-4 h-4 text-gray-500" />
                        Category
                    </label>
                    <select
                        className="border border-neutral-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={filters.industry}
                        onChange={(e) => handleChange("industry", e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {industries.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1 flex items-center gap-2 font-medium">
                        <Tag className="w-4 h-4 text-gray-500" />
                        Sub Category
                    </label>
                    <select
                        className="border border-neutral-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={filters.subIndustry}
                        onChange={(e) => handleChange("subIndustry", e.target.value)}
                    >
                        <option value="">All Sub Categories</option>
                        {subIndustries.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Location Select */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1 flex items-center gap-2 font-medium">
                        <Earth className="w-4 h-4 text-gray-500" />
                        Location
                    </label>
                    <select
                        className="border border-neutral-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={filters.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                    >
                        <option value="">All Locations</option>
                        {locations.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Toggle Buttons */}
            <div className="flex flex-wrap gap-4">
                {/* <ToggleCard
                    label="Social Media Linked"
                    icon={<Share2 className="w-4 h-4" />}
                    active={filters.socialMediaLinked}
                    onClick={() => handleChange("socialMediaLinked", !filters.socialMediaLinked)}
                /> */}
                {/* Future filters like Verified or Active Campaigns can be added here */}
            </div>
        </div>
    );
};

const ToggleCard = ({ label, icon, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition
        ${active ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}
        >
            {icon}
            {label}
        </button>
    );
}
