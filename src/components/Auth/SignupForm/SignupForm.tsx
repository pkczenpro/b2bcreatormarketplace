'use client';

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface SignupFormProps {
    userType?: "creator" | "brand";
}

const SignupForm = ({ userType = "creator" }: SignupFormProps) => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    };

    const submitData = () => {
        router.push('/profile-setup');
        console.log(inputs);
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
                <Input
                    name="password"
                    label="Password"
                    type="password"
                    value={inputs.password}
                    onChange={handleChange}
                    placeholder="********"
                    required
                />
                <Button
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

            <p className="text-neutral-600 text-center mt-12">
                Already have an account? <Link href={'/login'} className="text-primary-700 font-bold">Sign in</Link>
            </p>
        </div>
    );
};

export default SignupForm;
