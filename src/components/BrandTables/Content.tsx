"use client";

import { Button, Table } from "antd";

export function ContentTable() {
    const columns = [
        {
            title: "Content",
            dataIndex: "content",
            key: "content",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (text: string) => {
                return (
                    <div className="border border-primary-700 text-primary-700 text-center rounded-md w-16">
                        {text}
                    </div>
                )
            }
        },
        {
            title: "Likes",
            dataIndex: "likes",
            key: "likes",
        },
        {
            title: "Comments",
            dataIndex: "comments",
            key: "comments",
        },
        {
            title: "Shares",
            dataIndex: "shares",
            key: "shares",
        },
        {
            title: "Reach",
            dataIndex: "reach",
            key: "reach",
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
                    <Button
                        type="primary"
                        size="small"
                        danger
                    // onClick={() => deleteCampaign(record.key)}
                    >
                        Delete
                    </Button>
                </div>
            )
        }
    ];

    const content = [
        {
            key: "1",
            content: "Example Text Content",
            type: "Text",
            likes: 100,
            comments: 50,
            shares: 20,
            reach: 200
        },
        {
            key: "2",
            content: "Example Text Content",
            type: "Video",
            likes: 100,
            comments: 50,
            shares: 20,
            reach: 200
        },
        {
            key: "3",
            content: "Example Text Content",
            type: "Image",
            likes: 100,
            comments: 50,
            shares: 20,
            reach: 200
        },
        {
            key: "4",
            content: "Example Text Content",
            type: "Text",
            likes: 100,
            comments: 50,
            shares: 20,
            reach: 200
        },
        {
            key: "5",
            content: "Example Text Content",
            type: "Video",
            likes: 100,
            comments: 50,
            shares: 20,
            reach: 200
        },
        {
            key: "6",
            content: "Example Text Content",
            type: "Image",
            likes: 100,
            comments: 50,
            shares: 20,
            reach: 200
        },
        {
            key: "7",
            content: "Example Text Content",
            type: "Text",
            likes: 100,
            comments: 50,
            shares: 20,
            reach: 200
        },
        {
            key: "8",
            content: "Example Text Content",
            type: "Video",
            likes: 100,
            comments: 50,
            shares: 20,
            reach: 200
        },
    ];

    return (
        <>
            <Table
                tableLayout="fixed"
                size="small"
                columns={columns}
                dataSource={content}
                bordered
                pagination={false}
            />
        </>
    );
}

