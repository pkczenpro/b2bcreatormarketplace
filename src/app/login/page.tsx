/* eslint-disable @next/next/no-img-element */
"use client";

import LoginForm from "@/components/Auth/LoginForm/LoginForm";
import Tabs from "@/components/Tabs/Tabs";

export default function Login() {
    const tabs = [
        {
            id: 1,
            label: "For Creators",
            content: <LoginForm userType="creator" />,
        },
        {
            id: 2,
            label: "For Brands",
            content: <LoginForm userType="brand" />,
        },
    ];

   

    return (
        <div className="p-6 flex flex-col md:flex-row justify-center items-center min-h-screen mx-auto">
            {/* Tabs Section */}
            <div className="w-full px-8 md:px-16 lg:px-32 mb-8 sm:mb-0">
<<<<<<< HEAD
                <Tabs tabs={tabs} localStorageKey="loginTab" />
=======
                <Tabs tabs={tabs} localStorageKey="authTab" />
>>>>>>> upstream/main
            </div>

            {/* Image Section */}
            <div className="w-full flex justify-center">
                <img
                    loading="lazy"
                    src="/images/wallpaper.png"
                    alt="Signup"
                    className="object-cover w-full max-w-[600px] h-auto sm:h-[95vh] rounded-lg"
                />
            </div>
        </div>
    );
}

