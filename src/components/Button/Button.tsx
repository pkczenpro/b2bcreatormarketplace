"use client";

import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
    socialMediaIcon?: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "outline";
    size?: "xs" | "small" | "medium" | "large"; // New size prop
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    type = "button",
    onClick,
    disabled = false,
    className = "",
    socialMediaIcon,
    icon,
    variant = "primary",
    size = "medium",
    loading = false,
}) => {
    // Base Tailwind CSS classes
    const baseClasses =
        "w-full rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ease-in-out flex items-center justify-center";

    // Variant-specific classes
    const variantClasses = {
        primary: "bg-primary-700 font-medium text-white hover:bg-primary-600 focus:ring-primary-500",
        secondary: "bg-secondary-500 text-neutral-800 hover:bg-secondary-600 focus:ring-secondary-500",
        outline: "bg-transparent font-bold border border-neutral-300 text-neutral-800 hover:bg-primary-50 focus:ring-primary-500",
    };

    // Size-specific classes
    const sizeClasses = {
        xs: "px-2 py-1 text-xs",
        small: "px-3 py-2 text-sm",
        medium: "px-4 py-3 text-base",
        large: "px-5 py-4 text-lg",
    };

    // Disabled state classes
    const disabledClasses = "opacity-50 cursor-not-allowed";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? disabledClasses : ""} ${className}`}
        >
            {socialMediaIcon && <span className="mr-2">{socialMediaIcon}</span>}
            {children}
            {icon && <span className="ml-2">{icon}</span>}
        </button>
    );
};

export default Button;
