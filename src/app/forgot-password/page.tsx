"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NextPage } from "next";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";

const ForgotPassword: NextPage = () => {
    const [email, setEmail] = useState<string>("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/users//send-password-reset-link", {
                email,
            });
            if (response.status === 200) {
                toast.success(response.data.message, {
                    position: "top-center",
                });
                setTimeout(() => {
                    router.push("/login"); 
                }, 3000);
            }
        } catch (err) {
            console.error("Error sending password reset link:", err);
        }
    };

    return (
        <div className="p-6 flex md:flex-row sm:flex-col flex-col justify-between items-center min-h-[100vh]">
            <div className="w-full px-8 md:px-16 lg:px-32 mb-8 sm:mb-0">
                <h1 className="text-h4 font-bold mb-2 mt-12">Forgot Password</h1>
                <p className="mb-8 text-neutral-600">
                    Enter your email address to receive a password reset link.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input
                            name="email"
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="john.doe@example.com"
                            required
                        />
                    </div>
                    <Button type="submit" variant="primary" icon={<ArrowRight size={16} />}>
                        Send Reset Link
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-neutral-600 font-medium float-right">
                        Remember your password?{" "}
                        <Link href="/login" className="text-primary-800 font-bold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>

            </div>

            {/* Image Section */}
            <div className="w-full h-full flex justify-center">
                <img loading="lazy"
                    src="/images/wallpaper.png"
                    alt="Forgot Password"
                    className="object-cover w-screen h-auto sm:h-[95vh] rounded-lg"
                />
            </div>
        </div>
    );
};

export default ForgotPassword;
