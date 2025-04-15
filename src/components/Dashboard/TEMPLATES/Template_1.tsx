/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Button, Input, Segmented, Switch, Upload, message, ColorPicker, Tabs, Slider } from "antd";
import { ArrowRightCircle } from "lucide-react";
import html2canvas from "html2canvas";
import EmojiPicker from 'emoji-picker-react';
import CustomImage from "@/components/CustomImage";

interface Template1Props {
    index: number;
    selectedSize: string;
    fontFamily: string;
    backgroundColor: string;
    template: number;
    deleteItem: (index: number) => void;
}

const Template_1: React.FC<Template1Props> = ({
    index,
    selectedSize,
    fontFamily,
    backgroundColor,
    data,
    setData,
    deleteItem
}) => {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUserData(JSON.parse(userData));
        }
    }, []);

    const handleImageUpload = (key: "backgroundImage" | "profileImage") => (info: any) => {
        if (info.file.status === "done") {
            const reader = new FileReader();
            reader.onload = (e) => {
                setData({
                    ...data, [key]: {
                        ...data[key],
                        image: e?.target?.result,
                    }
                });
            };
            reader.readAsDataURL(info.file.originFileObj);
        } else if (info.file.status === "error") {
            message.error("Image upload failed");
        }
    };

    const exportImage = () => {
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

    const renderInputField = (label: string, valueKey: keyof typeof data) => (
        <div className="text-xs text-left">
            <label className="block text-gray-600 font-medium mb-0.5">{label}</label>
            <div className="flex items-center gap-1">
                <Input
                    className="w-full px-1 py-0.5 text-xs"
                    value={data[valueKey]?.label}
                    onChange={(e) => {
                        if (label === "Title") {
                            const fontSize = Math.max(32, 64 - e.target.value.length);
                            setData({ ...data, [valueKey]: { ...data[valueKey], label: e.target.value, fontSize } });
                        } else {
                            setData({ ...data, [valueKey]: { ...data[valueKey], label: e.target.value } })
                        }
                    }}
                />
                <ColorPicker
                    value={data[valueKey]?.color}
                    onChange={(_, color) => setData({ ...data, [valueKey]: { ...data[valueKey], color } })}
                    size="small"
                />
                <Input
                    className="w-16 px-1 py-0.5 text-xs"
                    type="number"
                    max={128}
                    value={data[valueKey]?.fontSize}
                    onChange={(e) => setData({ ...data, [valueKey]: { ...data[valueKey], fontSize: parseInt(e.target.value) } })}
                />
                <Segmented
                    className="text-xs"
                    value={data[valueKey]?.textAlign}
                    options={[
                        { label: "L", value: "left" },
                        { label: "C", value: "center" },
                        { label: "R", value: "right" },
                    ]}
                    onChange={(value) => setData({ ...data, [valueKey]: { ...data[valueKey], textAlign: value } })}
                    size="small"
                />
                <Switch
                    size="small"
                    checked={!data[valueKey]?.hidden}
                    onChange={(checked) => setData({ ...data, [valueKey]: { ...data[valueKey], hidden: !checked } })}
                />
            </div>
        </div>
    );


    const tabs = [
        {
            key: "1",
            label: "Text",
            children: (
                <div className="space-y-4">
                    {renderInputField("Topic", "editableTopic")}
                    {renderInputField("Title", "editableTitle")}
                    {renderInputField("Tagline", "editableTagline")}
                    {renderInputField("Profile Name", "editableProfileName")}
                    {renderInputField("Profile Username", "editableProfileUsername")}
                </div>
            ),
        },
        {
            key: "2",
            label: "Buttons",
            children: (
                <div className="space-y-4">
                    {["Show Profile Info", "Show CTA", "Swipe", "Headshot"].map((label, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <label className="text-gray-700 font-medium">{label}</label>
                            <Switch
                                checked={data[["showProfileImage", "isLastItem", "swipeButton", "isHeadImage"][i]]}
                                onChange={(checked) => {
                                    setData({ ...data, [["showProfileImage", "isLastItem", "swipeButton", "isHeadImage"][i]]: checked });
                                }}
                            />
                        </div>
                    ))}
                </div>
            ),
        },
        {
            key: "3",
            label: "Design",
            children: (
                <div className="space-y-4">
                    {["Background Color"].map((label, i) => (
                        <div key={i} className="text-left">
                            <h3 className="font-medium mb-2">{label}</h3>
                            <ColorPicker
                                value={data[["bgColor"][i]]}
                                onChange={(_, color) => setData({ ...data, [["bgColor"][i]]: color })}
                                showText
                                size="small"
                            />
                        </div>
                    ))}
                </div>
            ),
        },
        {
            key: "4",
            label: "Images",
            children: (
                <div className="space-y-4">
                    {["Background Image", "Profile Image / Headshot"].map((label, i) => (
                        <div key={i} className="text-left">
                            <h3 className="font-medium mb-2">{label}</h3>
                            <div className="flex">
                                <Upload accept="image/*" showUploadList={false} onChange={handleImageUpload(["backgroundImage", "profileImage"][i])}>
                                    <Button type="primary">Upload Image</Button>
                                </Upload>
                                <Slider
                                    className="ml-4 w-full"
                                    defaultValue={0}
                                    max={1}
                                    step={0.1}
                                    value={data[["backgroundImage", "profileImage"][i]].opacity}
                                    onChange={(value) => setData({ ...data, [["backgroundImage", "profileImage"][i]]: { ...data[["backgroundImage", "profileImage"][i]], opacity: value } })}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            key: "5",
            label: "Emojies",
            children: (
                <div className="space-y-4">
                    <EmojiPicker
                        onEmojiClick={(e, emoji) => {
                            setData({ ...data, emoji: emoji?.target?.outerHTML })
                        }}
                    />
                </div>
            ),
        },
    ];
    const [width, height] = selectedSize.split("x").map((val) => parseInt(val) * 1.5);

    const timeout = (callback: any, time: number) => {
        setTimeout(() => {
            callback();
        }, time);
    };

    const DEFAULT_IMG = process.env.NEXT_PUBLIC_SERVER_URL + "/default.png";

    return (
        <div className="w-full h-full flex flex-col">
            <div
                key={index}
                id={`post-${index}`}
                className="w-full h-full flex flex-col relative cursor-pointer"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    fontFamily,
                    backgroundColor: data.bgColor || "#7CA3C2",
                    justifyContent: data.isHeadImage ? "flex-start" : "center",
                    paddingTop: data.isHeadImage ? "30px" : "0",
                }}
                onClick={() => setData({ ...data, showEditingDiv: !data.showEditingDiv })}
            >
                {/* Background Image Layer */}
                {data.backgroundImage && (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${data.backgroundImage.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            opacity: data.backgroundImage.opacity || 1, // Only affects the image
                        }}
                    />
                )}

                <div className={`z-10 relative`}>
                    {data.emoji && (
                        <div
                            className='absolute top-[80%] right-10'
                            dangerouslySetInnerHTML={{ __html: data.emoji }}></div>
                    )}

                    <div className="px-12">
                        {data.isHeadImage &&
                            <img loading="lazy"
                                src={data.profileImage.image}
                                alt="Profile"
                                className="rounded-full w-28 h-28 mb-3"
                                style={{
                                    opacity: data.profileImage.opacity || 1,
                                }}
                            />
                        }

                        <p className="text-neutral-300 text-lg mb-1" style={{
                            color: data.editableTopic.color || "#ffffff",
                            fontSize: data.editableTopic.fontSize || 16,
                            textAlign: data.editableTopic.textAlign || "center",
                            display: data.editableTopic.hidden ? "none" : "block",
                        }}>
                            {data.editableTopic.label}
                        </p>
                        <h1
                            className="text-white font-bold leading-tight mb-1 break-words"
                            style={{
                                color: data.editableTitle.color || "#ffffff",
                                fontSize: `${Math.max(Math.min(data.editableTitle.fontSize, 48), 22)}px`, // Max 64px, Min 32px
                                textAlign: data.editableTitle.textAlign || "center",
                                display: data.editableTitle.hidden ? "none" : "block",
                            }}
                        >
                            {data.editableTitle.label.length > 110
                                ? `${data.editableTitle.label.slice(0, 110)}...`
                                : data.editableTitle.label}
                        </h1>
                        
                        {data.isLastItem ? (
                            <button className="bg-white text-black p-2 rounded-md">{data.editableButton.label}</button>
                        ) : (
                            <span className="text-neutral-300 text-2xl mt-1 block" style={{
                                color: data.editableTagline.color || "#ffffff",
                                fontSize: data.editableTagline.fontSize || 16,
                                textAlign: data.editableTagline.textAlign || "center",
                                display: data.editableTagline.hidden ? "none" : "block",
                            }}>{data.editableTagline.label}</span>
                        )}

                    </div>


                </div>

                <div className="flex justify-between items-center w-full z-10 absolute px-8 bottom-8">
                    {data.showProfileImage && (
                        <div className="flex items-center space-x-4">
                            {!data.isHeadImage &&
                                <img
                                    loading="lazy"
                                    src={
                                        data?.profileImage?.image ||
                                        (userData?.profileImage?.includes("http")
                                            ? userData?.profileImage
                                            : process.env.NEXT_PUBLIC_SERVER_URL + userData?.profileImage)
                                        ||
                                        DEFAULT_IMG
                                    }
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full"
                                    style={{
                                        opacity: data?.profileImage?.opacity || 1,
                                    }}
                                />

                            }
                            <div>
                                <h1
                                    className="text-white text-left font-semibold text-lg"
                                    style={{
                                        color: data.editableProfileName.color || "#ffffff",
                                        fontSize: data.editableProfileName.fontSize || 16,
                                        textAlign: data.editableProfileName.textAlign || "left",
                                        display: data.editableProfileName.hidden ? "none" : "block",
                                    }}
                                >
                                    {data?.editableProfileName?.label || userData?.name}
                                </h1>
                                <p
                                    className="text-sm text-neutral-300 text-left"
                                    style={{
                                        color: data.editableProfileUsername.color || "#ffffff",
                                        fontSize: data.editableProfileUsername.fontSize || 16,
                                        textAlign: data.editableProfileUsername.textAlign || "left",
                                        display: data.editableProfileUsername.hidden ? "none" : "block",
                                    }}
                                >
                                    {data?.editableProfileUsername?.label || userData?.email?.split("@")[0]}
                                </p>
                            </div>
                        </div>
                    )}

                    {data.swipeButton && <ArrowRightCircle className="text-white w-7 h-7" />}
                </div>
            </div>

            {data.showEditingDiv && (
                <div className="mt-6 bg-white shadow-lg rounded-lg p-6 space-y-6 z-10 transition-all relative">
                    <Button className="absolute top-2 right-2" onClick={() => setData({ ...data, showEditingDiv: false })} type="primary" size="small">X</Button>
                    <div className="z-30 absolute top-0 left-0 m-4">
                        <Button
                            size="small"
                            className="mr-2 bg-red-600"
                            type="primary"
                            onClick={() => {
                                deleteItem(index);
                            }}
                        >
                            Delete
                        </Button>
                        <Button size="small" type="primary" onClick={() => {
                            setData({ ...data, showEditingDiv: false });
                            timeout(() => exportImage(), 1000);
                        }}>Export as image</Button>
                    </div>

                    <Tabs defaultActiveKey="1" items={tabs} />
                </div>
            )}
        </div>
    );
};

export default Template_1;
