/* eslint-disable @next/next/no-img-element */
import {
  Inbox,
  Store,
  Flag,
  Calendar,
  AlignCenter,
  GalleryHorizontal,
  User,
  BriefcaseBusiness,
  Bell,
  LogOut,
  Menu as BurgerIcon,
  X as CloseIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Drawer, Button } from "antd"; // Importing Ant Design Drawer and Button

export const LeftMenu = () => {
  const pathname = usePathname();
  const userType = localStorage.getItem("userType");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false); // For controlling Drawer visibility

  const menuItems = [
    {
      name: "Inbox",
      icon: <Inbox size={20} className="mr-2" />,
      underline: false,
      link: "/dashboard/inbox",
    },
    {
      name: userType === "brand" ? "Brandfront" : "Storefront",
      icon: <Store size={20} className="mr-2" />,
      underline: true,
      link: "/dashboard",
    },
    {
      name: "Campaigns",
      icon: <Flag size={20} className="mr-2" />,
      underline: false,
      link: "/dashboard/campaigns",
    },
    {
      name: "Calendar",
      icon: <Calendar size={20} className="mr-2" />,
      underline: true,
      link: "/dashboard/calendar",
    },
    {
      name: "Text Post Maker",
      icon: <AlignCenter size={20} className="mr-2" />,
      underline: false,
      link: "/dashboard/post-maker",
    },
    {
      name: "Carousel Maker",
      icon: <GalleryHorizontal size={20} className="mr-2" />,
      underline: true,
      link: "/dashboard/carousel-maker",
    },
    userType === "brand" && {
      name: "Creators",
      icon: <User size={20} className="mr-2" />,
      underline: false,
      link: "/dashboard/creators",
    },
    userType === "creator" && {
      name: "Brands",
      icon: <BriefcaseBusiness size={20} className="mr-2" />,
      underline: false,
      link: "/dashboard/brands",
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    window.location.href = "/login";
    window.location.reload();
  };

  // Function to show the Drawer (Mobile)
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  // Function to close the Drawer (Mobile)
  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="sm:hidden bg-white border-b flex p-8 justify-between items-center">
        <BurgerIcon
          size={24}
          className="cursor-pointer"
          onClick={showDrawer} // Show Drawer on click
        />
        <Bell size={20} />
      </div>

      {/* Drawer for Mobile Version */}
      <Drawer
        title="Menu"
        placement="left"
        visible={drawerVisible}
        onClose={closeDrawer} // Close Drawer
        width={250} // You can adjust the width of the Drawer
        closable={false} // Prevent the close button
        bodyStyle={{ padding: 0 }} // Remove inner padding
      >
        <ul className="w-full">
          {menuItems.map(
            (item, index) =>
              item && ( // Check if item exists (for conditional rendering)
                <div key={index}>
                  <Link href={item.link || ""} key={index} className="w-full">
                    <li
                      key={index}
                      className={`py-4 rounded-md px-4 cursor-pointer flex items-center font-bold ${pathname === item.link ? "bg-neutral-50" : ""
                        }`}
                    >
                      {item.icon && item.icon}
                      {item.name}
                    </li>
                  </Link>
                  {item.underline && (
                    <div className="h-[1px] w-full bg-neutral-100 mt-4"></div>
                  )}
                </div>
              )
          )}
        </ul>

        {/* Logout */}
        <div className="flex items-center justify-around mt-auto py-8">
          <img src="/images/profile.png" alt="" />
          <div className="flex flex-col">
            <span className="font-bold">Andrew Bishop</span>
            <span className="text-xs text-neutral-500">test@example.com</span>
          </div>
          <LogOut
            size={20}
            className="cursor-pointer"
            onClick={logout}
          />
        </div>
      </Drawer>

      {/* Regular Sidebar (Desktop Version) */}
      <div className="sm:flex flex-col w-[20%] px-[16px] max-h-screen bg-white border-r border-gray-200 hidden sm:block">
        <div className="py-6 flex items-center justify-between mt-6">
          <h1 className="text-lg font-bold">B2B Creator</h1>
        </div>
        <div className="flex flex-col items-start h-full">
          <ul className="w-full">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.link;

              return (
                <div key={index}>
                  <Link href={item.link || ""} key={index} className="w-full">
                    <li
                      key={index}
                      className={`py-4 rounded-md px-4 cursor-pointer flex items-center font-bold ${isActive ? "bg-neutral-50" : ""
                        }`}
                    >
                      {item.icon && item.icon}
                      {item.name}
                    </li>
                  </Link>
                  {item.underline && (
                    <div className="h-[1px] w-full bg-neutral-100 mt-4"></div>
                  )}
                </div>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center justify-around mt-auto py-8">
          <img src="/images/profile.png" alt="" />
          <div className="flex flex-col">
            <span className="font-bold">Andrew Bishop</span>
            <span className="text-xs text-neutral-500">test@example.com</span>
          </div>
          <LogOut
            size={20}
            className="cursor-pointer"
            onClick={logout}
          />
        </div>
      </div>
    </>
  );
};
