"use client";

import React, { useState } from 'react';

interface Tab {
    id: number;
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <>
            {/* Tab Buttons */}
            <div className="bg-neutral-50 rounded grid grid-cols-2 w-full sm:w-1/2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`text-neutral-800 text-text-small font-bold py-3 rounded m-1 ${activeTab === tab.id ? 'bg-white' : 'transparent'}`}

                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Tabs;