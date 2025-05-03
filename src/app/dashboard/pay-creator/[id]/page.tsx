"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import { Breadcrumb, Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tabs from "@/components/Tabs/Tabs";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import CustomImage from "@/components/CustomImage";
import { useRouter } from "next/navigation";

type CampaignDetailsProps = object;

export default function PayCreator({ }: CampaignDetailsProps) {
    const router = useRouter();
    const [amount, setAmount] = useState(null);

    const searchParams = useSearchParams();
    const email = searchParams.get("creator");
    const invoiceId = searchParams.get("invoiceId");

    const params = useParams();
    const id = params?.id;

    const [paymentDetails, setPaymentDetails] = useState<any>(null);
    const getPaymentDetails = async () => {
        try {
            const res = await api.get(`/invoices/invoice-details/${id}/${email}`);
            setPaymentDetails(res.data);
            setAmount(res.data.amount);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch payment details");
        }
    }
    useEffect(() => {
        if (id) {
            getPaymentDetails();
        }
    }, [id]);

    const [loading, setLoading] = useState(false);
    const [isRazorpayReady, setIsRazorpayReady] = useState(false);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                setIsRazorpayReady(true);
                resolve(true);
            };
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const displayRazorpay = async () => {
        setLoading(true);

        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
            toast.error("Razorpay key is not defined");
            setLoading(false);
            return;
        }

        if (typeof (window as any).Razorpay === "undefined") {
            toast.error("Razorpay SDK not loaded");
            setLoading(false);
            return;
        }

        try {
            const res = await api.post("/invoices/create-order", {
                amount: amount * 100,
            });

            const { id, currency, amount: orderAmount } = res.data;

            const options = {
                key: razorpayKey,
                amount: orderAmount,
                currency,
                name: "B2B Platform",
                description: "Payment for creator services",
                order_id: id,
                handler: async function (response: any) {
                    try {
                        const result = await api.post("/invoices/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            invoiceId: invoiceId,
                        });

                        if (result.data.success) {
                            toast.success("Payment successful!");
                            router.push("/dashboard/campaigns");
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (error) {
                        console.error(error);
                        toast.error("Payment verification failed:", error);
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
            console.error(error);
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
                        { title: "Campaigns", href: "/dashboard/campaigns" },
                        { title: paymentDetails?.campaignName, href: `/dashboard/campaigns-details/${id}` },
                        { title: "Pay Creators" },
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
                                    <CustomImage loading="lazy" src={paymentDetails?.profileImage} alt=""
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <h2 className="text-md font-bold text-neutral-600">
                                        {paymentDetails?.userName}
                                    </h2>
                                </div>
                                <span className="text-lg font-bold text-black">
                                    $ {amount?.toFixed(2)}
                                </span>
                            </div>

                            <div className="mt-4">
                                <Tabs
                                    tabs={[
                                        {
                                            id: 1,
                                            label: "Payment",
                                            content: (
                                                <div className="mt-8 w-1/3">
                                                    <Button
                                                        className="w-full bg-primary-700 text-white"
                                                        size="large"
                                                        onClick={displayRazorpay}
                                                        loading={loading}
                                                        disabled={!isRazorpayReady}
                                                    >
                                                        Pay ${amount?.toFixed(2)}
                                                    </Button>
                                                </div>
                                            ),
                                        },
                                        {
                                            id: 2,
                                            label: "Price Breakdown",
                                            content: (
                                                <div className="mt-8">
                                                    <Table
                                                        size="small"
                                                        pagination={false}
                                                        bordered
                                                        columns={[
                                                            {
                                                                title: "Work",
                                                                dataIndex: "work",
                                                                key: "work",
                                                            },
                                                            {
                                                                title: "Content",
                                                                dataIndex: "content",
                                                                key: "content",
                                                            },
                                                            {
                                                                title: "Files",
                                                                dataIndex: "files",
                                                                key: "files",
                                                                render: (text: any, record: any) => (
                                                                    <div className="flex gap-2">
                                                                        {record.files.map((file: any, index: number) => (
                                                                            <CustomImage
                                                                                key={index}
                                                                                src={file}
                                                                                alt=""
                                                                                className="w-10 h-10 rounded-md object-cover"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                ),
                                                            }
                                                        ]}
                                                        dataSource={paymentDetails?.content.map((item: any) => ({
                                                            key: item.id,
                                                            content: item.work,
                                                            date: new Date(item.createdAt).toLocaleDateString(),
                                                            files: item.files,
                                                        })) || []}
                                                    />
                                                </div>
                                            ),
                                        },
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
