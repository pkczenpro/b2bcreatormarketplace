/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/utils/axiosInstance";
import { Table, Button, Dropdown, Space, Input, Modal, Rate } from "antd";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner"




export function CreatorTable({ campaign }) {
    const [reviewModal, setReviewModal] = useState(false);
    const dt = campaign?.selectedCreators || [];
    const creators = dt.map((creator) => ({
        key: creator?.creatorId._id,
        name: creator?.creatorId.name,
        status: creator?.status,
        amount: creator?.amount,
    }));
    const reviewModalComponent = (
        <Modal
            title="Rate and Review"
            open={reviewModal}
            onCancel={() => setReviewModal(false)}
            footer={null}
            width={400}
            centered
        >
            <div className="flex items-center gap-4 bg-neutral-50 p-2 px-4 rounded-xl">
                <img loading="lazy" src="/images/profile.png" alt="" />
                <h2 className="text-md font-bold text-neutral-600">
                    Tony Dunbar
                </h2>
            </div>
            <div className="mt-4">
                <p className="text-neutral-900 text-md mb-2">
                    Rating</p>
                <Rate
                    count={10}
                    defaultValue={5}
                    style={{ fontSize: 20 }}
                    allowClear
                    allowHalf
                />
            </div>
            <div className="mt-4">
                <p className="text-neutral-900 text-md mb-2">
                    Label</p>
                <Input.TextArea
                    placeholder="Write your review here"
                    rows={4}
                    className="w-full"
                />
            </div>
            <div className="mt-4">
                <Button
                    size="large"
                    className="bg-primary-700 text-white w-full"
                >
                    Post Review
                </Button>
            </div>
        </Modal>
    );
    const deleteCampaign = (id: string) => {
        toast.error("Creator can’t be removed", {
            position: "top-right",
            description: "Creator can’t be removed until completed work are paid.",
        })
    }
    const columns = [
        {
            title: "Creator Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Amount ($)",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Actions",
            key: "action",
            render: (_, record) => (
                <div className="flex items-center">
                    <Button
                        type="primary"
                        size="small"
                        className="mr-4"
                    >
                        View Post
                    </Button>

                    <Link href={`/dashboard/pay-creator/${record.key}`}>
                        <Button
                            type="primary"
                            size="small"
                            className={`${record.key % 2 !== 0 ? "bg-green-500" : ""}`}
                        >
                            {record.key % 2 === 0 ? "Approve Content" : "Make Payment"}
                        </Button>
                    </Link>
                </div>

            ),
        },
        {
            title: "",
            render: () => (
                <div>
                    <Dropdown menu={{
                        items: [
                            {
                                key: "1",
                                label: "View Storefront",
                            },

                            // if creator is a partnered creator
                            {
                                key: "2",
                                label: "Leave a Review",
                                onClick: () => setReviewModal(true),
                            },
                            {
                                key: "3",
                                label: "Remove from Campaign",
                                style: { color: "red" },
                                onClick: () => deleteCampaign("1"),
                            },

                        ]
                    }} overlayStyle={{ width: 200 }}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space className="cursor-pointer">
                                <EllipsisVertical style={{ fontSize: "16px", color: "#555" }} />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            )
        }
    ];

    return (
        <>
            <Table
                size="small"
                columns={columns}
                dataSource={creators}
                bordered
                pagination={false}
                footer={() => (
                    <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>
                            ${creators.reduce((sum, creator) => sum + creator.amount, 0)}
                        </span>
                    </div>
                )}
            />
            {reviewModalComponent}
        </>
    );
}

