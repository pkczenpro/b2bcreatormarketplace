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
  const getInitialTab = (): number => {
    if (!tabs.length) return 0; // fallback if no tabs provided

    if (localStorageKey && typeof window !== "undefined") {
      const storedTab = localStorage.getItem(localStorageKey);
      if (storedTab) {
        const parsedTab = parseInt(storedTab, 10);
        if (tabs.some((tab) => tab.id === parsedTab)) {
          return parsedTab;
        }
      }
    }
    return tabs[0].id;
  };

  const [activeTab, setActiveTab] = useState<number>(getInitialTab);

  useEffect(() => {
    if (localStorageKey && typeof window !== "undefined") {
      localStorage.setItem(localStorageKey, activeTab.toString());
    }
  }, [activeTab, localStorageKey]);

  return (
    <>
      {/* Tab Buttons */}
      <div className="bg-neutral-50 rounded flex flex-row w-full sm:w-1/2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-neutral-800 text-text-medium font-bold py-3 rounded m-1 ${activeTab === tab.id ? "bg-white" : "bg-transparent"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content || null}
      </div>
    </>
  );
};

export default Tabs;
