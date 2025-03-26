"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import api from "@/utils/axiosInstance";

const GoogleCallback = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    useEffect(() => {
        if (code) {
            api.post("/users/login/google", { code, userType: state }) // Change userType dynamically
                .then(response => {
                    // if (response?.data?.user?.isCompletedOnboarding) {
                    //     localStorage.setItem("token", response?.data?.token);
                    //     localStorage.setItem("user", JSON.stringify(response.data.user));
                    //     localStorage.setItem("userType", response.data.user.userType);
                    //     router.push("/dashboard");
                    // } else {
                    //     router.push('/profile-setup');
                    // }
                    localStorage.setItem("token", response?.data?.token);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    localStorage.setItem("userType", response.data.user.userType);
                    router.push('/dashboard');
                })
                .catch(error => console.error("Google Auth Error:", error?.response?.data));
        }
    }, [code, router]); // ✅ Added `router` as a dependency

    return (
        <div className="flex items-center space-x-2 text-blue-600 min-h-screen justify-center">
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
            <p className="font-medium">Logging in with Google...</p>
        </div>
    );
};

const GoogleCallbackWithSuspense = () => (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <GoogleCallback />
    </Suspense>
);

export default GoogleCallbackWithSuspense;
