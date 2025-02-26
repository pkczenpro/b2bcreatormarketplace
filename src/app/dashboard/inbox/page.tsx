"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import Input from "@/components/Input/Input";

type InboxProps = {};

export default function Inbox({ }: InboxProps) {
    // Mocked chat data for dynamic rendering
    const chatList = [
        { name: "John Doe", message: "Hey, how are you?", active: "Active 2m ago" },
        { name: "Jane Smith", message: "Looking forward to our meeting.", active: "Active 5m ago" },
        { name: "Alice Johnson", message: "Can we reschedule?", active: "Active 10m ago" },
    ];

    const messages = [
        { from: "John Doe", text: "Hey, how are you?", isSender: true },
        { from: "Me", text: "I'm good, thank you.", isSender: false },
        { from: "John Doe", text: "How about you?", isSender: true },
        { from: "Me", text: "I'm doing great!", isSender: false },
    ];

    return (
        <div className="flex">
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50">
                <div className="flex flex-col items-center justify-start h-full py-12">
                    <div className="flex flex-col w-full md:w-[90%] px-8 py-8 bg-white rounded-md shadow-sm">
                        <h1 className="text-2xl font-semibold mb-4">Messaging</h1>

                        <div className="border border-neutral-100 min-h-[70vh] flex">
                            {/* Left Panel - Chat List */}
                            <div className="w-full md:w-[30%] p-2">
                                <Input placeholder="Search for a chat" className="w-full mb-4" />

                                <div className="flex flex-col space-y-2">
                                    {chatList.map((chat, index) => (
                                        <div key={index} className="flex items-center space-x-2 border-b border-neutral-100 p-2">
                                            <img src="/images/profile.png" alt={chat.name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <h1 className="font-semibold">{chat.name}</h1>
                                                <p className="text-sm text-neutral-500">{chat.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Panel - Chat Window */}
                            <div className="w-full md:w-[70%] bg-neutral-50">
                                {/* Chat Header */}
                                <div className="flex items-center space-x-2 border-b border-neutral-100 p-4 mb-4 bg-white">
                                    <img src="/images/profile.png" alt="John Doe" className="w-10 h-10 rounded-full" />
                                    <div>
                                        <h1 className="font-semibold">John Doe</h1>
                                        <p className="text-sm text-neutral-500">Active 2m ago</p>
                                    </div>
                                </div>

                                {/* Chat Body */}
                                <div className="flex flex-col space-y-2 px-6">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center space-x-2 ${message.isSender ? "justify-end" : ""}`}
                                        >
                                            {!message.isSender && <img src="/images/profile.png" alt={message.from} className="w-10 h-10 rounded-full" />}
                                            <div
                                                className={`bg-primary-100 p-2 rounded-md max-w-xs ${message.isSender ? "bg-blue-100" : "bg-green-100"
                                                    }`}
                                            >
                                                <p className="text-sm text-neutral-700">{message.text}</p>
                                            </div>
                                            {message.isSender && <img src="/images/profile.png" alt={message.from} className="w-10 h-10 rounded-full" />}
                                        </div>
                                    ))}
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
