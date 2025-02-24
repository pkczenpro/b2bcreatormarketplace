import { Inbox, Store, Flag, Calendar, AlignCenter, GalleryHorizontal, User, BriefcaseBusiness, Home, Bell, LogOut } from "lucide-react";
import React, { useState } from "react";



export const LeftMenu = () => {
    const [active, setActive] = useState(0);

    const menuItems = [
        { name: "Home", icon: <Home size={20} className="mr-2" />, underline: false },
        { name: "Inbox", icon: <Inbox size={20} className="mr-2" />, underline: false },
        { name: "Storefront", icon: <Store size={20} className="mr-2" />, underline: true },
        { name: "Campaigns", icon: <Flag size={20} className="mr-2" />, underline: false },
        { name: "Calendar", icon: <Calendar size={20} className="mr-2" />, underline: true },
        { name: "Text Post Maker", icon: <AlignCenter size={20} className="mr-2" />, underline: false },
        { name: "Carousel Maker", icon: <GalleryHorizontal size={20} className="mr-2" />, underline: true },
        { name: "Creators", icon: <User size={20} className="mr-2" />, underline: false },
        { name: "Brands", icon: <BriefcaseBusiness size={20} className="mr-2" />, underline: false },
    ];

    return (
        <div className="flex flex-col w-[20%] px-[16px] min-h-screen bg-white border-r border-gray-200">
            <div className="py-6 flex items-center justify-between mt-6">
                <h1 className="text-lg font-bold">B2B Creator</h1>
                <Bell size={20} />
            </div>
            <div className="flex flex-col items-start h-full">
                <ul className="w-full">
                    {menuItems.map((item, index) => (
                        <>
                            <li
                                key={index}
                                className={`py-4 rounded-md px-4 cursor-pointer flex items-center font-bold ${active === index ? "bg-neutral-50" : ""}`}
                                onClick={() => setActive(index)}
                            >
                                {item.icon && item.icon}
                                {item.name}
                            </li>
                            {item.underline && <div className="h-[1px] w-full bg-neutral-100 mt-4"></div>}
                        </>
                    ))}
                </ul>
            </div>
            <div className="flex items-center justify-around mt-auto py-8">
                <img src="/images/profile.png" alt="" />
                <div className="flex flex-col">
                    <span className="font-bold">
                        Andrew Bishop
                    </span>
                    <span className="text-xs text-neutral-500">
                        test@example.com
                    </span>
                </div>
                <LogOut
                    size={20}
                    className="cursor-pointer"
                />
            </div>
        </div>
    );
}