import React from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import {
  BriefcaseBusiness,
  Menu,
  Handshake,
  MessageSquareText,
  TextQuote,
  ChartLine,
  Plus,
} from "lucide-react";

const PopupDropdown: React.FC<{
  showSections: Record<string, boolean>;
  setShowSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}> = ({ showSections, setShowSections }) => {

  const handleMenuClick = (key: string) => {
    if (showSections[key]) {
      setShowSections((prev) => ({ ...prev, [key]: false }));
    } else {
      setShowSections((prev) => ({
        ...prev,
        [key]: !prev[key], // Toggle the selected section
      }));
    }

  };

  const items: MenuProps["items"] = [
    {
      key: "services",
      icon: <Menu size={16} className="mr-2" />,
      label: "Available Services",
      onClick: () => handleMenuClick("services"),
      style: {
        backgroundColor: showSections.services ? "#f3f4f6" : "",
      }
    },
    {
      key: "partnerships",
      icon: <Handshake size={16} className="mr-2" />,
      label: "Previous Partnerships",
      onClick: () => handleMenuClick("partnerships"),
      style: {
        backgroundColor: showSections.partnerships ? "#f3f4f6" : "",
      }
    },
    {
      key: "work",
      icon: <BriefcaseBusiness size={16} className="mr-2" />,
      label: "Featured Work",
      onClick: () => handleMenuClick("work"),
      style: {
        backgroundColor: showSections.work ? "#f3f4f6" : "",
      }
    },
    // {
    //   key: "linkedin",
    //   icon: <img loading="lazy" src="/icons/linked.svg" alt="linked" className="mr-2" />,
    //   label: "Your LinkedIn",
    //   onClick: () => handleMenuClick("linkedin"),
    //   style: {
    //     backgroundColor: showSections.linkedin ? "#f3f4f6" : "",
    //   }
    // },
    {
      key: "testimonials",
      icon: <MessageSquareText size={16} className="mr-2" />,
      label: "Testimonials",
      onClick: () => handleMenuClick("testimonials"),
      style: {
        backgroundColor: showSections.testimonials ? "#f3f4f6" : "",
      }
    },
    {
      key: "textBlock",
      icon: <TextQuote size={16} className="mr-2" />,
      label: "Text Block",
      onClick: () => handleMenuClick("textBlock"),
      style: {
        backgroundColor: showSections.textBlock ? "#f3f4f6" : "",
      }
    },
    {
      key: "statBlock",
      icon: <ChartLine size={16} className="mr-2" />,
      label: "Stat Block",
      onClick: () => handleMenuClick("statBlock"),
      style: {
        backgroundColor: showSections.statBlock ? "#f3f4f6" : "",
      }
    },
  ];

  return (
    <Dropdown menu={{ items }} overlayStyle={{ width: 200 }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space className="cursor-pointer">
          <Plus size={16} className="text-primary-700" />
          <p className="text-primary-700 font-medium">Add a Section</p>
        </Space>
      </a>
    </Dropdown>
  );
};

export default PopupDropdown;
