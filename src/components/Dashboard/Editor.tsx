import { Button, Modal, Select } from "antd";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import Template_1 from "./TEMPLATES/Template_1";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const TEMPLATES = [
    { id: 1, name: "Template 1", size: "288x360", component: Template_1, bgColor: "#000" },
    { id: 2, name: "Template 2", size: "288x360", component: null, bgColor: "#7CA3C2" },
    { id: 3, name: "Template 3", size: "288x360", component: null, bgColor: "#BF8A5B" },
    { id: 4, name: "Template 4", size: "288x360", component: null, bgColor: "#814EB3" },
];

const CarouselEditor = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [posts, setPosts] = useState([0]);
    const [backgroundColor, setBackgroundColor] = useState("#1677ff");

    const fontFamilies = ["Arial", "Courier New", "Georgia", "Lucida Console", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana"];
    const templateSizes = [
        {
            value: "360x360",
            label: "LinkedIn (4:5)"
        },
        {
            value: "288x360",
            label: "LinkedIn (1:1)"
        }
    ];

    const [selectedSize, setSelectedSize] = useState("288x360");

    const addPost = () => {
        setPosts([...posts, posts.length]);
    };

    const deletePost = (index) => {
        setPosts(posts.filter((_, i) => i !== index));
    };

    const exportPost = (index) => {
        const postElement = document.getElementById(`post-${index}`);
        if (postElement) {
            html2canvas(postElement, { backgroundColor: null }).then((canvas) => {
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = `carousel_${index + 1}.png`;
                link.click();
            });
        }
    };

    const [showTemplates, setShowTemplates] = useState(false);
    const showTemplatesModal = () => {
        return (
            <Modal
                width={"70vw"}
                title="Select Template"
                open={showTemplates}
                onCancel={() => setShowTemplates(false)}
                footer={null}
                centered
            >
                <div className="flex flex-col">
                    <div className="max-w-[75vw] flex justify-start items-center overflow-x-auto p-4 scroll-smooth h-[100%]">
                        <div className="flex flex-row space-x-8">
                            {TEMPLATES.map((item, index) => {
                                const TemplateComponent = item.component;
                                return (
                                    <div key={index} className="relative">
                                        <div id={`post-${index}`} className="flex flex-col justify-center items-center text-center" style={{ width: `${parseInt(selectedSize.split("x")[0]) * 1.5}px`, height: `${parseInt(selectedTemplate.size.split("x")[1]) * 1.5}px`, fontFamily: fontFamily }}>
                                            <TemplateComponent
                                                index={index}
                                                isLastItem={index === posts.length - 1 && posts.length > 1}
                                            />

                                            <button className="w-full bg-primary-500 text-white py-2 rounded-md mt-4" onClick={() => {
                                                setSelectedTemplate(item);
                                                setShowTemplates(false);
                                            }
                                            }>
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }


    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    // Scroll left function
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    // Scroll right function
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    return (
        <div className="flex w-full min-h-[80vh]">
            {showTemplatesModal()}
            <div className="min-w-[15vw] max-w-[15vw] max-h-[80vh] border-r border-neutral-200 p-6 flex flex-col justify-between bg-white">
                <div>
                    <h3 className="font-medium mb-2">Template Size</h3>
                    <Select className="w-full mb-2" value={selectedSize} onChange={(value) => setSelectedSize(value)}>
                        {templateSizes.map((size) => (
                            <Select.Option key={size.value} value={size.value}>{size.label}</Select.Option>
                        ))}
                    </Select>
                    <Select className="w-full mb-2" value={selectedTemplate.name} onChange={(value) => setSelectedTemplate(TEMPLATES.find((t) => t.name === value) || selectedTemplate)}>
                        {TEMPLATES.map((template) => (
                            <Select.Option key={template.id} value={template.name}>{template.name}</Select.Option>
                        ))}
                    </Select>

                    <Button
                        className="w-full"
                        onClick={() => {
                            setShowTemplates(true);
                        }}
                    >
                        Change Carousel Template
                    </Button>

                    <div className="border-t border-neutral-200 my-4"></div>

                    <h3 className="font-medium mb-2">Font</h3>
                    <Select className="w-full mb-2" value={fontFamily} onChange={(value) => setFontFamily(value)}>
                        {fontFamilies.map((font, index) => (
                            <Select.Option key={index} value={font}>{font}</Select.Option>
                        ))}
                    </Select>



                    <div className="border-t border-neutral-200 my-4"></div>
                    <Button className="w-full mb-2" size="small" onClick={addPost}>Add Post</Button>
                </div>


                <div>
                    <Button
                        type="primary"
                        className="w-full mb-2 bg-primary-700 text-white">
                        Publish To LinkedIn
                    </Button>
                    <Button className="w-full flex items-center">
                        <Clock
                            size={16}
                        />   Schedule Post
                    </Button>
                </div>
            </div>

            <motion.div key={selectedTemplate.id} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }} className="w-full bg-white relative z-2">
                {/* <CanvasBackground /> */}
                {/* Scroll Buttons */}
                <button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow-md"
                    onClick={scrollLeft}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow-md"
                    onClick={scrollRight}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
                <div className="min-w-[100%] max-w-[79vw] flex justify-start items-center overflow-x-hidden scroll-smooth h-[100%] px-24 py-12" ref={scrollContainerRef}>
                    <div className="flex space-x-6">
                        {posts.map((index) => {
                            return (
                                <div key={index} id={`post-${index}`} className="flex justify-center items-center text-center" >
                                    <Template_1
                                        selectedSize={selectedSize}
                                        fontFamily={fontFamily}
                                        index={index}
                                        backgroundColor={selectedTemplate.bgColor || backgroundColor}
                                        template={selectedTemplate.id}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div >


        </div >
    );
};

export default CarouselEditor;
