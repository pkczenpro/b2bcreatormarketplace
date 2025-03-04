"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import Input from "@/components/Input/Input";
import { motion } from "framer-motion";
import { Delete, PaperclipIcon, SendIcon } from "lucide-react";
import { useState } from "react";

type Message = {
    from: string;
    text: string;
    isSender: boolean;
};

export default function Inbox() {
    const chatList = [
        { name: "John Doe", message: "Hey, how are you?", active: "Active 2m ago" },
        { name: "Jane Smith", message: "Looking forward to our meeting.", active: "Active 5m ago" },
        { name: "Alice Johnson", message: "Can we reschedule?", active: "Active 10m ago" },
    ];

    // State for messages
    const [messages, setMessages] = useState<Message[]>([
        { from: "John Doe", text: "Hey, how are you?", isSender: true },
        { from: "Me", text: "I'm good, thank you.", isSender: false },
        { from: "John Doe", text: "How about you?", isSender: true },
        { from: "Me", text: "I'm doing great!", isSender: false },
    ]);

    // State for message input
    const [message, setMessage] = useState("");

    // State for file upload
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);


    // Handle sending message
    const handleSendMessage = () => {
        if (message.trim() !== "") {
            setMessages((prevMessages) => [...prevMessages, { from: "Me", text: message, isSender: true }]);
            setMessage("");
        }
    };

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
        }
    };


    return (
        <div className="flex">
            <LeftMenu />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50">
                <div className="flex flex-col items-center justify-start h-full py-6">
                    <div className="flex flex-col w-full md:w-[90%] px-8 py-8 bg-white rounded-md shadow-sm">
                        <h1 className="text-2xl font-semibold mb-4">Messaging</h1>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <div className="border border-neutral-100 min-h-[80vh] flex">
                                {/* Left Panel - Chat List */}
                                <div className="w-full md:w-[40%] p-2">
                                    <Input placeholder="Search for a chat" className="w-full mb-4" />

                                    <div className="flex flex-col space-y-2">
                                        {chatList.map((chat, index) => (
                                            <div key={index} className="
                                                flex items-center space-x-2 border-b border-neutral-100 p-2 cursor-pointer
                                                hover:bg-neutral-100 transition-colors duration-200 ease-in-out
                                                active:bg-neutral-200 transition-colors duration-200 ease-in-out
                                            "

                                            >
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
                                <div className="w-full md:w-[60%] bg-neutral-50 flex flex-col justify-between">
                                    {/* Chat Header */}
                                    <div className="flex items-center space-x-2 border border-neutral-100 p-4 mb-4 bg-white">
                                        <img src="/images/profile.png" alt="John Doe" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <h1 className="font-semibold">John Doe</h1>
                                            <p className="text-sm text-neutral-500">Active 2m ago</p>
                                        </div>
                                    </div>

                                    {/* Chat Body */}
                                    <div className="flex flex-col justify-end space-y-2 px-6 h-[60vh] overflow-auto pb-4">
                                        {messages.map((msg, index) => (
                                            <div key={index} className={`flex items-center space-x-2 ${msg.isSender ? "justify-end" : ""}`}>
                                                <div className={`p-2 rounded-md max-w-xs ${msg.isSender ? "bg-primary-600 text-white" : "bg-primary-50 text-neutral-700"}
                                                        text-wrap break-words
                                                    `}>
                                                    <p className="text-sm">{msg.text}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Display Uploaded File */}
                                        {uploadedFiles.length > 0 && (
                                            <div className="flex flex-col space-y-1 mt-2">
                                                {uploadedFiles.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between border border-neutral-100 p-2 rounded-md">
                                                        <div className="flex items-center space-x-2">
                                                            <PaperclipIcon className="w-5 h-5 text-gray-500" />
                                                            <span className="text-sm text-neutral-700">{file.name}</span>
                                                        </div>
                                                        <div>
                                                            <Delete
                                                                className="w-5 h-5 text-red-500 cursor-pointer"
                                                                onClick={() => setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>

                                    {/* Message Input */}
                                    <div className="flex items-center border-t border-neutral-100 p-4 bg-white">

                                        <input
                                            type="text"
                                            className="flex-1 border border-neutral-300 rounded-md px-4 py-2 mx-2"
                                            placeholder="Type a message..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                        />
                                        <label className="cursor-pointer mr-2">
                                            <PaperclipIcon className="w-6 h-6 text-primary-700" />
                                            <input type="file" className="hidden" onChange={handleFileUpload} />
                                        </label>
                                        <button onClick={handleSendMessage} className="text-blue-500">
                                            <SendIcon
                                                className="w-6 h-6 text-primary-700 cursor-pointer"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
