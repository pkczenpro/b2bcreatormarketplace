/* eslint-disable @next/next/no-img-element */
// components/CustomImage.tsx
import React, { ImgHTMLAttributes } from "react";

interface CustomImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, className, ...props }) => {
    // Default fallback image URL
    const DEFAULT_IMG = process.env.NEXT_PUBLIC_SERVER_URL + "/default.png";

    // Determine if the src is a full URL or relative path
    const imageUrl = src?.includes("http")
        ? src
        : process.env.NEXT_PUBLIC_SERVER_URL + (src || '');

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = DEFAULT_IMG;
    };

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={className}
            onError={handleError}
            {...props}
        />
    );
};

export default CustomImage;
