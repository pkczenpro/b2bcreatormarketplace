/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { Badge, Input, Table, Checkbox, Button } from "antd";
import { Search, Compass, Earth } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const categories = [
    { name: "Technology", sub: ["AI", "Blockchain", "SaaS"] },
    { name: "Marketing", sub: ["SEO", "Social Media", "Branding"] },
    { name: "Finance", sub: ["Investment", "Banking", "Insurance"] }
];

const companies = [
    {
        id: 1,
        name: "TechCorp",
        region: "USA",
        size: "500+",
        category: "Technology",
        linkedin: "https://linkedin.com/company/techcorp",
        website: "https://techcorp.com",
        logo: "/icons/linkedin.svg",
        description: "Leading innovator in AI and blockchain solutions."
    },
    {
        id: 2,
        name: "MarketGenius",
        region: "UK",
        size: "200-500",
        category: "Marketing",
        linkedin: "https://linkedin.com/company/marketgenius",
        website: "https://marketgenius.com",
        logo: "/icons/linkedin.svg",
        description: "Helping brands excel in digital marketing strategies."
    }
];

export default function Dashboard() {
    const [filteredData, setFilteredData] = useState(companies);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setFilteredData(companies.filter(company =>
            company.name.toLowerCase().includes(query) ||
            company.description.toLowerCase().includes(query)
        ));
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    useEffect(() => {
        if (selectedCategories.length === 0) {
            setFilteredData(companies);
        } else {
            setFilteredData(companies.filter(company => selectedCategories.includes(company.category)));
        }
    }, [selectedCategories]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <LeftMenu />
            <div className="flex flex-col w-full p-6">
                <div className="flex items-center justify-between bg-white p-6 rounded-lg">
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
                        onChange={handleSearch}
                    />
                </div>

                <div className="flex gap-2 mt-2 h-full">
                    <div className="bg-white p-4 rounded-lg w-[20%]">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="mb-2">
                                <h3 className="font-medium text-gray-700">{cat.name}</h3>
                                <div className="flex flex-col m-4">
                                    {cat.sub.map((sub, i) => (
                                        <Checkbox key={i} onChange={() => handleCategoryFilter(sub)}>{sub}</Checkbox>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-span-3 bg-white p-6 rounded-lg w-full">
                        <h3 className="text-xl font-semibold mb-4">Featured Brands</h3>
                        <div>
                            <Table
                                // bordered
                                dataSource={filteredData}
                                pagination={false}
                                rowKey="id"
                                size="small"
                                columns={[

                                    {
                                        title: "Name",
                                        dataIndex: "name",
                                        render: (name, record) => (
                                            <div className="flex items-center">
                                                <img src={record.logo} alt="logo" className="w-12 h-12 mr-2" />
                                                <div>
                                                    <div className="flex items-center">
                                                        <Link href={`/dashboard/brands/${record.id}`} className="mr-2">
                                                            <span className="font-semibold text-gray-800">{name}</span>
                                                        </Link>
                                                        <img src="/icons/linkedin.svg" alt="" className="w-5 h-5 mr-2" />
                                                        <Earth className="w-5 h-5 text-neutral-500" />
                                                    </div>
                                                    <p className="text-sm text-gray-500">{record.description}</p>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        title: "Region",
                                        dataIndex: "region",
                                        render: (region) => <p className="text-gray-800">{region}</p>
                                    },
                                    {
                                        title: "Size",
                                        dataIndex: "size",
                                        render: (size) => <p
                                            className="bg-blue-100 text-blue-500 px-2 py-1 rounded-md text-center"
                                        >{size}</p>
                                    },
                                    {
                                        title: "Category",
                                        dataIndex: "category",
                                        render: (category) => <Badge className="text-center">{category}</Badge>
                                    },
                                    {
                                        title: "Actions",
                                        key: "actions",
                                        render: () => (
                                            <div className="flex flex-col gap-2">
                                                <Link
                                                    href={`/dashboard/store-front`}
                                                    className="w-full"
                                                ><Button className="bg-black text-white w-full">View Campaigns</Button></Link>
                                                <Link
                                                    href={`/dashboard/store-front`}
                                                    className="w-full"
                                                >
                                                    <Button className="border border-gray-500 text-black w-full">I'm Interested</Button>
                                                </Link>
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
