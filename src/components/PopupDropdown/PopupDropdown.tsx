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

const items: MenuProps["items"] = [
  {
    key: "1",
    icon: <Menu size={16} className="mr-2" />,
    label: "Available Services",
  },
  {
    key: "2",
    icon: <Handshake size={16} className="mr-2" />,
    label: "Previous Partnerships",
  },
  {
    key: "3",
    icon: <BriefcaseBusiness size={16} className="mr-2" />,
    label: "Featured Work",
  },
  {
    key: "4",
    icon: <img src="/icons/linked.svg" alt="linked" className="mr-2" />,
    label: "Your LinkedIn",
  },
  {
    key: "5",
    icon: <MessageSquareText size={16} className="mr-2" />,
    label: "Testimonials",
  },
  {
    key: "6",
    icon: <TextQuote size={16} className="mr-2" />,
    label: "Text Block",
  },
  {
    key: "7",
    icon: <ChartLine size={16} className="mr-2" />,
    label: "Stat Block",
  },
];

const PopupDropdown: React.FC = () => (
  <Dropdown menu={{ items }} overlayStyle={{ width: 200 }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space className="cursor-pointer">
        <Plus size={16} className="text-primary-700" />
        <p className="text-primary-700 font-medium">Add a Section</p>
      </Space>
    </a>
  </Dropdown>
);

export default PopupDropdown;
