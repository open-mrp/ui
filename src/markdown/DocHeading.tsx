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

function isReactElement(node: unknown): node is React.ReactElement {
  return React.isValidElement(node);
}

// Extract text content iteratively without recursion
function getTextContent(node: React.ReactNode): string {
  const parts: string[] = [];
  const stack: React.ReactNode[] = [node];
  let depth = 0;
  const MAX_DEPTH = 5;

  while (stack.length > 0) {
    depth++;
    // Prevent infinite recursion and set reasonable limit to depth
    if (depth > MAX_DEPTH) {
      throw new Error(
        `Maximum stack depth of ${MAX_DEPTH} exceeded in getTextContent. This might indicate a circular reference in your React components.`
      );
    }

    const current = stack.pop();

    if (current === null || current === undefined) {
      continue;
    }

    if (typeof current === "string") {
      parts.push(current);
      continue;
    }

    if (typeof current === "number") {
      parts.push(current.toString());
      continue;
    }

    if (Array.isArray(current)) {
      // Push in reverse order to maintain left-to-right processing
      for (let i = current.length - 1; i >= 0; i--) {
        stack.push(current[i]);
      }
      continue;
    }

    if (isReactElement(current)) {
      const { props } = current;

      // Check if component has identifier props (like tableName, prefixId)
      if (typeof current.type === "function" && props) {
        // Look for string properties that might be identifiers
        const stringProps = Object.entries(props)
          .filter(
            ([key, value]) => typeof value === "string" && key !== "className"
          )
          .map(([_, value]) => value as string);

        if (stringProps.length > 0) {
          parts.push(stringProps[0]);
          continue;
        }
      }

      // Process children if present
      if (props && typeof props === "object" && "children" in props) {
        stack.push((props as { children: React.ReactNode }).children);
      }
      continue;
    }

    // For any other type, convert to string
    parts.push(String(current));
  }

  return parts.join("");
}

// Create a slug from text content
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function DocHeading({
  children,
  level = 2,
  className = "",
  number,
}: DocHeadingProps) {
  const id = useMemo(() => createSlug(getTextContent(children)), [children]);

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
