/* eslint-disable @next/next/no-img-element */
"use client";

import CustomImage from "@/components/CustomImage";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import Input from "@/components/Input/Input";
import api from "@/utils/axiosInstance";
import { Button, Modal, Select, Tooltip } from "antd";
import { time } from "console";
import { motion } from "framer-motion";
import { Delete, InboxIcon, PaperclipIcon, PlusCircle, SendIcon } from "lucide-react";
import moment from "moment";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { io } from 'socket.io-client';
import { toast } from "sonner";


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

const { Option } = Select;

export default function Inbox() {
    // const [query, setQuery] = useState("");
    const [user_id, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlQuery = new URLSearchParams(window.location.search);
            const user = urlQuery.get("user");
            setUserId(user);
            // setQuery(window.location.search);
        }
    }, []);

    const [chatList, setChatList] = useState<Chat[]>([]);
    const [filteredChatList, setFilteredChatList] = useState<Chat[]>([]);
    const [userData, setUserData] = useState<any>(null);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const socket = useRef<any>(null); // Initialize socket reference
    const chatBodyRef = useRef(null);

    const [message, setMessage] = useState("");
    // Scroll to bottom every time the messages array changes
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    // Fetch user and chat data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get("/users/user");
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []); // Runs only once on mount

    const [contactList, setContactList] = useState<any[]>([]);
    const [filteredContactList, setFilteredContactList] = useState<any[]>([]);
    const fetchContactList = async () => {
        if (!userData) return; // Ensure userData is available before fetching users

        try {
            const resp = await api.get("/messages/contactlist")

            setContactList(resp.data);
            setFilteredContactList(resp.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchChatList = async () => {
        if (!userData) return; // Ensure userData is available before fetching users

        try {
            const resp = await api.get("/messages/chatlist")

            setChatList(resp.data.filter((chat: Chat) => chat._id !== userData._id));
            setFilteredChatList(resp.data.filter((chat: Chat) => chat._id !== userData._id));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }
    useEffect(() => {
        fetchChatList();
        fetchContactList();
    }, [userData]); // Runs when userData updates

    const selectedChatRef = useRef(selectedChat);
    const chatListRef = useRef(chatList);

    useEffect(() => {
        selectedChatRef.current = selectedChat; // Update the ref whenever selectedChat changes
    }, [selectedChat]);

    useEffect(() => {
        chatListRef.current = chatList; // Update the ref whenever chatList changes
    }, [chatList]);

    useEffect(() => {
        if (userData) {
            socket.current = io(process.env.NEXT_PUBLIC_SERVER_URL!);

            socket.current.emit("join", userData._id);

            const audio = new Audio("/assets/notification.mp3");
            socket.current.on("message", (newMessage: Message) => {
                if (newMessage.from === userData._id) return;
                const messageFound = chatListRef.current.find((chat) => chat._id === newMessage.from);
                if (newMessage.from === selectedChatRef.current?._id) {
                    setMessages((prev) => [...prev, {
                        ...newMessage,
                        createdAt: moment(newMessage.createdAt).format("hh:mm A"),
                    }]);
                } else if (
                    messageFound
                ) {
                    setChatList((prev) =>
                        prev.map((chat) =>
                            chat._id === messageFound._id
                                ? {
                                    ...chat,
                                    message: newMessage.text,
                                    timestamp: newMessage.createdAt,
                                    isRead: false,
                                }
                                : chat
                        )
                    );
                    setFilteredChatList((prev) =>
                        prev.map((chat) =>
                            chat._id === messageFound._id
                                ? {
                                    ...chat,
                                    message: newMessage.text,
                                    timestamp: newMessage.createdAt,
                                    isRead: false,
                                }
                                : chat
                        )
                    );
                } else {
                    fetchChatList();
                }
                audio.play().catch((err) => console.log("Audio play error:", err));
            });
            socket.current.on("activeUsers", (users) => {

                setActiveUsers(users);
            });
            return () => {
                socket.current.disconnect();
            };
        }
    }, [userData]);



    const [chatSelectLoading, setChatSelectLoading] = useState(false);
    const handleSelectChat = (chat: Chat) => {
        setSelectedChat(chat);
        fetchMessages(chat._id);
        fetchChatList();
    };

    const fetchMessages = async (receiverId: string) => {
        setChatSelectLoading(true);
        if (!userData) return;
        try {
            const response = await api.get(`/messages?sender=${userData._id}&receiver=${receiverId}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
        setChatSelectLoading(false);
    };

    const handleSendMessage = async () => {
        if (message.trim() === "" || !selectedChat) return;
        const newMessage = {
            from: userData._id,
            text: message,
            isSender: true,
            createdAt: moment().format("hh:mm A"),
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
        try {
            await api.post("/messages", {
                sender: userData._id, // Set actual sender
                receiver: selectedChat._id,
                message: message,
                timestamp: moment().format("hh:mm A"),
            });
            if (chatBodyRef.current) {
                chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
            }
            fetchChatList();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const [search, setSearch] = useState("");
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setFilteredChatList(
            chatList.filter((chat) => chat.name.toLowerCase().includes(e.target.value.toLowerCase()))
        );
    }

    const [addToCampaign, setAddToCampaign] = React.useState(false);
    const [selectedCampaign, setSelectedCampaign] = React.useState(null);
    const [campaigns, setCampaigns] = React.useState<any[]>([]);
    const [creator, setCreator] = React.useState<any>(null);
    const addToCampaignModal = () => {
        if (!creator) return null;
        return (
            <Modal
                title="Add to Campaign"
                open={addToCampaign}
                onCancel={() => setAddToCampaign(false)}
                footer={null}
                width={400}
                centered
            >
                <div className="flex items-center gap-4 bg-neutral-50 p-2 px-4 rounded-xl">
                    <img loading="lazy" src={
                        creator.image?.includes("http")
                            ? creator.image
                            : process.env.NEXT_PUBLIC_SERVER_URL + creator.image
                    } alt=""
                        className="w-12 h-12 rounded-full"
                    />
                    <h2 className="text-md font-bold text-neutral-600">
                        {creator.name}
                    </h2>
                </div>
                <div className="mt-4">
                    <p className="text-neutral-900 text-md mb-2">
                        Select Campaign</p>
                    <Select
                        placeholder="Select Campaign"
                        className="w-full"
                        size="large"
                        onChange={(value) => setSelectedCampaign(value)}
                        value={selectedCampaign}
                    >
                        {campaigns.map((campaign, index) => (
                            <Option key={index} value={campaign._id}>{campaign.title}</Option>
                        ))}
                    </Select>
                </div>
                <div className="mt-4">
                    <Button
                        size="large"
                        className="bg-primary-700 text-white w-full"
                        onClick={() => {
                            AddToCampaign({
                                campaignId: selectedCampaign
                            });
                        }}
                    >
                        Add to Campaign
                    </Button>
                </div>
            </Modal>
        );
    }

    const AddToCampaign = async ({
        campaignId,
    }) => {
        if (creator) {
            try {
                const res = await api.post(`/campaigns/${campaignId}/add`, {
                    creatorId: creator._id
                });
                toast.success("Creator added to campaign successfully.", {
                    position: "top-right",
                    description: `${creator.name} has been added to Campaign` + res.data.title,
                })
                setAddToCampaign(false);
            }
            catch (ex) {
                console.log(ex)
            }
        } else {
            toast.error("Error", {
                position: "top-right",
                description: "Please select a creator to add to the campaign.",
            })
        }
    }

    const getCampaigns = async () => {
        try {
            const res = await api.get("/campaigns/related-cg")
            setCampaigns(res.data)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getCampaigns();
    }, []);

    const [chatListMod, setChatListMod] = React.useState(false);

    const chatListModal = () => {
        return (
            <Modal
                open={chatListMod}
                onCancel={() => setChatListMod(false)}
                footer={null}
                width={400}
                centered
            >
                <div className="flex flex-col items-center gap-4 bg-neutral-50 p-2 px-4 rounded-xl">
                    <InboxIcon className="w-12 h-12 text-primary-700" />
                    <h2 className="text-md font-bold text-neutral-600">
                        Chat List
                    </h2>

                    {contactList.length > 0 ? (
                        <div className="flex flex-col space-y-2 overflow-y-auto max-h-[70vh]">
                            {contactList.map((chat, index) => (
                                <div
                                    key={index}
                                    onClick={() => {

                                        handleSelectChat(chat)
                                        setChatListMod(false);
                                    }}
                                    className={`flex items-center space-x-2 border-b border-neutral-100 p-2 cursor-pointer rounded-md transition-colors duration-200 ease-in-out
                            ${selectedChat?._id === chat._id ? 'bg-neutral-100' : 'hover:bg-neutral-200'}`}
                                >
                                    <CustomImage
                                        loading="lazy"
                                        src={chat?.image?.includes("http") ? chat.image : process.env.NEXT_PUBLIC_SERVER_URL + chat.image}
                                        alt={chat?.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="w-full">
                                        <h1 className="font-semibold text-lg">{chat.name}</h1>
                                        <p className="text-sm text-neutral-500">{chat.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-neutral-500">No chats available</p>
                        </div>
                    )}

                </div>
            </Modal>
        )
    }

    const [activeUsers, setActiveUsers] = useState([]);
    useEffect(() => {
        socket?.current?.on("activeUsers", (users) => {
            setActiveUsers(users);
        });

        return () => {
            socket?.current?.off("activeUsers");
        };
    }, []);


    useEffect(() => {
        if (user_id) {
            const chat = contactList.find((chat) => chat._id === user_id);
            if (chat) {
                setSelectedChat(chat);
                fetchMessages(chat._id);
            }
        }
    }, [user_id, contactList]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {

            const formData = new FormData();
            formData.append("file", file);
            formData.append("sender", userData._id);
            formData.append("receiver", selectedChat?._id);

            try {
                const res = await api.post("/messages/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const newMessage = {
                    from: res.data.sender,
                    text: res.data.message,
                    isSender: res.data.sender === userData._id,
                    createdAt: moment(res.data.timestamp).format("hh:mm A"),
                };
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                fetchChatList();
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    }

    return (
        <div className="flex flex-col md:flex-row">
            {addToCampaignModal()}
            {chatListModal()}
            <LeftMenu className="hidden md:block" />
            <div className="flex flex-col w-full min-h-screen bg-neutral-50 overflow-y-auto">
                <div className="flex flex-col items-center justify-start h-full py-6 px-4">
                    <div className="flex flex-col w-full md:w-[90%] p-4 md:p-8 bg-white rounded-lg shadow-lg">
                        <h1 className="text-3xl font-semibold mb-6">Messaging</h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="border border-neutral-100 min-h-[80vh] flex flex-col md:flex-row">
                                {/* Left Panel - Chat List */}
                                <div
                                    className="w-full md:w-[40%] p-2 border-b md:border-b-0 md:border-r border-neutral-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <Input
                                            placeholder="Search for a chat"
                                            className="w-[100%] border border-neutral-300 rounded-md p-2"
                                            value={search}
                                            onChange={handleSearch}
                                        />

                                        <Tooltip
                                            title="New Chat"
                                            placement="top"
                                            arrowPointAtCenter
                                        >
                                            <Button
                                                onClick={() => {
                                                    setChatListMod(true);
                                                }}
                                                className="bg-primary-600 text-white rounded-md p-2 ml-2"
                                            >
                                                <PlusCircle />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                    <div className="flex flex-col space-y-2 overflow-y-auto max-h-[70vh] custom-scrollbar px-2">
                                        {filteredChatList?.map((chat, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSelectChat(chat)}
                                                className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl border border-transparent transition-all duration-200
        ${selectedChat && selectedChat?._id === chat._id
                                                        ? 'bg-neutral-100 border-neutral-300'
                                                        : 'hover:bg-neutral-100'}`}
                                            >
                                                <div className="relative">
                                                    <CustomImage
                                                        loading="lazy"
                                                        src={chat?.image?.includes("http") ? chat.image : process.env.NEXT_PUBLIC_SERVER_URL + chat.image}
                                                        alt={chat?.name}
                                                        className={`w-12 h-12 rounded-full object-cover
            ${selectedChat && selectedChat?._id === chat._id ? 'ring-2 ring-primary-700' : ''}
            ${activeUsers.find((user => user?.userId === chat._id)) && 'ring-2 ring-green-600'}
            `}

                                                    />
                                                    {activeUsers.find((user => user?.userId === chat._id)) && <div className="w-3 h-3 bg-green-600 rounded-full absolute bottom-0 right-0"></div>}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h1 className="font-semibold text-base text-black truncate">{chat.name}</h1>
                                                    <p className="text-sm text-neutral-500 truncate">{chat.message}</p>
                                                </div>

                                                <p className="text-xs text-neutral-400 whitespace-nowrap">
                                                    {new Date(chat?.timestamp).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}
                                                </p>

                                                {!chat?.isRead && <div className="w-3 h-3 bg-primary-600 rounded-full"></div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Panel - Chat Window */}
                                <div className="w-full md:w-[60%] bg-neutral-50 flex flex-col justify-between flex-1 max-h-[80vh]">
                                    {selectedChat && !chatSelectLoading ? <div className="w-full bg-neutral-50 flex flex-col justify-between flex-1 max-h-[80vh]">
                                        <div
                                            style={{
                                                display: selectedChat ? "flex" : "none",
                                            }}
                                            className="flex items-center justify-between space-x-2 border-b border-neutral-100 p-4 bg-white">
                                            <div className="flex items-center space-x-2">
                                                {selectedChat && <CustomImage
                                                    loading="lazy"
                                                    src={selectedChat?.image?.includes("http") ? selectedChat?.image : process.env.NEXT_PUBLIC_SERVER_URL + selectedChat?.image}
                                                    alt={selectedChat?.name || "User"}
                                                    className="w-12 h-12 rounded-full"
                                                />}
                                                <div>
                                                    <h1 className="font-semibold text-lg">{selectedChat?.name}</h1>
                                                    <p className="text-sm text-neutral-500 flex items-center gap-2">
                                                        {
                                                            activeUsers.find(user => user?.userId === selectedChat._id) &&
                                                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                                        }
                                                        {
                                                            activeUsers.find(user => user?.userId === selectedChat._id)
                                                                ? "Online"
                                                                : `Offline ${getLastSeenText(selectedChat?.lastSeen)}`
                                                        }
                                                    </p>

                                                </div>
                                            </div>
                                            {selectedChat?.userType === "creator" && <div className="ml-auto">
                                                <Button

                                                    onClick={() => {
                                                        setAddToCampaign(true);
                                                        setCreator(selectedChat);
                                                    }}
                                                    className="bg-primary-600 text-white rounded-md px-4 py-2 flex items-center space-x-2">
                                                    Invite to a campaign
                                                </Button>
                                            </div>}
                                        </div>

                                        {/* Chat Body */}
                                        <div className="flex-1 overflow-y-auto p-4" ref={chatBodyRef}>
                                            <div className="flex flex-col justify-end space-y-2">
                                                {messages.map((msg, index) => (
                                                    <div key={index} className={`flex items-start space-x-2 ${msg.isSender ? "justify-end" : ""}`}>
                                                        {/* Sender or receiver profile image */}
                                                        {!msg.isSender && (
                                                            <CustomImage
                                                                loading="lazy"
                                                                src={selectedChat?.image?.includes("http") ? selectedChat?.image : process.env.NEXT_PUBLIC_SERVER_URL + selectedChat?.image}
                                                                alt={selectedChat?.name}
                                                                className="w-10 h-10 rounded-full"
                                                            />
                                                        )}
                                                        {/* Message bubble */}
                                                        <div className={`flex flex-col ${msg.isSender ? "items-end" : "items-start"} w-full`}>
                                                            <div
                                                                className={`p-3 rounded-md ${msg.isSender ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-700"
                                                                    } max-w-[75%] break-words`}
                                                            >
                                                                {/* If it's a link */}
                                                                {msg.text.includes("http") ? (
                                                                    <>
                                                                        {/* If it's an image */}
                                                                        {/\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(msg.text) && (
                                                                            <a href={msg.text} target="_blank" rel="noopener noreferrer">
                                                                                <img
                                                                                    src={msg.text}
                                                                                    alt="Image"
                                                                                    className="w-full h-auto rounded-md"
                                                                                />
                                                                            </a>
                                                                        )}

                                                                        {/* If it's a video */}
                                                                        {/\.(mp4|webm|ogg)$/i.test(msg.text) && (
                                                                            <video controls className="w-full h-auto rounded-md">
                                                                                <source src={msg.text} type="video/mp4" />
                                                                                Your browser does not support the video tag.
                                                                            </video>
                                                                        )}

                                                                        {/* If it's a PDF */}
                                                                        {/\.pdf$/i.test(msg.text) && (
                                                                            <a
                                                                                href={msg.text}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-600 underline"
                                                                            >
                                                                                📄 View PDF
                                                                            </a>
                                                                        )}

                                                                        {/* Other file types */}
                                                                        {!/\.(jpeg|jpg|gif|png|webp|bmp|mp4|webm|ogg|pdf)$/i.test(msg.text) && (
                                                                            <a
                                                                                href={msg.text}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-600 underline"
                                                                            >
                                                                                📎 Open File
                                                                            </a>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    // Plain text
                                                                    msg.text
                                                                )}
                                                            </div>

                                                            <p className={`text-xs text-neutral-500 mt-1 ${msg.isSender ? "text-right" : "text-left"}`}>
                                                                {msg.createdAt}
                                                            </p>

                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Message Input */}
                                        {selectedChat && <div className="flex items-center border-t border-neutral-100 p-4 bg-white">
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
                                                <SendIcon className="w-6 h-6 text-primary-700 cursor-pointer" />
                                            </button>
                                        </div>}
                                    </div> :
                                        <div className="flex items-center justify-center h-full">
                                            <p className="text-neutral-500">
                                                {chatSelectLoading ? "Loading..." : "Select a chat to start messaging."}
                                            </p>
                                        </div>
                                    }
                                </div>


                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>


    );
}


const getLastSeenText = (lastSeen) => {
    if (!lastSeen) return "";

    const now = moment();
    const seen = moment(lastSeen);

    if (now.diff(seen, 'days') === 0) {
        return `- Last seen: Today at ${seen.format("hh:mm A")}`;
    } else if (now.diff(seen, 'days') === 1) {
        return `- Last seen: Yesterday at ${seen.format("hh:mm A")}`;
    } else if (now.diff(seen, 'months') === 0) {
        return "- Last seen: " + seen.format("MMM D [at] hh:mm A");
    } else if (now.diff(seen, 'years') === 0) {
        return "- Last seen: " + seen.format("MMM D [at] hh:mm A");
    } else {
        return "- Last seen: " + seen.format("MMM D, YYYY [at] hh:mm A");
    }
};