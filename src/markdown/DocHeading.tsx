import CheckIcon from "@/icons/CheckIcon";
import CopyIcon from "@/icons/CopyIcon";
import React, { createElement, useState } from "react";

export interface DocHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  number?: number;
}

export default function DocHeading({
  children,
  level = 2,
  className = "",
  number,
}: DocHeadingProps) {
  const id = children?.toString().toLowerCase().replace(/ /g, "-");
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Create a URL with the hash
    const url = window.location.href.split("#")[0] + `#${id}`;

    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return createElement(
    `h${level}`,
    {
      className: `text-2xl font-bold w-full group ${className}`,
      id,
    },
    <>
      <div className="flex items-center gap-2">
        {number !== undefined && (
          <span className="text-gray-500">{number}</span>
        )}
        <span>{children}</span>
        <button
          onClick={handleCopy}
          className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out focus:opacity-100 focus:outline-none cursor-pointer"
          aria-label="Copy link to section"
        >
          <div className="relative w-4 h-4">
            <span
              className={`absolute inset-0 transition-opacity ${
                copied
                  ? "opacity-0 duration-0"
                  : "opacity-100 duration-300 ease-in-out"
              }`}
            >
              <CopyIcon />
            </span>
            <span
              className={`absolute inset-0 transition-opacity ${
                copied
                  ? "opacity-100 duration-300 ease-in-out"
                  : "opacity-0 duration-0"
              }`}
            >
              <CheckIcon />
            </span>
          </div>
        </button>
      </div>
    </>
  );
}
