import ChevronDownIcon from "@/icons/ChevronDownIcon";
import ChevronUpIcon from "@/icons/ChevronUpIcon";
import { cn } from "@/utils/cn";
import React, { useState } from "react";
import DocHeading from "./DocHeading";

export interface DocNumberedSectionProps {
  children: React.ReactNode;
  number: number;
  title: string;
  className?: string;
}

export default function DocNumberedSection({
  children,
  number,
  title,
  className,
}: DocNumberedSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={cn("border-t border-[var(--text-secondary)]/20", className)}
    >
      <div
        className="w-full flex items-center gap-2 justify-between rounded-lg transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <DocHeading level={3} number={number} className="!font-semibold">
          {title}
        </DocHeading>
        <div className="flex items-center gap-2 pt-4">
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <div
          className={`transform transition-all duration-300 ease-in-out ${
            isOpen
              ? "translate-y-0 scale-y-100 opacity-100"
              : "-translate-y-4 scale-y-95 opacity-0"
          }`}
        >
          <div className="pb-8 pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
