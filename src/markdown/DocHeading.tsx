"use client";

import CheckIcon from "@/icons/CheckIcon";
import CopyIcon from "@/icons/CopyIcon";
import React, { createElement, useMemo, useState } from "react";

export interface DocHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  number?: number;
}

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return node.toString();
  if (node === null || node === undefined) return "";
  if (Array.isArray(node)) return node.map(getTextContent).join("");

  // Handle React elements
  if (typeof node === "object" && node !== null) {
    // Check if it's a React element
    if (React.isValidElement(node)) {
      const element = node as {
        type: string | React.ComponentType<unknown>;
        props: { children?: React.ReactNode; tableName?: string };
      };

      // If it's a string type (like a span), use the children
      if (typeof element.type === "string") {
        return getTextContent(element.props.children);
      }
      // If it's a component, try to get text from its children
      return getTextContent(element.props.children);
    }
    // Fallback for other objects
    return String(node);
  }
  return "";
}

export default function DocHeading({
  children,
  level = 2,
  className = "",
  number,
}: DocHeadingProps) {
  const id = useMemo(
    () =>
      getTextContent(children)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    [children]
  );

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
