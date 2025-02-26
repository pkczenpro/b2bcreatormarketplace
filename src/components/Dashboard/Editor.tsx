// components/CarouselEditor.js

import { Select } from "antd";
import { useState } from "react";
import Button from "../Button/Button";

const TEMPLATES = [
    {
        id: 1,
        name: "Template 1",
        size: "540x540",
        font: "font-sans",
        background: "bg-white",
        backgroundElement: "gradient-spots",
    },
    {
        id: 2,
        name: "Template 2",
        size: "960x540",
        font: "font-serif",
        background: "bg-gray-200",
        backgroundElement: "gradient-lines",
    },
    {
        id: 3,
        name: "Template 3",
        size: "540x960",
        font: "font-mono",
        background: "bg-blue-200",
        backgroundElement: "gradient-circles",
    },
]



const CarouselEditor = () => {
    // State for selected template size, typography, background, and canvas elements
    const [selectedSize, setSelectedSize] = useState("540x540");
    const [selectedFont, setSelectedFont] = useState("font-sans");
    const [selectedBackground, setSelectedBackground] = useState("bg-white");
    const [canvasText, setCanvasText] = useState("Edit this text...");
    const [selectedBackgroundElement, setSelectedBackgroundElement] = useState("");

    // Template sizes
    const sizes = [
        { label: "Square (1080x1080)", value: "540x540" },
        { label: "Landscape (1920x1080)", value: "960x540" },
        { label: "Portrait (1080x1920)", value: "540x960" },
    ];

    // Fonts
    const fonts = ["font-sans", "font-serif", "font-mono"];

    // Backgrounds
    const backgrounds = [
        "bg-white",
        "bg-gray-200",
        "bg-blue-200",
        "bg-red-200",
        "bg-green-200",
    ];

    // Background elements
    const backgroundElements = [
        "gradient-spots",
        "gradient-lines",
        "gradient-circles",
    ];

    return (
        <div className="flex w-full min-h-[80vh]">
            {/* Left panel */}
            <div className="w-[25vw] border-r border-neutral-200 p-6">
                {/* Template Size Selector */}
                <div className="mb-2">
                    <h3 className="font-medium mb-2">Template Size</h3>
                    <Select
                        className="w-full"
                        value={selectedSize}
                        onChange={(value) => setSelectedSize(value)}
                    >
                        {sizes.map((size) => (
                            <Select.Option key={size.value} value={size.value}>
                                {size.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <Button
                    className="w-full mb-2"
                    onClick={() => alert("Change Carousel Template clicked")}
                    variant="outline"
                    size="small"
                >
                    Change Carousel Template
                </Button>

                <div className="border-b border-gray-300 my-4"></div>

                {/* Background Selector */}
                <div className="mb-2">
                    <h3 className="font-medium mb-2">Background</h3>
                    <Select
                        className="w-full"
                        value={selectedBackground}
                        dropdownClassName="w-48"
                        onChange={(value) => setSelectedBackground(value)}
                    >
                        {backgrounds.map((bg) => (
                            <Select.Option key={bg} value={bg}>
                                {bg}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                {/* Background Elements Selector */}
                <div className="mb-2">
                    <h3 className="font-medium mb-2">Background Elements</h3>
                    <Select
                        className="w-full"
                        value={selectedBackgroundElement}
                        dropdownClassName="w-48"
                        onChange={(value) => setSelectedBackgroundElement(value)}
                    >
                        {backgroundElements.map((element) => (
                            <Select.Option key={element} value={element}>
                                {element}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <div className="border-b border-gray-300 my-4"></div>

                {/* Typography Selector */}
                <div className="mb-2">
                    <h3 className="font-medium mb-2">Typography</h3>
                    <Select
                        className="w-full"
                        value={selectedFont}
                        dropdownClassName="w-48"
                        onChange={(value) => setSelectedFont(value)}
                    >
                        {fonts.map((font) => (
                            <Select.Option key={font} value={font}>
                                {font}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                {/* Text Input for Canvas */}
                <div className="mb-6">
                    <h3 className="font-medium mb-2">Edit Text</h3>
                    <input
                        type="text"
                        value={canvasText}
                        onChange={(e) => setCanvasText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
            </div>

            {/* Right panel (Canvas) */}
            <div
                className={`w-[100%] flex justify-center items-center`}
                style={{
                    width: selectedSize.split("x")[0],
                    height: selectedSize.split("x")[1],
                    background: 'white',
                    backgroundImage: 'radial-gradient(#E0E2E7 2px, transparent 0)',
                    backgroundSize: '100px 100px',
                    backgroundPosition: '-25px -25px',
                }}
            >
                <div
                    className={`w-full h-full flex justify-center items-center text-center ${selectedFont} border border-neutral-200 ${selectedBackground}`}
                    style={{
                        width: selectedSize.split("x")[0] + "px",
                        height: selectedSize.split("x")[1] + "px",
                    }}
                >
                    <p className="text-xl font-bold">{canvasText}</p>
                </div>
            </div>
        </div>
    );
};

export default CarouselEditor;
