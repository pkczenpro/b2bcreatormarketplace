"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

const LinkedInCallback = () => {
    const navigate = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const userType = urlParams.get("state");

        if (code) {
            api
                .post("/users/login/linkedin?authtype=1", { code, userType })
                .then((response) => {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem('userType', response.data.user.userType); // temp
                    navigate.push("/dashboard/post-maker")
                })
                .catch((error) => {
                    console.error("Login failed", error);
                    navigate.push("/login");
                });
        }
    }, []);

    return <div className="flex items-center space-x-2 text-blue-600 min-h-screen justify-center">
        <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"
            ></path>
        </svg>
        <p className="font-medium">Authenticating...</p>
    </div>;
};

export default LinkedInCallback;
