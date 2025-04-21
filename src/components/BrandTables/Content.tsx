"use client";

import api from "@/utils/axiosInstance";
import { Image, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ContentTable({ campaign, Refresh }) {
    const [contentData, setContentData] = useState([]);

    useEffect(() => {
        if (campaign && campaign.selectedCreators) {
            const filteredContent = campaign.selectedCreators.flatMap((creator) => {
                // Filter content for each creator based on the conditions
                return creator.content.filter(
                    (content) => content.urnli
                );
            });

            // Set the contentData state to the filtered content
            setContentData(filteredContent);
        }
    }, [campaign]);

    const getLinkedInAuthUrl = () => {
        const scopes = ["openid", "profile", "email", "w_member_social"].join(" ");
        const linkedInClientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
        const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
        const redirectUri = `${DOMAIN}/auth/linkedin/access_token_callback`; // Change in production

        localStorage.setItem("lastUrl",
            window.location.href
        );

        return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedInClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    };

    const handleLinkedinAccess = () => {
        const linkedInAuthUrl = getLinkedInAuthUrl();
        window.location.href = linkedInAuthUrl;
    };

    const getAnalytics = async (urnli) => {
        try {
            const res = await api.get(`/campaigns/linkedin-analytics/${urnli}`);
            if (res?.data.error_code === 400) {
                toast.error(res.message, {
                    position: "top-center",
                    description: res.message,
                });
                handleLinkedinAccess();
                return;
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const columns = [
        {
            title: "Content",
            key: "content",
            dataIndex: "content",
        },
        {
            title: "Files",
            key: "files",
            dataIndex: "files",
            render: (text) => {
                return (
                    <div className="flex space-x-2">
                        {text.map((file, index) => {
                            return (
                                <Image
                                    key={index}
                                    src={
                                        file.includes("http")
                                            ? file
                                            : process.env.NEXT_PUBLIC_SERVER_URL + file
                                    }
                                    alt="content"
                                    style={{ width: "50px", height: "50px" }}
                                />
                            );
                        })}
                    </div>
                );
            }
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (text) => {
                return (
                    <div className="border border-primary-700 text-primary-700 text-center rounded-md">
                        {text}
                    </div>
                );
            },
        },

        {
            title: "Created At",
            key: "createdAt",
            dataIndex: "createdAt",
            render: (text) => {
                return new Date(text).toLocaleDateString();
            }
        },

        {
            title: "Actions",
            key: "actions",
            render: (text, record) => {
                return (
                    <div className="flex justify-center space-x-2">
                        <button
                            className="text-primary-700 hover:text-primary-900"
                            onClick={() => {
                                // Handle view post action
                                const url = "https://www.linkedin.com/embed/feed/update/" + record.urnli;
                                window.open(url, "_blank");
                            }}
                        >
                            View Post
                        </button>
                    </div>
                );
            },
        }
    ];

    return (
        <>
            <Table
                tableLayout="fixed"
                size="small"
                columns={columns}
                dataSource={contentData} // Use contentData here
                bordered
                pagination={false}
            />
        </>
    );
}
