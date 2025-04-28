/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { Breadcrumb, Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tabs from "@/components/Tabs/Tabs";
import Input from "@/components/Input/Input";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import Script from "next/script";

type CampaignDetailsProps = object;

export default function PayCreator({ }: CampaignDetailsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [amount, setAmount] = useState(200.59); // This should come from your data

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const displayRazorpay = async () => {
        setLoading(true);
        try {
            const res = await api.post("/invoices/create-order", {
                amount: amount * 100, // Convert to paise
            });

            const { id, currency, amount } = res.data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: "B2B Platform",
                description: "Payment for creator services",
                order_id: id,
                handler: async function (response) {
                    try {
                        const result = await api.post("/invoices/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (result.data.success) {
                            toast.success("Payment successful!");
                            router.push("/dashboard/campaigns");
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (error) {
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: "Customer Name",
                    email: "customer@example.com",
                },
                theme: {
                    color: "#4F46E5",
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRazorpay();
    }, []);

    return (
        <div className="flex">
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50 p-12 overflow-y-auto max-h-screen">
                <Breadcrumb
                    items={[
                        {
                            title: "Campaigns",
                            href: "/dashboard/campaigns"
                        },
                        {
                            title: 'Campaign Name',
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
                                    $ {amount}
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
                                                    <Button
                                                        className="w-full bg-primary-700 text-white"
                                                        size="large"
                                                        onClick={displayRazorpay}
                                                        loading={loading}
                                                    >
                                                        Pay ${amount}
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
