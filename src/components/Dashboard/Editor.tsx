import { Button, Input, Select } from "antd";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import Template_1 from "./TEMPLATES/Template_1";
import Template_2 from "./TEMPLATES/Template_2";
import Template_3 from "./TEMPLATES/Template_3";
import Template_4 from "./TEMPLATES/Template_4";

// Templates data
const TEMPLATES = [
    {
        id: 1,
        name: "Template 1",
        size: "288x360",
        component: Template_1,
    },
    {
        id: 2,
        name: "Template 2",
        size: "288x360",
        component: Template_2,
    },
    {
        id: 3,
        name: "Template 3",
        size: "288x360",
        component: Template_3,
    },
    {
        id: 4,
        name: "Template 4",
        size: "288x360",
        component: Template_4,
    },
];

const CarouselEditor = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [fontFamily, setFontFamily] = useState("Arial");
    const fontFamilies = [
        "Arial",
        "Courier New",
        "Georgia",
        "Lucida Console",
        "Tahoma",
        "Times New Roman",
        "Trebuchet MS",
        "Verdana",
    ]

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

    // Export All Images Function
    const exportAllImages = () => {
        [...Array(4)].forEach((_, index) => {
            exportImage(index); // Reuse exportImage for each post
        });
    };

    return (
        <div className="flex w-full min-h-[80vh]">
            {/* Left Panel */}
            <div className="min-w-[15vw] border-r border-neutral-200 p-6">
                <h3 className="font-medium mb-2">Template</h3>
                <Select
                    className="w-full mb-2"
                    value={selectedTemplate.name}
                    onChange={(value) =>
                        setSelectedTemplate(
                            TEMPLATES.find((template) => template.name === value) || selectedTemplate
                        )
                    }
                >
                    {TEMPLATES.map((template) => (
                        <Select.Option key={template.id} value={template.name}>
                            {template.name}
                        </Select.Option>
                    ))}
                </Select>

                {/* Size Selection */}
                <h3 className="font-medium mb-2">Size</h3>
                <Select
                    className="w-full mb-2"
                    value={selectedTemplate.size}
                    onChange={(value) => setSelectedTemplate({ ...selectedTemplate, size: value })}
                >
                    {TEMPLATES
                        .map((template) => template.size) // Get all size values
                        .filter((value, index, self) => self.indexOf(value) === index) // Filter out duplicates
                        .map((size, index) => (
                            <Select.Option key={index} value={size}>
                                {size}
                            </Select.Option>
                        ))}
                </Select>
                {/* Font Selection */}
                <h3 className="font-medium mb-2">Font</h3>
                <Select
                    className="w-full mb-2"
                    value={fontFamily}
                    onChange={(value) => setFontFamily(value)}
                >
                    {
                        fontFamilies.map((font, index) => (
                            <Select.Option key={index} value={font}>
                                {font}
                            </Select.Option>
                        ))
                    }
                </Select>
                <div className="border-t border-neutral-200 my-4"></div>
                <Button className="w-full mb-2" size="small" onClick={exportAllImages}>
                    Export All as Images
                </Button>
                <Button className="w-full" size="small">
                    Save Carousel
                </Button>
            </div>

            {/* Right Panel - Carousel Display */}
            <motion.div
                key={selectedTemplate.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="m-12"
            >
                <div className="max-w-[75vw] flex justify-start items-center overflow-x-auto p-4 scroll-smooth">
                    <div className="flex space-x-6">
                        {[...Array(4)].map((_, index) => {
                            const TemplateComponent = selectedTemplate.component;
                            return (
                                <div
                                    key={index}
                                    id={`post-${index}`} // Unique ID for each post
                                    className={`relative flex justify-center items-center text-center`}
                                    style={{
                                        width: `${parseInt(selectedTemplate.size.split("x")[0]) * 1.5}px`,
                                        height: `${parseInt(selectedTemplate.size.split("x")[1]) * 1.5}px`,
                                        fontFamily: fontFamily,
                                    }}
                                >
                                    <TemplateComponent
                                        index={index}
                                        isLastItem={index === 3}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div >
    );
};

export default CarouselEditor;
