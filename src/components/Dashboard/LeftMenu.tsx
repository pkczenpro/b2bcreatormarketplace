/* eslint-disable @next/next/no-img-element */
import {
  Inbox, Store, Flag, Calendar, AlignCenter, GalleryHorizontal, User,
  BriefcaseBusiness, Bell, LogOut, Menu as BurgerIcon,
  Home,
  LinkIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { Badge, Drawer, Dropdown, Tooltip } from "antd";
import { WandSparkles } from "lucide-react";
import api from "@/utils/axiosInstance";
import CustomImage from "../CustomImage";
import { io } from "socket.io-client";
import moment from "moment";

export const LeftMenu = () => {
  const pathname = usePathname();
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef();

  const getUserDetails = async () => {
    const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "")._id : null;
    if (!userId) return;
    let res = null;
    try {
      res = await api.get(`/users/user`);
      setUserData(res.data);
      setUserType(res.data.userType);
    }
    catch (err) {
      console.log(err);
    }
  }

  const getNotifications = async () => {
    try {
      const res = await api.get(`/notifications`);
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserDetails();
    getNotifications();

    socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!userData?._id) return;

    socketRef.current.emit("join", userData._id);

    socketRef.current.on("newNotification", (data) => {
      console.log("New notification received:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socketRef.current.off("newNotification");
    };
  }, [userData]);


  const handleMarkAsRead = async () => {
    await api.put(`/notifications/mark-read`);
    // setNotifications([]);
  };

  const notificationDropdown = {
    items: notifications.length
      ? [
        {
          key: "notification-list",
          label: (
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.map((item) => (
                <Link
                  key={item._id}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 rounded-lg transition-all"
                  href={item.link}
                >
                  <div className="flex items-start gap-2">
                    <Bell size={16} className="text-primary-700 mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold text-black text-sm">
                        {item.sender?.name || "Someone"}
                      </p>
                      <p className="text-gray-600 text-xs">{item.message}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-gray-400 text-[10px]">
                          {moment(item.createdAt).fromNow()}
                        </p>
                        {item.link && (
                          <LinkIcon size={12} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ),
        },
      ]
      : [
        {
          key: "empty",
          label: (
            <div className="text-center px-4 py-6 text-gray-400 text-sm">
              No Notifications
            </div>
          ),
        },
      ],
  };

  const menuItems = [
    { name: "Home", icon: Home, link: userType === "brand" ? `/dashboard/brand-preview/${userData?._id}` : `/dashboard/user-preview/${userData?._id}` },
    { name: "Inbox", icon: Inbox, link: "/dashboard/inbox" },
    { name: userType === "brand" ? "Brandfront" : "Storefront", icon: Store, link: "/dashboard", underline: true },
    { name: "Campaigns", icon: Flag, link: "/dashboard/campaigns" },
    { name: "Calendar", icon: Calendar, link: "/dashboard/calendar", underline: true },
    {
      name: "AI Text Creator",
      icon: WandSparkles,
      link: "/dashboard/post-maker",
      tooltip: "Generate AI-powered text content effortlessly!",
      color: "#F38509",
    },
    { name: "Carousel Maker", icon: GalleryHorizontal, link: "/dashboard/carousel-maker", underline: true },

    userType === "brand" && { name: "Creators", icon: User, link: "/dashboard/creators" },
    userType === "creator" && { name: "Brands", icon: BriefcaseBusiness, link: "/dashboard/brands" },
  ].filter(Boolean);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const renderMenuItems = () => menuItems.map(({ name, icon: Icon, link, underline, tooltip, color }, index) => (
    <div key={index}>
      <Link href={link} className="w-full">
        <Tooltip title={tooltip} placement="right" arrow={true}>
          <li className={`py-4 rounded-md px-4 cursor-pointer flex items-center font-bold ${pathname === link ? "bg-neutral-50" : ""}`}
            // style={{ color: pathname === link ? "#3B82F6" : color || "#4B5563" }}
            style={{ color: "#3D4350" }}
          >
            <Icon size={20} className="mr-2"
              // style={{ color: pathname === link ? "#3B82F6" : color || "#4B5563" }}
              style={{ color: "#3D4350" }}
            />
            {name}
          </li>
        </Tooltip>
      </Link>
      {underline && <div className="h-[1px] w-full bg-neutral-100 mt-4"></div>}
    </div>
  ));

  return (
    <div className="bg-neutral-50 min-w-[20%] max-w-[20%] w-[20%]">
      {/* Mobile Menu */}
      <div className="sm:hidden bg-white border-b flex p-8 justify-between items-start">
        <BurgerIcon size={24} className="cursor-pointer" onClick={() => setDrawerVisible(true)} />
      </div>

      {/* Drawer for Mobile */}
      <Drawer title={
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">B2B Creator</h1>
          <Dropdown menu={notificationDropdown} placement="bottomRight">
            <Badge count={notifications.filter((item) => !item.isRead).length} size="small" overflowCount={9}>
              <Bell className="cursor-pointer" onClick={handleMarkAsRead} />
            </Badge>
          </Dropdown>
        </div>
      } placement="left" open={drawerVisible} onClose={() => setDrawerVisible(false)} width={300} closable={false} bodyStyle={{ padding: 0 }}>
        <ul className="w-full">{renderMenuItems()}</ul>
        <div className="flex items-center justify-around mt-auto py-8">
          <CustomImage loading="lazy" src="/images/profile.png" alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="flex flex-col">
            <span className="font-bold">{userData?.name}</span>
            <span className="text-xs text-neutral-500">{userData?.email}</span>
          </div>
          <LogOut size={20} className="cursor-pointer" onClick={logout} />
        </div>
      </Drawer>

      {/* Desktop Sidebar */}
      <div className="sm:flex flex-col px-[16px] bg-white border-r border-gray-200 hidden h-[100vh]">
        <div className="py-6 flex items-center justify-between mt-6">
          <h1 className="text-lg font-bold">B2B Creator</h1>
          <Dropdown menu={notificationDropdown} placement="bottomRight">
            <Badge count={notifications.filter((item) => !item.isRead).length} size="small" overflowCount={100}>
              <Bell className="cursor-pointer" onClick={handleMarkAsRead} />
            </Badge>
          </Dropdown>
        </div>
        <div className="flex flex-col items-start h-full">
          <ul className="w-full">{renderMenuItems()}</ul>
        </div>
        <div className="flex items-center justify-around mt-auto py-8">
          <CustomImage loading="lazy" src={
            userData?.profileImage?.includes("http") ?
              userData?.profileImage :
              process.env.NEXT_PUBLIC_SERVER_URL + userData?.profileImage
          } alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="font-bold text-sm">{userData?.name}</span>
            <span className="text-xs text-neutral-500">{userData?.email}</span>
          </div>
          <LogOut size={20} className="cursor-pointer" onClick={logout} />
        </div>
      </div>
    </div>
  );
};
