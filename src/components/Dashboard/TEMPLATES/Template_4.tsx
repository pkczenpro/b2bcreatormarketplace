/* eslint-disable @next/next/no-img-element */
import { Button } from "antd";
import html2canvas from "html2canvas";
import { ArrowRightCircle, Bookmark } from "lucide-react";
import React, { useState, useRef } from "react";

// Define the props for the component
interface Template1Props {
    index: number;
    isLastItem?: boolean;
}

const Template_4: React.FC<Template1Props> = ({
    index,
    isLastItem = false,
}) => {
    // Local state to handle editable text content
    const [editableTopic, setEditableTopic] = useState("Topic");
    const [editableTitle, setEditableTitle] = useState("Title");
    const [editableTagline, setEditableTagline] = useState("Tagline");
    const [editableProfileName, setEditableProfileName] = useState("John Doe");
    const [editableProfileUsername, setEditableProfileUsername] = useState("@johndoe");
    const [edirableButton, setEditableButton] = useState("Call to Action");

    // Refs to handle focus and selection
    const topicRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLDivElement | null>(null);
    const taglineRef = useRef<HTMLDivElement | null>(null);
    const profileNameRef = useRef<HTMLDivElement | null>(null);
    const profileUsernameRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLDivElement | null>(null);

    // Handler for updating content when user finishes typing (onBlur)
    const handleBlur = (setter: React.Dispatch<React.SetStateAction<string>>, ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            setter(ref.current.textContent || "");
        }
    };


    // Export Single Image Function
    const exportImage = (index) => {
        const postElement = document.querySelector(`#post-${index}`);
        if (postElement) {
            html2canvas(postElement, { backgroundColor: null }).then((canvas) => {
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = `carousel_${index + 1}.png`;
                link.click();
            });
        }
    };

    return (
        <div
            key={index}
            id={`post-${index}`}
            className="bg-[#814EB3] w-full h-full flex flex-col justify-between p-12 relative"
        >

            {/* Top Section - Text Content */}
            <div className={`mt-28 z-10 relative ${index === 0 ? "text-left" : "text-center"}`}>
                <p className="text-neutral-300 text-lg mb-3">
                    <span
                        ref={topicRef}
                        contentEditable
                        suppressContentEditableWarning
                        className="inline-block w-full"
                        onBlur={() => handleBlur(setEditableTopic, topicRef)}
                    >
                        {editableTopic}
                    </span>
                </p>
                <h1 className="text-white text-6xl font-bold leading-tight mb-4">
                    <span
                        ref={titleRef}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={() => handleBlur(setEditableTitle, titleRef)}
                    >
                        {editableTitle}
                    </span>
                </h1>
                {isLastItem ? (
                    <button
                        className="bg-white text-black p-2 rounded-md"
                    >
                        <span
                            ref={buttonRef}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={() => handleBlur(setEditableButton, buttonRef)}
                        >
                            {edirableButton}
                        </span>
                    </button>
                ) : <span className="text-neutral-300 text-2xl mt-5 block">
                    <div
                        ref={taglineRef}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={() => handleBlur(setEditableTagline, taglineRef)}
                    >
                        {editableTagline}
                    </div>
                </span>}
            </div >

            {/* Bottom Section - Profile & Arrow */}
            < div className="flex justify-between items-center w-full z-10 relative" >
                {/* Profile Section */}
                < div className="flex items-center space-x-4" >
                    <img
                        src={"/images/profile.png"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                    />

                    <div>
                        <h1
                            ref={profileNameRef}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={() => handleBlur(setEditableProfileName, profileNameRef)}
                            className="text-white text-left font-semibold text-lg">
                            {editableProfileName}
                        </h1>
                        <p
                            ref={profileUsernameRef}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={() => handleBlur(setEditableProfileUsername, profileUsernameRef)}
                            className="text-sm text-white text-left">{editableProfileUsername}</p>
                    </div>

                </div >

                {/* Arrow Icon */}
                {
                    !isLastItem ? (
                        <ArrowRightCircle className="text-white w-7 h-7" />
                    ) :
                        <Bookmark className="text-white w-7 h-7" fill="white" />
                }
            </div >
        </div >
    );
};

export default Template_4;
