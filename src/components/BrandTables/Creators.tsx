/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/utils/axiosInstance";
import { Table, Button, Dropdown, Space, Input, Modal, Rate, Image, Popconfirm } from "antd";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner"


export function CreatorTable({
    campaign,
    Refresh
}) {
    const [reviewModal, setReviewModal] = useState(false);

    const dt = campaign?.selectedCreators || [];

    const creators = dt.map((creator) => ({
        key: creator?.creatorId._id,
        name: creator?.creatorId.name,
        status: creator?.status,
        amount: creator?.amount,
        approved: creator?.approved,
        profilePicture: creator?.creatorId.profileImage,
        content: creator?.content,
    }));

    const [selectedCreator, setSelectedCreator] = useState(null);
    const [reviewState, setReviewState] = useState({
        rating: 0,
        review: "",
    });
    const postReview = async () => {
        try {
            await api.post(`/campaigns/${campaign._id}/creators/${selectedCreator.key}/rate`, reviewState);
            toast.success("Review posted successfully", {
                position: "top-right",
            });
            setReviewModal(false);
            setReviewState({
                rating: 0,
                review: "",
            });
        } catch (error) {
            console.log(error);
        }
    }
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
                <img
                    className="w-12 h-12 rounded-full"
                    loading="lazy" src={selectedCreator?.profilePicture?.includes("http")
                        ? selectedCreator?.profilePicture
                        : process.env.NEXT_PUBLIC_SERVER_URL + selectedCreator?.profilePicture}
                    alt="" />
                <h2 className="text-md font-bold text-neutral-600">
                    {selectedCreator?.name}
                </h2>
            </div>
            <div className="mt-4">
                <p className="text-neutral-900 text-md mb-2">
                    Rating</p>
                <Rate
                    count={10}
                    value={reviewState.rating}
                    onChange={(value) => setReviewState({ ...reviewState, rating: value })}
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
                    value={reviewState.review}
                    onChange={(e) => setReviewState({ ...reviewState, review: e.target.value })}
                />
            </div>
            <div className="mt-4">
                <Button
                    size="large"
                    className="bg-primary-700 text-white w-full"
                    onClick={postReview}
                >
                    Post Review
                </Button>
            </div>
        </Modal>
    );

    const deleteCampaign = async (id: string) => {
        try {
            await api.delete(`/campaigns/${campaign._id}/creators/${id}`);
            toast.success("Creator removed from campaign successfully", {
                position: "top-right",
            })
            Refresh();
        } catch (error) { console.log(error) }
    }
    const acceptCreatorRequest = async (id: string) => {
        try {
            await api.put(`/campaigns/${campaign._id}/creators/${id}/approved`);
            toast.success("Creator request accepted successfully", {
                position: "top-right",
            })
            Refresh();
        }
        catch (error) { console.log(error) }
    }

    const columns = [
        {
            title: "Creator Name",
            dataIndex: "name",
            key: "name",
            render: (_, record) => (
                <div className="flex items-center gap-4">
                    <img
                        src={record?.profilePicture?.includes("http")
                            ? record?.profilePicture
                            : process.env.NEXT_PUBLIC_SERVER_URL + record?.profilePicture}
                        alt=""
                        className="w-8 h-8 rounded-full"
                    />
                    <p className="text-sm font-bold text-neutral-900">
                        {record.name}
                    </p>
                </div>
            ),
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
            title: "Status",
            key: "action",
            render: (_, record) => (
                <>
                    {!record.approved ?
                        <div className="flex items-center">
                            <Button
                                type="primary"
                                size="small"
                                className="mr-4"
                                onClick={() => acceptCreatorRequest(record.key)}
                            >
                                Accept Request
                            </Button>
                        </div>
                        : <div className="flex items-center">
                            {record.content.length > 0 && record.status === "pending" && <>
                                <Button
                                    type="primary"
                                    size="small"
                                    className="mr-4"
                                    onClick={() => {
                                        setContentData(record);
                                        setViewContentModal(true);
                                    }}
                                >
                                    View Post
                                </Button>
                            </>}

                            {record.status === "done" && <Link href={`/dashboard/pay-creator/${record.key}`}>
                                <Button
                                    type="primary"
                                    size="small"
                                    className={`${record.key % 2 !== 0 ? "bg-green-500" : ""}`}
                                >
                                    {record.key % 2 === 0 ? "Approve Content" : "Make Payment"}
                                </Button>
                            </Link>}
                        </div>}
                </>

            ),
        },
        {
            title: "",
            render: (_, record) => (
                <div>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: "1",
                                    label: "View Storefront",
                                    onClick: () => {
                                        window.open(`/dashboard/user-preview/${record.key}`, "_blank");
                                    },
                                },
                                {
                                    key: "2",
                                    label: "Leave a Review",
                                    onClick: () => {
                                        setReviewModal(true);
                                        setSelectedCreator(record);
                                    },
                                },
                                {
                                    key: "3",
                                    label: "Remove from Campaign",
                                    style: { color: "red" },
                                    onClick: () => deleteCampaign(record.key),
                                },
                            ].filter(Boolean),
                        }}
                        overlayStyle={{ width: 200 }}>
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

    const [viewContentModal, setViewContentModal] = useState(false);
    const [contentData, setContentData] = useState(null);

    console.log(contentData);

    const acceptWork = async (id: string) => {
        try {
            await api.post(`/campaigns/${campaign._id}/creators/${contentData.key}/accept`, {
                contentId: id
            });
            toast.success("Work accepted successfully", {
                position: "top-right",
            })
            Refresh();
        }
        catch (error) { console.log(error) }
    }

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




            <Modal
                title={<h2 className="text-lg font-semibold text-gray-800">View Content</h2>}
                open={viewContentModal}
                onCancel={() => setViewContentModal(false)}
                footer={null}
                width={"60%"}
                centered
            >
                <div className="space-y-4">
                    {contentData?.content.map((content, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm relative">
                            <Popconfirm
                                title={<span className="text-gray-800 font-medium">Are you sure you want to approve this content? It will be shared on LinkedIn.</span>}
                                onConfirm={() => {
                                    setViewContentModal(false);
                                    acceptWork(content._id);
                                }}
                                okText="Yes, Approve"
                                cancelText="Cancel"
                            >
                                <Button
                                    className="absolute top-2 right-2"
                                    size="small"
                                    disabled={contentData?.status === "done"}
                                >
                                    Approve
                                </Button>
                            </Popconfirm>

                            <ul className="space-y-2 text-gray-700">

                                <li>
                                    <span className="font-medium text-gray-900">Content Type:</span> {content?.type || "N/A"}
                                </li>
                                <li>
                                    <span className="font-medium text-gray-900">Content:</span>
                                    <span className="block mt-1 text-gray-700 whitespace-pre-line">
                                        {content?.content || "N/A"}
                                    </span>
                                </li>
                                <li className="font-medium text-gray-900">Files:</li>
                                <ul className="mt-2 space-y-2 flex overflow-x-auto max-w-[400px]">
                                    {Array.isArray(content?.files) && content.files.length > 0 ? (
                                        content.files.map((file, index) => (
                                            <li key={index} className="overflow-hidden">
                                                <Image
                                                    src={
                                                        file.includes("http")
                                                            ? file
                                                            : process.env.NEXT_PUBLIC_SERVER_URL + file
                                                    }
                                                    alt={`file-${index}`}
                                                    style={{ width: 100, height: "auto" }}
                                                />
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">No files available</li>
                                    )}
                                </ul>
                            </ul>
                        </div>
                    ))}
                </div>
            </Modal>


        </>
    );
}

