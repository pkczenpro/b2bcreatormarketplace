/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/utils/axiosInstance";
import { Table, Button, Dropdown, Space, Input, Modal, Rate, Image, Popconfirm, Spin, Alert } from "antd";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner"
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from 'next/navigation';

export function CreatorTable({
    campaign,
    Refresh
}) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [reviewModal, setReviewModal] = useState(false);

    const dt = campaign?.selectedCreators || [];

    const creators = dt.map((creator, index) => ({
        _id: creator?.creatorId._id,
        key: index,
        name: creator?.creatorId.name,
        email: creator?.creatorId.email,
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
            await api.post(`/campaigns/${campaign._id}/creators/${selectedCreator._id}/rate`, reviewState);
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
        setLoading(true);
        try {
            await api.delete(`/campaigns/${campaign._id}/creators/${id}`);
            toast.success("Creator removed from campaign successfully", {
                position: "top-right",
            })
            Refresh();
        } catch (error) { console.log(error) }
        finally {
            setLoading(false);
        }
    }
    const acceptCreatorRequest = async (id: string) => {
        setLoading(true);
        try {
            await api.put(`/campaigns/${campaign._id}/creators/${id}/approved`);
            toast.success("Creator request accepted successfully, content shared on LinkedIn", {
                position: "top-right",
            })
            Refresh();
        }
        catch (error) { console.log(error) }
        finally {
            setLoading(false);
        }
    }

    const columns = [
        {
            title: "Creator Name",
            dataIndex: "name",
            key: "name",
            render: (_, record) => (
                <Link
                    href={`/dashboard/user-preview/${record._id}`}
                    target="_blank"
                    className="flex items-center gap-4">
                    <img
                        src={record?.profilePicture?.includes("http")
                            ? record?.profilePicture
                            : process.env.NEXT_PUBLIC_SERVER_URL + record?.profilePicture}
                        alt=""
                        className="w-8 h-8 rounded-full"
                    />
                    <p className="text-sm font-bold text-neutral-900 hover:underline">
                        {record.name}
                    </p>
                </Link>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
                <div className="flex items-center">
                    <p className="text-sm font-bold text-neutral-900">
                        {(() => {
                            const statusMap = {
                                pending: "Application Under Review",
                                approved: "Approved!, Waiting for Content",
                                rejected: "Not Selected",
                                done: "Campaign Completed, Waiting for Payment",
                                prospect: "In Consideration",
                                content_submitted: "Content Submitted, Waiting for Approval"
                            } as const;
                            return statusMap[record.status as keyof typeof statusMap] || record.status;
                        })()}
                    </p>
                </div>
            ),
        },
        {
            title: "Amount ($)",
            dataIndex: "amount",
            key: "amount",
            render: (_, record) => {
                return (
                    <p className="text-sm font-bold text-neutral-900">
                        {record?.amount?.toFixed(2)} USD
                    </p>
                )
            },
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => {
                const isPending = record.status === "pending" || record.status === "prospect";
                const isDone = record.status === "done";
                const isContentSubmitted = record.status === "content_submitted";
                const hasContent = record.content?.length > 0;

                const invoiceId = record?.invoiceId;

                const isAmountSet = record?.amount > 0;

                return (
                    <div className="flex items-center">
                        {isPending && (
                            <Button
                                type="primary"
                                size="small"
                                className="mr-4"
                                onClick={() => acceptCreatorRequest(record._id)}
                            >
                                Accept Request
                            </Button>
                        )}

                        {hasContent && isContentSubmitted && (
                            <Button
                                type="primary"
                                size="small"
                                className="mr-4"
                                onClick={() => {
                                    setContentData(record);
                                    setViewContentModal(true);
                                }}
                            >
                                View Submitted Content
                            </Button>
                        )}

                        {isDone && isAmountSet && (
                            <Button
                                onClick={() => {
                                    if (record?.amount) {
                                        router.push(`/dashboard/pay-creator/${campaign._id}?creator=${record._id}&&invoiceId=${invoiceId}`);
                                    }
                                    else {
                                        toast.error("No amount specified for this creator", {
                                            position: "top-right",
                                        })
                                        setAmountModal(true);
                                        setContentData(record);
                                    }
                                }}
                                type="primary"
                                size="small"
                                className={"bg-green-500"}
                            >
                                Make Payment
                            </Button>
                        )}

                        {isDone && !isAmountSet && (
                            <Button
                                onClick={() => {
                                    setAmountModal(true);
                                    setContentData(record);
                                }}
                                type="primary"
                                size="small"
                                className={"bg-green-500"}
                            >
                                Set Amount
                            </Button>
                        )}
                    </div>
                );
            },
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
                                        window.open(`/dashboard/user-preview/${record._id}`, "_blank");
                                    },
                                },
                                record?.creatorId?.reviews?.length === 0 && {
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
                                    onClick: () => deleteCampaign(record._id),
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



    const acceptWork = async (id: string) => {
        setLoading(true);
        try {
            await api.post(`/campaigns/${campaign._id}/creators/${contentData._id}/accept`, {
                contentId: id
            });
            toast.success("Work accepted successfully", {
                position: "top-right",
            })
            Refresh();
        }
        catch (error) { console.log(error) }
        finally {
            setLoading(false);
        }
    }


    const [newAmount, setNewAmount] = useState(0);
    const giveAmount = async () => {
        setLoading(true);
        try {
            await api.put(`/campaigns/${campaign._id}/creators/${contentData._id}/update-amount`, {
                amount: newAmount
            });
            toast.success("Work accepted successfully", {
                position: "top-right",
            })
            Refresh();
        }
        catch (error) { console.log(error) }
        finally {
            setAmountModal(false);
            setLoading(false);
        }
    }

    const [amountModal, setAmountModal] = useState(false);

    const modalOfAmount = (
        <Modal
            title="Set Amount"
            open={amountModal}
            onCancel={() => setAmountModal(false)}
            footer={null}
            width={400}
            centered
        >
            <div className="flex items-center gap-4 bg-neutral-50 p-2 px-4 rounded-xl">
                <h2 className="text-md font-bold text-neutral-600">
                    {contentData?.name}
                </h2>
            </div>
            <Alert
                message="No amount specified for this creator. Please enter the amount to proceed with payment."
                type="warning"
                showIcon
                className="mt-4"
            />
            <div className="mt-4">
                <p className="text-neutral-900 text-md mb-2">
                    Amount</p>
                <Input
                    placeholder="Enter amount"
                    type="number"
                    className="w-full"
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                />
            </div>

            <div className="mt-4">
                <Button
                    size="large"
                    className="bg-primary-700 text-white w-full"
                    onClick={() => {
                        giveAmount();

                    }}
                >
                    Set Amount
                </Button>
            </div>
        </Modal>
    )

    return (
        <>
            {loading && <div className="flex justify-center items-center h-screen">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </div>}

            {modalOfAmount}

            <Table
                style={{ width: "100%" }}
                size="small"
                columns={columns}
                tableLayout="auto"
                dataSource={creators}
                key="rowKey"
                bordered
                pagination={false}
                footer={() => (
                    <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>
                            ${creators.reduce((sum, creator) => sum + creator.amount || 0, 0).toFixed(2)}
                        </span>
                    </div>
                )}
                expandable={{
                    expandedRowRender: (record) => (
                        <div className="flex flex-col gap-4">
                            <pre>
                                {JSON.stringify(record, null, 2)}
                            </pre>
                        </div>
                    ),
                }}
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
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {contentData?.content.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((content, index) => (
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
                                {content?.type && < li >
                                    <span className="font-medium text-gray-900">Content Type:</span> {content?.type}
                                </li>}
                                {content?.content && <li>
                                    <span className="font-medium text-gray-900">Content:</span>
                                    <span className="block mt-1 text-gray-700 whitespace-pre-line">
                                        {content?.content}
                                    </span>
                                </li>}
                                {content.files.length > 0 && <>
                                    <li className="font-medium text-gray-900">Files:</li>
                                    <ul className="mt-2 flex max-w-[400px] overflow-x-auto space-x-3 pb-2">
                                        {Array.isArray(content?.files) && content.files.length > 0 ? (
                                            content.files.map((file, index) => (
                                                <li key={index} className="flex-shrink-0">
                                                    <Image
                                                        src={
                                                            file.includes("http")
                                                                ? file
                                                                : process.env.NEXT_PUBLIC_SERVER_URL + file
                                                        }
                                                        alt={`file-${index}`}
                                                        width={100}
                                                        height={100}
                                                        className="rounded-md shadow object-cover"
                                                    />
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-gray-500">No files available</li>
                                        )}
                                    </ul>
                                </>}

                            </ul>
                        </div>
                    ))}
                </div>
            </Modal >
        </>
    );
}

