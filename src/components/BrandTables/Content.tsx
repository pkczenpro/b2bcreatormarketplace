"use client";

import { useEffect, useState } from "react";
import { Table, Image, TableProps } from "antd";

type Content = {
    urnli: string;
    content: string;
    files: string[];
    type: string;
    createdAt: string;
};

type Creator = {
    content?: Content[];
};

type Campaign = {
    selectedCreators?: Creator[];
};

interface ContentTableProps {
    campaign?: Campaign;
    Refresh?: () => void;
}

export function ContentTable({ campaign }: ContentTableProps) {
    const [contentData, setContentData] = useState<Content[]>([]);

    useEffect(() => {
        if (campaign?.selectedCreators) {
            const filteredContent = campaign.selectedCreators.flatMap(
                (creator) => creator.content?.filter((content) => content.urnli) || []
            );
            setContentData(filteredContent);
        }
    }, [campaign]);

    const columns: TableProps<Content>["columns"] = [
        {
            title: "Content",
            dataIndex: "content",
            key: "content",
        },
        {
            title: "Files",
            dataIndex: "files",
            key: "files",
            render: (files: string[] = []) => (
                <div className="flex space-x-2">
                    {files.map((file, index) => (
                        <Image
                            key={index}
                            src={
                                file.startsWith("http")
                                    ? file
                                    : process.env.NEXT_PUBLIC_SERVER_URL + file
                            }
                            alt="content"
                            style={{ width: "50px", height: "50px" }}
                        />
                    ))}
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type: string) => (
                <div className="border border-primary-700 text-primary-700 text-center rounded-md">
                    {type}
                </div>
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex justify-center space-x-2">
                    <button
                        className="text-primary-700 hover:text-primary-900"
                        onClick={() =>
                            window.open(
                                `https://www.linkedin.com/embed/feed/update/${record.urnli}`,
                                "_blank"
                            )
                        }
                    >
                        View Post
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Table
            tableLayout="fixed"
            size="small"
            columns={columns}
            dataSource={contentData}
            bordered
            pagination={false}
            rowKey={(record) => record?.urnli}
        />
    );
}
