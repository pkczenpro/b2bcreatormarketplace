import { Spin } from "antd";
import React from "react";

const LoadingOverlay = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <Spin />
                    <div className="ml-2 text-gray-900">Loading...</div>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
