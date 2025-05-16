import { cn } from "@/utils/cn";
import React, { ReactNode } from "react";

export interface DocTabProps {
  label: string;
  children: ReactNode;
  showContent?: boolean;
  isActive?: boolean;
  onSelect?: (label: string) => void;
}

export default function DocTab({
  label,
  children,
  showContent = true,
  isActive = false,
  onSelect,
}: DocTabProps) {
  if (!showContent) {
    return (
      <button
        onClick={() => onSelect?.(label)}
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
