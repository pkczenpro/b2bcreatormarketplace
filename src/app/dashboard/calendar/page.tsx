"use client";

import { useState, useEffect } from "react";
import {
    Calendar,
    Badge,
    Modal,
    Form,
    Input,
    DatePicker,
    Button,
    Tooltip,
    Card,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";
import moment from "moment";

interface EventData {
    title: string;
    date: string; // YYYY-MM-DD format
    color: string;
    status: string;
}

interface UserData {
    _id: string;
    calendar: EventData[];
}

export default function CalendarApp() {
    const [events, setEvents] = useState<EventData[]>([]);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [form] = Form.useForm();

    const getUserDetails = async () => {
        try {
            const user = localStorage.getItem("user");
            if (!user) return;
            const userId = JSON.parse(user)._id;
            if (!userId) return;

            const res = await api.get<UserData>(`/users/user`);
            const userData = res.data;

            setUserData(userData);
            const formattedEvents: EventData[] = (userData.calendar || []).map((item) => ({
                title: item.title,
                date: dayjs(item.date).format("YYYY-MM-DD HH:mm:ss"),
                color: item.color,
                status: item.status,
            }));
            setEvents(formattedEvents);
        } catch (err: any) {
            console.error("Error fetching user details:", err);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const handleUserData = async (
        field: string,
        operation: "add" | "update" | "delete",
        itemId: string,
        data: any
    ) => {
        if (!userData?._id) return;

        try {
            const url = `/users/${userData._id}/${field}/${operation}${operation !== "add" ? `/${itemId}` : ""}`;
            const headers = data instanceof FormData
                ? { "Content-Type": "multipart/form-data" }
                : {};

            const res = await api.post(url, data, { headers });
            if (res.data.success) {
                toast.success(res.data.message, { position: "top-center" });
                getUserDetails();
            }
        } catch (err: any) {
            console.error("Error in handleUserData:", err.response?.data || err.message);
        }
    };

    const addEvent = (values: { title: string; date: Dayjs; color: string }) => {
        const newEvent: EventData = {
            title: values.title,
            date: values.date.format("YYYY-MM-DD"),
            color: values.color,
        };
        handleUserData("calendar", "add", "", newEvent);
        setIsModalOpen(false);
        form.resetFields();
    };


    const dateCellRender = (value: Dayjs) => {
        const dateString = value.format("YYYY-MM-DD");
        const dayEvents = events.filter(
            (event) => moment(event.date).format("YYYY-MM-DD") === dateString
        );

        return (
            <div className="space-y-2">
                {dayEvents.map((event, index) => (
                    <Card
                        key={index}
                        size="small"
                        bordered={false}
                        className="!p-2 !bg-white !shadow-md !rounded-md"
                        style={{
                            borderLeft: `4px solid ${event.color}`,
                        }}
                        bodyStyle={{ padding: "8px 12px" }}
                    >
                        <div className="flex justify-between items-start">
                            <Tooltip title={event.title}>
                                <div className="font-semibold text-sm truncate max-w-[100px]">
                                    {event.title}
                                </div>
                            </Tooltip>
                            {event.status && (
                                <Tag
                                    color={
                                        event.status === "posted"
                                            ? "green"
                                            : event.status === "pending"
                                                ? "orange"
                                                : "default"
                                    }
                                    style={{ fontSize: "0.7rem", lineHeight: 1 }}
                                >
                                    {event.status}
                                </Tag>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        );
    };



    const cellRender = (current: Dayjs, info: { type: string; originNode: React.ReactNode }) => {
        if (info.type === "date") return dateCellRender(current);
        return info.originNode;
    };

    const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    useEffect(() => {
        setFilteredEvents(events);
    }, [events]);

    useEffect(() => {
        setFilteredEvents(events.filter((event) => moment(event.date).format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD")));
    }, [selectedDate]);

    return (
        <div className="p-6 sm:p-10 md:p-12 min-h-screen bg-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
                    <ArrowLeft className="mr-2" />
                    <span className="text-xl sm:text-2xl font-semibold">Calendar</span>
                </Link>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    Add Event
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
                    <Calendar cellRender={cellRender} className="rounded-md"
                        onChange={(value) => {
                            setSelectedDate(value);
                        }}
                    />
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                    <div className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Your Events</div>
                    <div className="space-y-3 overflow-auto">
                        {filteredEvents.map((event, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md">
                                <div className="flex items-center space-x-2">
                                    <div
                                        style={{ backgroundColor: event.color }}
                                        className="w-3 h-3 rounded-full"
                                    ></div>
                                    <span className="font-medium">{event.title}</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {moment(event.date).format("DD MMM YYYY hh:mm A")}

                                </span>
                                {event.status === "pending" && <Badge color="orange" text="Pending" />}
                                {event.status === "posted" && <Badge color="green" text="Posted" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                title="Add New Event"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={addEvent}>
                    <Form.Item
                        name="title"
                        label="Event Title"
                        rules={[{ required: true, message: "Please enter event title!" }]}
                    >
                        <Input placeholder="Enter event name" />
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Event Date"
                        rules={[{ required: true, message: "Please select a date!" }]}
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>
                    <Form.Item
                        name="color"
                        label="Event Color"
                        initialValue="#2db7f5"
                    >
                        <Input type="color" className="w-full cursor-pointer" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Add Event
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
