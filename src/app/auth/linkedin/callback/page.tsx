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
                .post("/users/login/linkedin", { code, userType })
                .then((response) => {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem('userType', response.data.user.userType); // temp
                    if (response.data.user.isCompletedOnboarding) {
                        navigate.push('/dashboard');
                    } else {
                        navigate.push('/profile-setup');
                    }
                })
                .catch((error) => {
                    console.error("Login failed", error);
                    navigate.push("/login");
                });
        }
    }, []);

    return <p>Logging in with LinkedIn...</p>;
};

export default LinkedInCallback;
