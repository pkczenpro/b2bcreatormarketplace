/* eslint-disable @next/next/no-img-element */
import {
  Inbox, Store, Flag, Calendar, AlignCenter, GalleryHorizontal, User,
  BriefcaseBusiness, Bell, LogOut, Menu as BurgerIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Drawer } from "antd";

export const LeftMenu = () => {
  const pathname = usePathname();
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserData(JSON.parse(localStorage.getItem("user") || "{}"));
      setUserType(localStorage.getItem("userType"));
    }
  }, []);

  const menuItems = [
    { name: "Inbox", icon: Inbox, link: "/dashboard/inbox" },
    { name: userType === "brand" ? "Brandfront" : "Storefront", icon: Store, link: "/dashboard", underline: true },
    { name: "Campaigns", icon: Flag, link: "/dashboard/campaigns" },
    { name: "Calendar", icon: Calendar, link: "/dashboard/calendar", underline: true },
    { name: "Text Post Maker", icon: AlignCenter, link: "/dashboard/post-maker" },
    { name: "Carousel Maker", icon: GalleryHorizontal, link: "/dashboard/carousel-maker", underline: true },

    userType === "brand" && { name: "Creators", icon: User, link: "/dashboard/creators" },
    userType === "creator" && { name: "Brands", icon: BriefcaseBusiness, link: "/dashboard/brands" },
  ].filter(Boolean);

  const logout = () => {
    localStorage.removeItem("userType");
    window.location.href = "/login";
  };

  const renderMenuItems = () => menuItems.map(({ name, icon: Icon, link, underline }, index) => (
    <div key={index}>
      <Link href={link} className="w-full">
        <li className={`py-4 rounded-md px-4 cursor-pointer flex items-center font-bold ${pathname === link ? "bg-neutral-50" : ""}`}>
          <Icon size={20} className="mr-2" />
          {name}
        </li>
      </Link>
      {underline && <div className="h-[1px] w-full bg-neutral-100 mt-4"></div>}
    </div>
  ));

  return (
    <>
      {/* Mobile Menu */}
      <div className="sm:hidden bg-white border-b flex p-8 justify-between items-start">
        <BurgerIcon size={24} className="cursor-pointer" onClick={() => setDrawerVisible(true)} />
      </div>

      {/* Drawer for Mobile */}
      <Drawer title={
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">B2B Creator</h1>
          <Bell size={16} />
        </div>
      } placement="left" open={drawerVisible} onClose={() => setDrawerVisible(false)} width={300} closable={false} bodyStyle={{ padding: 0 }}>
        <ul className="w-full">{renderMenuItems()}</ul>
        <div className="flex items-center justify-around mt-auto py-8">
          <img loading="lazy" src="/images/profile.png" alt="Profile" className="w-10 h-10 rounded-full" />
          <div className="flex flex-col">
            <span className="font-bold">{userData?.name}</span>
            <span className="text-xs text-neutral-500">{userData?.email}</span>
          </div>
          <LogOut size={20} className="cursor-pointer" onClick={logout} />
        </div>
      </Drawer>

      {/* Desktop Sidebar */}
      <div className="sm:flex flex-col  min-w-[20%] max-w-[20%] w-[20%] px-[16px] max-h-screen bg-white border-r border-gray-200 hidden sm:block">
        <div className="py-6 flex items-center justify-between mt-6">
          <h1 className="text-lg font-bold">B2B Creator</h1>
        </div>
        <div className="flex flex-col items-start h-full">
          <ul className="w-full">{renderMenuItems()}</ul>
        </div>
        <div className="flex items-center justify-around mt-auto py-8">
          <img loading="lazy" src={
            userData?.profileImage.startsWith("http") ?
              userData?.profileImage :
              process.env.NEXT_PUBLIC_SERVER_URL + userData?.profileImage
          } alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="font-bold text-sm">{userData?.name}</span>
          </div>
          <LogOut size={20} className="cursor-pointer" onClick={logout} />
        </div>
      </div>
    </>
  );
};
