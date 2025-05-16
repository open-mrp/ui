import { cn } from "@/utils/cn";
import React, { ReactNode, useEffect, useState } from "react";
import { DocTabProps } from "./DocTab";

export interface DocTabsProps {
  children: ReactNode;
  defaultTab?: string;
  className?: string;
}

export default function DocTabs({
  children,
  defaultTab,
  className,
}: DocTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || "");

  useEffect(() => {
    if (!activeTab && React.Children.count(children) > 0) {
      const firstChild = React.Children.toArray(children)[0];
      if (React.isValidElement<DocTabProps>(firstChild)) {
        setActiveTab(firstChild.props.label);
      }
    }
  }, [activeTab, children]);

  return (
    <div className={cn("w-full", className)}>
      <div className="border-b border-[var(--text-secondary)]/20">
        <nav className="flex space-x-0" aria-label="Tabs">
          {React.Children.map(children, (child) => {
            if (React.isValidElement<DocTabProps>(child)) {
              return React.cloneElement(child, {
                showContent: false,
                isActive: activeTab === child.props.label,
                onSelect: setActiveTab,
              });
            }
            return child;
          })}
        </nav>
      </div>
      <div className="mt-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement<DocTabProps>(child)) {
            return React.cloneElement(child, {
              showContent: true,
              isActive: activeTab === child.props.label,
              onSelect: setActiveTab,
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}
