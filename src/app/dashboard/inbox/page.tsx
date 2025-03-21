/* eslint-disable @next/next/no-img-element */
"use client";

import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import Input from "@/components/Input/Input";
import api from "@/utils/axiosInstance";
import { motion } from "framer-motion";
import { Delete, PaperclipIcon, SendIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { io } from 'socket.io-client';

type Message = {
    from: string;
    text: string;
    isSender: boolean;
};

type Chat = {
    name: string;
    message: string;
    active: string;
    _id: string;
    image: string;
};

export default function Inbox() {
    const [chatList, setChatList] = useState<Chat[]>([]);
    const [userData, setUserData] = useState<any>(null);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const socket = useRef<any>(null); // Initialize socket reference

    console.log(selectedChat)
    // Fetch user and chat data
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/users/creators");
                setChatList(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await api.get("/users/user");
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUsers();
        fetchUserData();
    }, []);

    useEffect(() => {
        // Initialize socket connection
        if (userData) {
            socket.current = io("http://localhost:8000"); // Replace with your Socket.IO server URL

            // Join the room (this could be the user ID or chat ID)
            socket.current.emit("join", userData._id);

            // Listen for new messages
            socket.current.on("message", (newMessage: Message) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            // Clean up socket connection on component unmount
            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                }
            };
        }
    }, [userData]);

    const handleSelectChat = (chat: Chat) => {
        setSelectedChat(chat);
        fetchMessages(chat._id); // Fetch messages for selected chat
    };

    const fetchMessages = async (receiverId: string) => {
        if (!userData) return;

        try {
            const response = await api.get(`/messages?sender=${userData._id}&receiver=${receiverId}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() === "" || !selectedChat) return;

        const newMessage = {
            from: userData._id, // Set actual user data here
            text: message,
            isSender: true,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");

        // Emit message to server via socket.io
        if (socket.current) {
            socket.current.emit("send_message", {
                sender: userData._id, // Set actual sender
                receiver: selectedChat._id,
                message: message,
            });
        }

        try {
            await api.post("/messages", {
                sender: userData._id, // Set actual sender
                receiver: selectedChat._id,
                message: message,
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

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
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="border border-neutral-100 h-[80vh] flex">
                                {/* Left Panel - Chat List */}
                                <div className="w-full md:w-[40%] p-2">
                                    <Input placeholder="Search for a chat" className="w-full mb-4" />
                                    <div className="flex flex-col space-y-2 overflow-y-auto max-h-[70vh]">
                                        {chatList.map((chat, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSelectChat(chat)}
                                                className={`flex items-center space-x-2 border-b border-neutral-100 p-2 cursor-pointer
                ${selectedChat?.name === chat.name ? 'bg-neutral-100' : 'hover:bg-neutral-100'}
                transition-colors duration-200 ease-in-out active:bg-neutral-200`}
                                            >
                                                <img
                                                    loading="lazy"
                                                    src={chat.image}
                                                    alt={chat.name}
                                                    className="w-10 h-10 rounded-full"
                                                />
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
                                    <div className="flex items-center space-x-2 border border-neutral-100 p-4 mb-4 bg-white">
                                        <img
                                            loading="lazy"
                                            src={selectedChat?.image}
                                            alt={selectedChat?.name || "User"}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <h1 className="font-semibold">{selectedChat?.name}</h1>
                                            <p className="text-sm text-neutral-500">{selectedChat?.active}</p>
                                        </div>
                                    </div>

                                    {/* Chat Body */}
                                    <div className="flex flex-col justify-end space-y-2 px-6 h-[60vh] overflow-auto pb-4">
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center space-x-2 ${msg.isSender ? "justify-end" : ""}`}
                                            >

                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        {!msg.isSender && (
                                                            <img
                                                                loading="lazy"
                                                                src={selectedChat?.image}
                                                                alt={selectedChat?.name}
                                                                className="w-8 h-8 rounded-full"
                                                            />
                                                        )}
                                                        <div
                                                            className={`p-2 rounded-md w-full ${msg.isSender ? "bg-primary-600 text-white" : "bg-primary-50 text-neutral-700"}
                              text-wrap break-words`}
                                                        >
                                                            <p className={
                                                                `text-sm ${msg.isSender ? "text-right" : "text-left"}`
                                                            }>{msg.text}</p>
                                                        </div>

                                                    </div>
                                                    <p className={`text-xs text-neutral-500 mt-1
                            ${msg.isSender ? "text-right" : "text-left"}
                                                        `}>
                                                        {new Date().toLocaleTimeString()}
                                                    </p>
                                                </div>


                                            </div>
                                        ))}

                                        {uploadedFiles.length > 0 && (
                                            <div className="flex flex-col space-y-1 mt-2">
                                                {uploadedFiles.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between border border-neutral-100 p-2 rounded-md"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <PaperclipIcon className="w-5 h-5 text-gray-500" />
                                                            <span className="text-sm text-neutral-700">{file.name}</span>
                                                        </div>
                                                        <div>
                                                            <Delete
                                                                className="w-5 h-5 text-red-500 cursor-pointer"
                                                                onClick={() =>
                                                                    setUploadedFiles((prevFiles) =>
                                                                        prevFiles.filter((_, i) => i !== index)
                                                                    )
                                                                }
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
                                        <button
                                            onClick={handleSendMessage}
                                            className="text-blue-500"
                                        >
                                            <SendIcon className="w-6 h-6 text-primary-700 cursor-pointer" />
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
