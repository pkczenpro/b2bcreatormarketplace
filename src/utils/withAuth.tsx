/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (Component: React.ComponentType) => {
    return function ProtectedRoute(props: any) {
        const router = useRouter();
        const [loading, setLoading] = useState(true);
        const [userType, setUserType] = useState<string | null>(null);

        useEffect(() => {
            const token = localStorage.getItem("userType");
            const storedUserType = localStorage.getItem("userType");

            if (!token) {
                router.push("/login"); // Redirect if no token
            } else {
                setUserType(storedUserType);
                setLoading(false);
            }
        }, []);

        if (loading) return <p>Loading...</p>;

        return <Component {...props} userType={userType} />;
    };
};

export default withAuth;
