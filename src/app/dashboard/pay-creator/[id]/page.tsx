/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { Breadcrumb, Button, Table } from "antd";
import React from "react";
import { motion } from "framer-motion";
import Tabs from "@/components/Tabs/Tabs";
import Input from "@/components/Input/Input";


type CampaignDetailsProps = object;


export default function PayCreator({ }: CampaignDetailsProps) {
    return (
        <div className="flex">
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50 p-12">
                <Breadcrumb
                    items={[
                        {
                            title: "Campaigns", // todo: replace with actual brand name
                            href: "/dashboard/campaigns"
                        },
                        {
                            title: 'Campaign Name', // todo: replace with actual campaign nameh
                            href: "/dashboard/campaigns-details/1"
                        },
                        {
                            title: 'Pay Creators'
                        }
                    ]}
                />
                <div className="mt-4 flex flex-col w-full px-8 py-8 bg-white rounded-lg shadow-sm">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div>
                            <div className="flex items-center justify-between gap-4 bg-neutral-50 p-4 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <img loading="lazy" src="/images/profile.png" alt="" />
                                    <h2 className="text-md font-bold text-neutral-600">
                                        Tony Dunbar
                                    </h2>
                                </div>

                                <span className="text-lg font-bold text-black">
                                    $ {" "} 200.59
                                </span>
                            </div>

                            <div className="mt-4">
                                <Tabs

                                    tabs={[
                                        {
                                            id: 1,
                                            label: "Payment",
                                            content: <>
                                                <div className="mt-8 w-1/3">
                                                    <Input
                                                        placeholder="XXXX XXXX XXXX XXXX"
                                                        label="Card Number"
                                                    />
                                                </div>

                                                <div className="mt-4 w-1/3 flex justify-between">
                                                    <Input
                                                        placeholder="MM/YY"
                                                        label="Expiration Date"
                                                    />
                                                    <div className="ml-4">
                                                        <Input
                                                            placeholder="XXX"
                                                            label="CVV"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-4 w-1/3">
                                                    <input type="checkbox" name="" id="" className="mr-2 bg-primary-700" />
                                                    <label htmlFor="" className="text-neutral-800 text-sm">
                                                        Save card details for next transactions</label>
                                                </div>

                                                <div className="mt-8 w-1/3">
                                                    <Button className="w-full bg-primary-700 text-white" size="large">
                                                        Pay $200.59
                                                    </Button>
                                                </div>
                                            </>
                                        },
                                        {
                                            id: 2,
                                            label: "Price Breakdown",
                                            content: <div className="mt-8">
                                                <Table
                                                    size="small"
                                                    pagination={false}
                                                    bordered
                                                    columns={[
                                                        {
                                                            title: "Work",
                                                            dataIndex: "work",
                                                            key: "work"
                                                        },
                                                        {
                                                            title: "Date",
                                                            dataIndex: "date",
                                                            key: "date"
                                                        },
                                                        {
                                                            title: "Amount ($)",
                                                            dataIndex: "amount",
                                                            key: "amount"
                                                        }
                                                    ]}
                                                    dataSource={[
                                                        {
                                                            key: "1",
                                                            work: "Instagram Post",
                                                            date: "12th August 2024",
                                                            amount: 100
                                                        },
                                                        {
                                                            key: "2",
                                                            work: "Youtube Video",
                                                            date: "12th August 2024",
                                                            amount: 100
                                                        }
                                                    ]}
                                                />
                                            </div>
                                        }
                                    ]}
                                />
                            </div>



                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
