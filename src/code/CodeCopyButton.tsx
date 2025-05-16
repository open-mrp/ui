import { CheckIcon, CopyIcon } from "@/icons";
import React from "react";

export interface CodeCopyButtonProps {
  onCopy: () => void;
  isHovering: boolean;
  copied: boolean;
}

export default function CodeCopyButton({
  onCopy,
  isHovering,
  copied,
}: CodeCopyButtonProps) {
  return (
    <button
      onClick={onCopy}
      className={`absolute top-2 right-2 z-10
        text-sm bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded
        flex items-center gap-1 
        transition-all duration-300 ease-in-out
        ${isHovering ? "opacity-100" : "opacity-0"}`}
      aria-label={copied ? "Copied!" : "Copy code"}
    >
      <div className="relative w-16 h-5 flex items-center justify-center overflow-hidden">
        <div
          className={`absolute inset-0 flex items-center justify-center
            transition-transform duration-300 ease-in-out
            ${copied ? "-translate-y-full" : "translate-y-0"}`}
        >
          <div className="flex items-center gap-1">
            <CopyIcon />
            <span>Copy</span>
          </div>
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center
            transition-transform duration-300 ease-in-out
            ${copied ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex items-center gap-1">
            <CheckIcon />
            <span>Copied!</span>
          </div>
        </div>
      </div>
    </button>
  );
}
