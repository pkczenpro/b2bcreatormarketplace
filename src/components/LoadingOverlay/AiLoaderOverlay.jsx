import { Spin } from "antd";
import React from "react";

const AiLoaderOverlay = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                <Spin size="large" />
                <div className="text-gray-800 text-lg font-semibold text-center">
                    Let’s AI create the magic for you ✨
                </div>
            </div>
        </div>
    );
};

export default AiLoaderOverlay;
