import { Button, Input, Segmented, Switch, Upload, message, Space, ColorPicker, Tabs } from "antd";
import { ArrowRightCircle } from "lucide-react";
import { useState } from "react";
import html2canvas from "html2canvas";
import { SketchPicker } from 'react-color';

interface Template1Props {
    index: number;
    selectedSize: string;
    fontFamily: string;
    backgroundColor: string;
    template: number;
}

const Template_1: React.FC<Template1Props> = ({
    index,
    selectedSize,
    fontFamily,
    backgroundColor,
    template,
}) => {
    const [data, setData] = useState({
        editableTopic: "Topic",
        editableTitle: "Title",
        editableTagline: "Tagline",
        editableProfileName: "John Doe",
        editableProfileUsername: "@johndoe",
        editableButton: "Call to Action",
        alignText: "center",
        isLastItem: false,
        swipeButton: true,
        bgColor: backgroundColor,
        textColor: "#ffffff",
        showProfileImage: true,
        backgroundImage: null,
        profileImage: null,
    });

    // Handle background image upload
    const handleImageUpload = (info: any) => {
        if (info.file.status === 'done') {
            setData(prevData => ({
                ...prevData,
                backgroundImage: URL.createObjectURL(info.file.originFileObj)
            }));
        } else if (info.file.status === 'error') {
            message.error('Image upload failed');
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

    const tabs = [
        {
            key: 1,
            label: "Text",
            children: (
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Topic</label>
                        <Input value={data.editableTopic} onChange={(e) => setData({ ...data, editableTopic: e.target.value })} className="w-full" />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Title</label>
                        <Input value={data.editableTitle} onChange={(e) => setData({ ...data, editableTitle: e.target.value })} className="w-full" />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tagline</label>
                        <Input value={data.editableTagline} onChange={(e) => setData({ ...data, editableTagline: e.target.value })} className="w-full" />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Profile Name</label>
                        <Input value={data.editableProfileName} onChange={(e) => setData({ ...data, editableProfileName: e.target.value })} className="w-full" />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Profile Username</label>
                        <Input value={data.editableProfileUsername} onChange={(e) => setData({ ...data, editableProfileUsername: e.target.value })} className="w-full" />
                    </div>

                    <div>
                        <p className="text-xl font-semibold text-gray-800">Text Align</p>
                        <Segmented
                            value={data.alignText}
                            options={[
                                { label: "Left", value: "left" },
                                { label: "Center", value: "center" },
                                { label: "Right", value: "right" },
                            ]}
                            onChange={(value) => setData({ ...data, alignText: value })}
                        />
                    </div>
                </div>
            ),
        },
        {
            key: 2,
            label: "Buttons",
            children: (
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-gray-700 font-medium">Show Profile Image</label>
                        <Switch checked={data.showProfileImage} onChange={(checked) => setData({ ...data, showProfileImage: checked })} />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-gray-700 font-medium">Show CTA</label>
                        <Switch checked={data.isLastItem} onChange={(checked) => setData({ ...data, isLastItem: checked })} />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-gray-700 font-medium">Swipe</label>
                        <Switch checked={data.swipeButton} onChange={(checked) => setData({ ...data, swipeButton: checked })} />
                    </div>
                </div>
            ),
        },
        {
            key: 3,
            label: "Design",
            children: (
                <div className="flex flex-col space-y-4 items-start justify-start">
                    {/* Background Color Picker */}
                    <div className="text-left">
                        <h3 className="font-medium mb-2">Background Color</h3>
                        <ColorPicker
                            value={data.bgColor}
                            onChange={(_, color) => setData({ ...data, bgColor: color })}
                            showText
                            size="small"
                        />
                    </div>

                    {/* Text Color Picker */}
                    <div className="text-left">
                        <h3 className="font-medium mb-2">Text Color</h3>
                        <ColorPicker
                            value={data.textColor}
                            onChange={(_, color) => setData({ ...data, textColor: color })}
                            showText
                            size="small"
                        />
                    </div>
                </div>
            ),
        }, {
            key: 4,
            label: "Images",
            children: (
                <div className="flex flex-col space-y-4 items-start justify-start">
                    {/* Background Image */}
                    <div className="text-left">
                        <h3 className="font-medium mb-2">Background Image</h3>
                        <Upload
                            accept="image/*"
                            showUploadList={false}
                            onChange={handleImageUpload}
                        >
                            <Button type="primary">Upload Image</Button>
                        </Upload>
                    </div>

                    {/* Profile Image */}
                    <div className="text-left">
                        <h3 className="font-medium mb-2">Profile Image</h3>
                        <Upload
                            accept="image/*"
                            showUploadList={false}
                            onChange={(info) => {
                                if (info.file.status === 'done') {
                                    setData(prevData => ({
                                        ...prevData,
                                        profileImage: URL.createObjectURL(info.file.originFileObj)
                                    }));
                                } else if (info.file.status === 'error') {
                                    message.error('Image upload failed');
                                }
                            }}
                        >
                            <Button type="primary">Upload Image</Button>
                        </Upload>
                    </div>
                </div>
            ),
        }
    ];

    return (
        <div className="w-full h-full flex flex-col mt-12">
            <div
                key={index}
                id={`post-${index}`}
                className="w-full h-full flex flex-col justify-between p-12 relative cursor-pointer"
                style={{
                    width: `${parseInt(selectedSize.split("x")[0]) * 1.5}px`,
                    height: `${parseInt(selectedSize?.split("x")[1]) * 1.5}px`,
                    fontFamily,
                    backgroundColor: data.bgColor || "#7CA3C2",
                    backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                }}
                onClick={() => setData({ ...data, showEditingDiv: !data.showEditingDiv })}
            >
                <Button className="z-30 absolute top-[-30px] right-0" size="small">Delete</Button>
                <Button className="z-30 absolute top-[-30px] left-0" size="small" onClick={exportImage}>Export</Button>

                <div className={`z-10 relative ${data.alignText === "center" ? "text-center" : data.alignText === "left" ? "text-left" : "text-right"}`}>
                    <p className="text-neutral-300 text-lg mb-3" style={{ color: data.textColor }}>
                        {data.editableTopic}
                    </p>
                    <h1 className="text-white text-6xl font-bold leading-tight mb-4 break-words" style={{ color: data.textColor }}>
                        {data.editableTitle}
                    </h1>
                    {data.isLastItem ? (
                        <button className="bg-white text-black p-2 rounded-md">{data.editableButton}</button>
                    ) : (
                        <span className="text-neutral-300 text-2xl mt-5 block" style={{ color: data.textColor }}>
                            {data.editableTagline}
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-center w-full z-10 relative">
                    {data.showProfileImage && (
                        <div className="flex items-center space-x-4">
                            <div>
                                <img src={
                                    data.profileImage
                                        ? data.profileImage
                                        : "/images/profile.png"
                                } alt="Profile" className="w-12 h-12 rounded-full" />
                            </div>
                            <div>
                                <h1 className="text-white text-left font-semibold text-lg">{data.editableProfileName}</h1>
                                <p className="text-sm text-neutral-300 text-left">{data.editableProfileUsername}</p>
                            </div>
                        </div>
                    )}

                    {!data.isLastItem && data.swipeButton && <ArrowRightCircle className="text-white w-7 h-7" />}
                </div>
            </div>

            {data.showEditingDiv && (
                <div className="mt-6 bg-white shadow-lg rounded-lg p-6 space-y-6 z-10 transition-all relative">
                    <Button className="absolute top-2 right-2" onClick={() => setData({ ...data, showEditingDiv: false })} type="primary" size="small">X</Button>
                    <Tabs defaultActiveKey="1" items={tabs} />
                </div>
            )}
        </div>
    );
};

export default Template_1;
