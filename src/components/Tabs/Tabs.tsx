"use client";

import React, { useState, useEffect } from "react";

interface Tab {
  id: number;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  localStorageKey?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, localStorageKey }) => {
  const LOCAL_STORAGE_KEY = localStorageKey;

  // Retrieve the last active tab from localStorage or default to the first tab
  const [activeTab, setActiveTab] = useState<number>(() => {
    if (!localStorageKey) return tabs[0].id;

    if (typeof window !== "undefined") { // Ensure we're in a browser environment
      const storedTab = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedTab ? parseInt(storedTab, 10) : tabs[0].id;
    }
    return tabs[0].id;
  });

  // Update localStorage when activeTab changes
  useEffect(() => {
    if (localStorageKey && typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, activeTab.toString());
    }
  }, [activeTab]);

  return (
    <>
      {/* Tab Buttons */}
      <div className="bg-neutral-50 rounded flex flex-row w-full sm:w-1/2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-neutral-800 text-text-medium font-bold py-3 rounded m-1 ${activeTab === tab.id ? "bg-white" : "transparent"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.map((tab) => (
          <div key={tab.id} className={`${activeTab === tab.id ? "block" : "hidden"}`}>
            {tab.content}
          </div>
        ))}
      </div>
    </>
  );
};

export default Tabs;
