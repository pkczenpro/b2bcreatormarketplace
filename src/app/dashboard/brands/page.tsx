/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import api from "@/utils/axiosInstance";
import { Input, Table, Button } from "antd";
import { Search, Compass, Earth, Heart } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Dashboard() {
    const [loggedUserId, setLoggedUserId] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("user");
            if (user) {
                setLoggedUserId(JSON.parse(user)._id);
            }
        }
    }, []);

    const [companies, setCompanies] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const getBrands = async () => {
        setLoading(true);
        api.get("/users/brands").then(res => {
            setFilteredData(res.data);
            setCompanies(res.data);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        getBrands();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setFilteredData(companies.filter(company =>
            company.name.toLowerCase().includes(query) ||
            company.description.toLowerCase().includes(query)
        ));
    };

    const followBrand = async (id) => {
        try {
            await api.get("/users/follow-brand/" + id);
            getBrands();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* <LoadingOverlay
                loading={loading}
            /> */}
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
                    <div className="col-span-3 bg-white p-6 rounded-lg w-full">
                        <h3 className="text-xl font-semibold mb-4">Featured Brands</h3>
                        <div>
                            <Table
                                // bordered
                                dataSource={filteredData}
                                pagination={false}
                                rowKey="id"
                                size="small"
                                loading={loading}
                                columns={[
                                    {
                                        title: "Name",
                                        dataIndex: "name",
                                        render: (name, record) => (
                                            <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-all rounded-lg">
                                                <div>
                                                    {
                                                        record.followers.includes(loggedUserId)
                                                            ? <Heart className="text-red-600 hover:text-gray-300 transition-all cursor-pointer"
                                                                onClick={() => followBrand(record._id)}
                                                            />
                                                            : <Heart className="text-gray-300 hover:text-red-500 transition-all cursor-pointer"
                                                                onClick={() => followBrand(record._id)}
                                                            />
                                                    }
                                                </div>
                                                <img
                                                    loading="lazy"
                                                    src={record.image}
                                                    alt="logo"
                                                    className="w-16 h-16 rounded-full border-2 border-gray-200 shadow-md"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <Link href={`/dashboard/brands/${record.id}`} className="font-semibold text-lg text-gray-800 hover:text-blue-500 transition-all">
                                                            {name}
                                                        </Link>
                                                        <img
                                                            loading="lazy"
                                                            src="/icons/linkedin.svg"
                                                            alt="LinkedIn"
                                                            className="w-5 h-5 opacity-70 hover:opacity-100 transition-all"
                                                        />
                                                        <Earth className="w-5 h-5 text-neutral-500 hover:text-neutral-700 transition-all" />
                                                    </div>
                                                    <p className="mt-2 text-sm text-gray-600">{record.description}</p>
                                                </div>
                                            </div>
                                        )
                                    },

                                    {
                                        title: "Region",
                                        dataIndex: "region",
                                        render: (region) => <p className="text-gray-800">{region}</p>
                                    },
                                    // {
                                    //     title: "Size",
                                    //     dataIndex: "size",
                                    //     render: (size) => <p
                                    //         className="bg-blue-100 text-blue-500 px-2 py-1 rounded-md text-center"
                                    //     >{size}</p>

                                    {
                                        title: "Actions",
                                        key: "actions",
                                        render: (
                                            text,
                                            record
                                        ) => (
                                            <div className="flex flex-col gap-2">
                                                <Link
                                                    href={`/dashboard/brand-preview/${record._id}`}
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
