'use client';

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface LoginFormProps {
    userType?: "creator" | "brand";
}

const LoginForm = ({ userType = "creator" }: LoginFormProps) => {
    const paragraph =
        userType === "creator"
            ? "Grow together with your favorite brands."
            : "Grow your business with your favorite creators.";

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

    const submitData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(inputs);
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
                <Input
                    name="password"
                    label="Password"
                    type="password"
                    value={inputs.password}
                    onChange={handleChange}
                    placeholder="********"
                    required
                />
                <Button type="submit" variant="primary" icon={<ArrowRight size={16} />}>Sign in</Button>
            </form>

            <div className="mt-6 space-y-3">
                <Button variant="outline" socialMediaIcon={<Image src="/icons/google.svg" alt="Google" width={24} height={24} />}>Sign in with Google</Button>
                <Button variant="outline" socialMediaIcon={<Image src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />}>Sign in with LinkedIn</Button>
            </div>

            <p className="text-neutral-600 text-center mt-32">
                Don’t have an account? <Link href={'/signup'} className="text-primary-700 font-bold">Sign up</Link>
            </p>
        </div>
    );
};

export default LoginForm;
