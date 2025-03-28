'use client';

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import { Spin } from "antd";


interface SignupFormProps {
    userType?: "creator" | "brand";
}

const SignupForm = ({ userType }: SignupFormProps) => {
    const paragraph =
        userType === "creator"
            ? "Connect with brands to widen your audience."
            : "Connect with influencers to grow your business.";

    const [inputs, setInputs] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    };

    const submitData = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form from reloading the page
        setLoading(true);
        try {
            const response = await api.post("/users/register", {
                email: inputs.email,
                password: inputs.password,
                name: inputs.fullName,
                userType,
            });
            if (response.status === 201) {
                toast.success(response.data.message, {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Signup error:", error);
        } finally {
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);


    const linkedInClientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
    const redirectUri = `${DOMAIN}/auth/linkedin/callback`; // Change in production

    const handleLogin = () => {
        const scopes = [
            "openid",
            "profile",
            "email",
            "w_member_social",
        ].join(" ");

        const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedInClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${userType}&scope=${encodeURIComponent(scopes)}`;
        window.location.href = linkedInAuthUrl; // Redirect to LinkedIn login };
    }

    const handleGoogleAuth = () => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const redirectUri = `${DOMAIN}/auth/google/callback`; // Update for production
        const scope = "openid email profile";
        const responseType = "code";

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent&state=${userType}`;

        window.open(googleAuthUrl, "_blank", "noopener,noreferrer");
    };


    return (
        <div>
            <h1 className="text-h4 font-bold mb-2 mt-12">Sign up</h1>
            <p className="mb-8 text-neutral-600">{paragraph}</p>

            <form className="space-y-6">
                <Input
                    name="fullName"
                    label="Full Name"
                    type="text"
                    value={inputs.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                />
                <Input
                    name="email"
                    label="Email Address"
                    type="email"
                    value={inputs.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    required
                />
                <div className="relative">
                    <Input
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={inputs.password}
                        onChange={handleChange}
                        placeholder="********"
                        required
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute top-1/3 inset-y-0 right-3 flex items-center text-gray-500"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <Button
                    loading={loading}
                    onClick={submitData}
                    type="submit" variant="primary" icon={<ArrowRight size={16} />}
                >
                    Sign up
                </Button>
            </form>

            <div className="mt-6 space-y-3 mb-4">
                <Button variant="outline" onClick={handleGoogleAuth} socialMediaIcon={<Image src="/icons/google.svg" alt="Google" width={24} height={24} />}>
                    Sign up with Google
                </Button>
                <Button
                    onClick={handleLogin}
                    variant="outline" socialMediaIcon={<Image src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />}>
                    Sign up with LinkedIn
                </Button>
            </div>

            <center>{loading && <Spin size="large" />}</center>

            <p className="text-neutral-600 text-center mt-12">
                Already have an account? <Link href={'/login'} className="text-primary-700 font-bold">Sign in</Link>
            </p>
        </div>
    );
};

export default SignupForm;
