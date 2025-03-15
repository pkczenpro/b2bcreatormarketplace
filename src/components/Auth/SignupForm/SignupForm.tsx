'use client';

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { useRouter } from "next/navigation";
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

const SignupForm = ({ userType = "brand" }: SignupFormProps) => {
    const router = useRouter();
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
                router.push("/profile-setup");
            }
        } catch (error) {
            console.error("Signup error:", error);
        } finally {
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

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

            <div className="mt-6 space-y-3">
                <Button variant="outline" socialMediaIcon={<Image src="/icons/google.svg" alt="Google" width={24} height={24} />}>Sign up with Google</Button>
                <Button variant="outline" socialMediaIcon={<Image src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />}>Sign up with LinkedIn</Button>
            </div>

            <center>{loading && <Spin size="large" />}</center>

            <p className="text-neutral-600 text-center mt-12">
                Already have an account? <Link href={'/login'} className="text-primary-700 font-bold">Sign in</Link>
            </p>
        </div>
    );
};

export default SignupForm;
