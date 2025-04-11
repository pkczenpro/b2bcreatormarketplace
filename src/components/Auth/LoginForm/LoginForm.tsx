'use client';

import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import api from "@/utils/axiosInstance";
import { Spin } from "antd";

interface LoginFormProps {
    userType?: "creator" | "brand";
}

const LoginForm = ({ userType }: LoginFormProps) => {
    const router = useRouter();
    const paragraph =
        userType === "creator"
            ? "Grow together with your favorite brands."
            : "Grow your business with your favorite creators.";

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

    const submitData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("/users/login", {
                email: inputs.email,
                password: inputs.password,
                userType,
            });
            if (response.status === 200) {
<<<<<<< HEAD
                
=======
>>>>>>> upstream/main
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('userType', response.data.user.userType); // temp
                if (response.data.user.isCompletedOnboarding) {
                    router.push('/dashboard');
                } else {
                    router.push('/profile-setup');
                }
            }
        }
        catch (error) {
            console.error("Error logging in:", error);
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

       window.location.href = googleAuthUrl; // Redirect to Google login
    };

    return (
        <div>
            <h1 className="text-h4 font-bold mb-2 mt-12">Sign in</h1>

            <p className="mb-8 text-neutral-600">{paragraph}</p>

            <form onSubmit={submitData} className="space-y-6">
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
                <Button loading={loading} type="submit" variant="primary" icon={<ArrowRight size={16} />}>
                    Sign in
                </Button>
            </form>
            <Link
                href='/forgot-password'
                className="text-primary-700 font-medium text-center float-right my-4">
                Forgot password?
            </Link>


            <div className="mt-6 space-y-3 mb-4">
                <Button variant="outline" onClick={handleGoogleAuth} socialMediaIcon={<Image src="/icons/google.svg" alt="Google" width={24} height={24} />}>
                    Sign in with Google
                </Button>
                <Button
                    onClick={handleLogin}
                    variant="outline" socialMediaIcon={<Image src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />}>Sign in with LinkedIn</Button>
            </div>

            <center>{loading && <Spin size="large" />}</center>

            <p className="text-neutral-600 text-center mt-24">
                Don’t have an account? <Link href={'/signup'} className="text-primary-700 font-bold">Sign up</Link>
            </p>
        </div>
    );
};

export default LoginForm;


