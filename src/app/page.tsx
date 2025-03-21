/* eslint-disable @next/next/no-img-element */
"use client";

import LoginForm from "@/components/Auth/LoginForm/LoginForm";
import Tabs from "@/components/Tabs/Tabs";

export default function Home() {
  const tabs = [
    {
      id: 1,
      label: "For Creators",
      content: (
        <LoginForm userType="creator" />
      ),
    },
    {
      id: 2,
      label: "For Brands",
      content: (
        <LoginForm userType="brand" />
      ),
    },
  ];


  return (
    <div className="p-6 flex md:flex-row sm:flex-col flex-col justify-between items-center min-h-[100vh]">
      {/* Tabs Section */}
      <div className="w-screen px-32">
        <Tabs tabs={tabs} />
      </div>

      {/* Image Section */}
      <div className="w-full h-full flex justify-center">
        <img loading="lazy"
          src="/images/wallpaper.png"
          alt="Signup"
          className="object-cover w-screen h-auto sm:h-[95vh] rounded-lg"
        />
      </div>
    </div>


  );
}


