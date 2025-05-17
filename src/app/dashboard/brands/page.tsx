/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Input, Table, Button } from "antd";
import { Search, Compass, Heart, Earth, Tag } from "lucide-react";
import Link from "next/link";
import { LeftMenu } from "@/components/Dashboard/LeftMenu";
import api from "@/utils/axiosInstance";
import CustomImage from "@/components/CustomImage";

export default function Dashboard() {
  // const [industries, setIndustries] = useState([]);
  // const [subIndustries, setSubIndustries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loggedUserId, setLoggedUserId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    industry: "",
    subIndustry: "",
    location: "",
    verified: false,
    activeCampaigns: false,
    socialMediaLinked: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        setLoggedUserId(JSON.parse(user)._id);
      }
    }
  }, []);

  useEffect(() => {
    getBrands();
  }, []);

  const getBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/brands");
      setCompanies(res.data);
      setFilteredData(res.data);
      // setIndustries(
      //   res.data.filter((item) => item.category).map((brand) => brand.category)
      // );
      // setSubIndustries(
      //   res.data
      //     .filter((item) => item.subCategory)
      //     .map((brand) => brand.subCategory)
      // );
      setLocations(
        res.data.filter((item) => item.region).map((brand) => brand.region)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (allBrands, filterValues) => {
    const { search, industry, subIndustry, location, socialMediaLinked } =
      filterValues;

    return allBrands.filter((brand) => {
      const matchesSearch =
        brand.name.toLowerCase().includes(search.toLowerCase()) ||
        brand.description.toLowerCase().includes(search.toLowerCase());

      const matchesIndustry = industry
        ? brand.category.toLowerCase() === industry.toLowerCase()
        : true;
      const matchesSubIndustry = subIndustry
        ? brand.subCategory.toLowerCase() === subIndustry.toLowerCase()
        : true;
      const matchesLocation = location
        ? brand.region.toLowerCase() === location.toLowerCase()
        : true;
      const matchesSocial = socialMediaLinked
        ? brand.socialMediaLinks?.some((link) => link.link && link.link !== "")
        : true;

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesLocation &&
        matchesSocial &&
        matchesSubIndustry
      );
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const filtered = applyFilters(companies, newFilters);
    setFilteredData(filtered);
  };

  const followBrand = async (id) => {
    try {
      await api.get("/users/follow-brand/" + id);
      getBrands();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <LeftMenu />
      <div className="flex flex-col w-full p-6 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow mb-3">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Discover Brands
              <Compass className="w-6 h-6 text-neutral-600" />
            </h1>
            <p className="text-gray-600">
              Find brands looking to collaborate and sponsor.
            </p>
          </div>
          <Input
            prefix={<Search className="w-5 h-5 text-gray-500" />}
            placeholder="Search brands..."
            className="w-80 border border-gray-300 p-2 rounded-lg"
            onChange={(e) =>
              handleFilterChange({ ...filters, search: e.target.value })
            }
          />
        </div>

        <BrandFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          // industries={industries}
          locations={locations}
          // subIndustries={subIndustries}
          categoriesSubcategories={categoriesSubcategories}
        />

        <div className="bg-white p-6 rounded-2xl shadow mt-3 w-full">
          <h3 className="text-xl font-semibold mb-4">Featured Brands</h3>
          <Table
            dataSource={filteredData}
            rowKey="_id"
            size="small"
            loading={loading}
            columns={[
              {
                title: "Brand",
                dataIndex: "name",
                sorter: (a, b) => a?.name?.localeCompare(b?.name),
                render: (name, record) => (
                  <div className="flex items-center space-x-4 p-2">
                    <button onClick={() => followBrand(record._id)}>
                      <Heart
                        className={`w-5 h-5 transition ${
                          record.followers.includes(loggedUserId)
                            ? "text-red-500 hover:text-gray-400"
                            : "text-gray-300 hover:text-red-500"
                        }`}
                      />
                    </button>
                    <CustomImage
                      src={record.image}
                      alt="brand logo"
                      className="w-14 h-14 rounded-full border shadow"
                    />
                    <div>
                      <Link
                        href={`/dashboard/brands/${record._id}`}
                        className="text-lg font-semibold text-gray-800 hover:text-blue-500"
                      >
                        {name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {record.description}
                      </p>
                      <div className="flex items-center mt-2">
                        {record?.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded hover:bg-gray-300 transition duration-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Region",
                dataIndex: "region",
                render: (region) => (
                  <span className="text-gray-700">{region}</span>
                ),
                sorter: (a, b) => a?.region?.localeCompare(b?.region),
              },
              {
                title: "Category",
                dataIndex: "category",
                render: (region) => (
                  <span className="text-gray-700">{region}</span>
                ),
                sorter: (a, b) => a?.category?.localeCompare(b?.category),
              },
              {
                title: "Sub Category",
                dataIndex: "subCategory",
                render: (region) => (
                  <span className="text-gray-700">{region}</span>
                ),
                sorter: (a, b) => a?.subCategory?.localeCompare(b?.subCategory),
              },

              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <div className="flex flex-col gap-2">
                    <Link href={`/dashboard/brand-preview/${record._id}`}>
                      <Button
                        size="small"
                        className="bg-black text-white w-full"
                      >
                        View Campaigns
                      </Button>
                    </Link>
                  </div>
                ),
              },
            ]}
            pagination={{
              pageSize: 30,
              showSizeChanger: false,
              position: ["topRight", "bottomCenter"],
            }}
          />
        </div>
      </div>
    </div>
  );
}

const BrandFilters = ({
  filters,
  onFilterChange,
  // industries,
  locations,
  // subIndustries,
  categoriesSubcategories,
}) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Industry Select */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-2 font-medium">
            <Tag className="w-4 h-4 text-gray-500" />
            Category
          </label>
          <select
            className="border border-neutral-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={filters.industry}
            onChange={(e) => handleChange("industry", e.target.value)}
          >
            <option value="">All Categories</option>
            {Object.keys(categoriesSubcategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-2 font-medium">
            <Tag className="w-4 h-4 text-gray-500" />
            Sub Category
          </label>
          <select
            className="border border-neutral-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={filters.subIndustry}
            onChange={(e) => handleChange("subIndustry", e.target.value)}
          >
            <option value="">All Sub Categories</option>
            {Object.keys(categoriesSubcategories[filters.industry] || {}).map(
              (subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              )
            )}
          </select>
        </div>

        {/* Location Select */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1 flex items-center gap-2 font-medium">
            <Earth className="w-4 h-4 text-gray-500" />
            Location
          </label>
          <select
            className="border border-neutral-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const categoriesSubcategories = {
  "Business Software": {
    "Project Management": [],
    "Task Management": [],
    "Resource Management": [],
    "Agile & Scrum Tools": [],
    "CRM (Customer Relationship Management)": [
      "Sales CRM",
      "Real Estate CRM",
      "Call Center CRM",
    ],
    "ERP (Enterprise Resource Planning)": [
      "Manufacturing ERP",
      "Construction ERP",
      "Retail ERP",
    ],
    "Business Intelligence": [
      "Data Visualization",
      "Embedded Analytics",
      "Dashboard Software",
    ],
    "Collaboration Tools": [
      "Document Collaboration",
      "Team Communication",
      "Whiteboard Tools",
    ],
    "Accounting & Finance": ["Invoicing", "Bookkeeping", "Tax Management"],
    "HR & Payroll": [
      "Performance Management",
      "Applicant Tracking Systems (ATS)",
      "Payroll Software",
    ],
  },
  "Marketing & Sales": {
    "Email Marketing": [],
    "Marketing Automation": [],
    "Social Media Management": [],
    "SEO Tools": [],
    "Affiliate Marketing": [],
    "Lead Generation": [],
    "Sales Enablement": [],
    "E-commerce Marketing": [],
  },
  "IT & Dev Tools": {
    "Cloud Computing": [],
    "DevOps Tools": [],
    "APM (Application Performance Monitoring)": [],
    "Bug Tracking": [],
    "Version Control": [],
    "ITSM (IT Service Management)": [],
    "Database Management": [],
    "No-Code / Low-Code Platforms": [],
  },
  "Design & Creative": {
    "Graphic Design": [],
    "UI/UX Design Tools": [],
    "Video Editing": [],
    "Photo Editing": [],
    "Animation Software": [],
    "Prototyping Tools": [],
  },
  "Customer Support": {
    "Help Desk Software": [],
    "Live Chat": [],
    Chatbots: [],
    "Knowledge Base": [],
    "Customer Feedback Tools": [],
    "Call Center Software": [],
  },
  "Education & Training": {
    "Learning Management Systems (LMS)": [],
    "Online Course Platforms": [],
    "Exam Proctoring": [],
    "Authoring Tools": [],
    "Tutoring Software": [],
    "School Management Systems": [],
  },
  "E-Commerce": {
    "Online Store Builders": [],
    "Product Information Management (PIM)": [],
    "Order Management": [],
    "Inventory Management": [],
    "Payment Gateway Integration": [],
  },
  Security: {
    "Antivirus & Endpoint Protection": [],
    "Network Security": [],
    "Cloud Security": [],
    "Password Management": [],
    "Vulnerability Scanning": [],
    "Data Loss Prevention": [],
  },
  "Industry-Specific Software": {
    Healthcare: ["EHR/EMR", "Medical Billing", "Telemedicine"],
    "Real Estate": ["Property Management", "Real Estate CRM"],
    Retail: ["POS Systems", "Retail Management"],
    Hospitality: ["Hotel Management", "Restaurant POS"],
    Construction: ["Estimating Software", "Construction Management"],
    Legal: ["Legal Practice Management", "Document Automation"],
  },
  "Productivity & Office Tools": {
    "Note-Taking Apps": [],
    "Time Tracking": [],
    "Calendars & Scheduling": [],
    "Document Management": [],
    "E-Signature Software": [],
  },
  "Artificial Intelligence & Data Science": {
    "AI Chatbots": [],
    "Machine Learning Platforms": [],
    "Data Annotation Tools": [],
    "Predictive Analytics": [],
    "AutoML Tools": [],
  },
  HRTech: {
    "Core HR & Employee Management": [
      "HRIS (Human Resource Information System)",
      "Employee Database Management",
      "Employee Self-Service Portals",
    ],
    "Recruitment & Talent Acquisition": [
      "Applicant Tracking System (ATS)",
      "Recruitment Marketing",
      "Video Interviewing Software",
      "Resume Parsing Tools",
      "Job Board Software",
    ],
    "Onboarding & Offboarding": [
      "Digital Onboarding Platforms",
      "Document Collection & e-Signatures",
      "Exit Management Tools",
    ],
    "Performance Management": [
      "OKR & Goal Setting Software",
      "360-Degree Feedback Tools",
      "Performance Review Platforms",
      "Continuous Feedback Tools",
    ],
    "Learning & Development": [
      "Learning Management Systems (LMS)",
      "Employee Training Software",
      "Skill Development Platforms",
      "Compliance Training Tools",
    ],
    "Payroll & Compensation": [
      "Payroll Processing",
      "Salary Benchmarking",
      "Compensation Management",
      "Benefits Administration",
    ],
    "Time, Attendance & Leave": [
      "Time Tracking Software",
      "Attendance Management",
      "Leave Management Systems",
      "Shift Scheduling Tools",
    ],
    "Employee Engagement": [
      "Pulse Survey Tools",
      "Recognition & Rewards Platforms",
      "Internal Communication Tools",
      "Employee Wellness Software",
    ],
    "Workforce Planning & Analytics": [
      "Workforce Analytics",
      "Succession Planning",
      "Talent Forecasting Tools",
    ],
    "HR Compliance & Policy Management": [
      "Policy Management Tools",
      "Labor Law Compliance",
      "Audit & Reporting Systems",
    ],
    "Remote Work Tools": [
      "Remote Team Management",
      "Employee Monitoring Software",
      "Virtual Workspaces",
    ],
  },
  EdTech: {
    "Learning Management Systems (LMS)": [
      "Corporate LMS",
      "K-12 LMS",
      "Higher Education LMS",
      "SCORM-compliant LMS",
    ],
    "Online Course Platforms": [
      "Course Creation Tools",
      "MOOC Platforms",
      "White-labeled Course Marketplaces",
    ],
    "Virtual Classroom & Video Learning": [
      "Virtual Classroom Platforms",
      "Video Conferencing for Education",
      "Live Class Recording Tools",
    ],
    "Assessment & Testing": [
      "Online Examination Software",
      "Proctoring Solutions (AI + Human)",
      "Quiz & Test Builders",
      "Academic Integrity Tools",
    ],
    "Student Information Systems (SIS)": [
      "Admissions & Enrollment Management",
      "Student Progress Tracking",
      "Gradebook Software",
    ],
    "Content & Curriculum Management": [
      "Curriculum Design Tools",
      "Interactive Content Platforms",
      "Digital Libraries",
    ],
    "Gamification & Engagement": [
      "Game-Based Learning Tools",
      "Learning Rewards Platforms",
      "Leaderboards & Badging Systems",
    ],
    "Tutoring & Coaching Platforms": [
      "One-on-One Tutoring Software",
      "Peer Learning Platforms",
      "Mentorship Management Tools",
    ],
    "Communication & Collaboration": [
      "Parent-Teacher Communication Tools",
      "Student Collaboration Tools",
      "Campus Notification Systems",
    ],
    "EdTech for Institutions": [
      "School Management Systems",
      "College ERP",
      "Classroom Management Tools",
    ],
    "AI & Adaptive Learning": [
      "Personalized Learning Engines",
      "AI-Powered Study Assistants",
      "Skill Gap Analysis Tools",
    ],
  },
};
