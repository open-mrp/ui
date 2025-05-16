import { cn } from "@/utils/cn";
import React, { ReactNode, useContext } from "react";
import { DocTabsContext } from "./DocTabs";

export interface DocTabProps {
  label: string;
  children: ReactNode;
  showContent?: boolean;
}

export default function DocTab({ label, children, showContent = true }: DocTabProps) {
  const context = useContext(DocTabsContext);
  if (!context) throw new Error("DocTab must be used within DocTabs");

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === label;

  if (!showContent) {
    return (
      <button
        onClick={() => setActiveTab(label)}
        className={cn(
          "py-4 px-4 border-b-2 font-medium text-sm transition-colors cursor-pointer",
          isActive
            ? "border-primary-500 text-primary-500"
            : "border-transparent text-text-secondary hover:text-text-primary hover:border-text-primary/50"
        )}
        aria-selected={isActive}
        role="tab"
      >
        {label}
      </button>
    );
  }

  return isActive ? (
    <div role="tabpanel" className="transition-opacity duration-200">
      {children}
    </div>
  ) : null;
}
