"use client";

import { useState, useEffect } from "react";
import { Calendar, Badge, Modal, Form, Input, DatePicker, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";

export default function CalendarApp() {
    const [events, setEvents] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const getUserDetails = async () => {
        try {
            const user = localStorage.getItem("user");
            if (!user) return;
            const userId = JSON.parse(user)._id;
            if (!userId) return;

            const res = await api.get(`/users/user`);
            setUserData(res.data);
            setEvents(res.data.calendar.map((item) => {
                return {
                    title: item.title,
                    date: dayjs(item.date).format("YYYY-MM-DD"),
                    color: item.color
                };
            }) || []);
        } catch (err) {
            console.error("Error fetching user details:", err);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const handleUserData = async (field, operation, itemId, data) => {
        if (!userData?._id) return;

        try {
            const url = `/users/${userData._id}/${field}/${operation}${operation !== "add" ? `/${itemId}` : ""}`;
            const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};

            const res = await api.post(url, data, { headers });
            if (res.data.success) {
                toast.success(res.data.message, { position: "top-center" });
            }
            getUserDetails();
        } catch (err) {
            console.error("Error in handleUserData:", err.response?.data || err.message);
        }
    };

    const addEvent = (values) => {
        const newEvent = {
            title: values.title,
            date: values.date.format("YYYY-MM-DD"),
            color: values.color,
        };
        handleUserData("calendar", "add", "", newEvent);
        setIsModalOpen(false);
        form.resetFields();
    };

    const dateCellRender = (value) => {
        const dateString = value.format("YYYY-MM-DD");
        console.log(events)
        const dayEvents = events.filter(event => event.date === dateString);
        return (
            <ul className="events">
                {dayEvents.map((event, index) => (
                    <li key={index} style={{ backgroundColor: event.color }} className="mb-1">
                        <Badge color={event.color} text={event.title} />
                    </li>
                ))}
            </ul>
        );
    };

    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        // if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    };

    return (
        <div className="p-12 min-h-screen bg-gray-100">
            <div className="flex justify-between items-center mb-4">
                <Link href="/dashboard" className="flex items-center">
                    <ArrowLeft className="cursor-pointer" />
                    <h1 className="text-2xl font-semibold">Calendar</h1>
                </Link>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    Add Event
                </Button>
            </div>
            <div className="flex space-x-4 bg-white p-6">
                <div className="w-2/3 bg-neutral-50 rounded-md">
                    <Calendar cellRender={cellRender} className="bg-neutral-50 p-3 rounded-lg" />
                </div>
                <div className="p-6 rounded-lg w-1/3">
                    <div className="text-xl text-white p-4 rounded-md font-semibold mb-4 bg-cyan-600">
                        Schedule
                    </div>
                    <div>
                        {events.map((event, index) => (
                            <div key={index} className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div style={{ backgroundColor: event.color }} className="w-2 h-2 rounded-full"></div>
                                    <span>{event.title}</span>
                                </div>
                                <span>{dayjs(event.date).format("DD MMM YYYY")}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Add Event Modal */}
            <Modal title="Add New Event" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={addEvent}>
                    <Form.Item name="title" label="Event Title" rules={[{ required: true, message: "Please enter event title!" }]}>
                        <Input placeholder="Enter event name" />
                    </Form.Item>
                    <Form.Item name="date" label="Event Date" rules={[{ required: true, message: "Please select a date!" }]}>
                        <DatePicker className="w-full" />
                    </Form.Item>
                    <Form.Item name="color" label="Event Color" initialValue="#0000ff">
                        <Input type="color" className="w-full cursor-pointer" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">Add Event</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
