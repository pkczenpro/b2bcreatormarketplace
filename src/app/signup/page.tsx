/* eslint-disable @next/next/no-img-element */
"use client";

import SignupForm from "@/components/Auth/SignupForm/SignupForm";
import Tabs from "@/components/Tabs/Tabs";

export default function Signup() {
    const tabs = [
        {
            id: 1,
            label: "For Creators",
            content: (
                <SignupForm userType="creator" />
            ),
        },
        {
            id: 2,
            label: "For Brands",
            content: (
                <SignupForm userType="brand" />
            ),
        },
    ];


    return (
        <div className="p-6 flex flex-col md:flex-row justify-center items-center min-h-screen mx-auto">
            {/* Tabs Section */}
            <div className="w-full px-8 md:px-16 lg:px-32 mb-8 sm:mb-0">
                <Tabs tabs={tabs} localStorageKey="signupTab" />
            </div>


            {/* Image Section */}
            <div className="w-full flex justify-center">
                <img loading="lazy"
                    src="/images/wallpaper.png"
                    alt="Signup"
                    className="object-cover w-screen h-auto sm:h-[95vh] rounded-lg"
                />
            </div>
        </div>


    );
}


