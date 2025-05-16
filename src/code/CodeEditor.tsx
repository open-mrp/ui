"use client";

import copy from "copy-to-clipboard";
import React, { useEffect, useRef, useState } from "react";
import { highlightCode } from "../utils/highlight";
import CodeCopyButton from "./CodeCopyButton";

export interface CodeEditorProps {
  children: React.ReactNode;
  className?: string;
}

export default function CodeEditor({ children, className }: CodeEditorProps) {
  const codeRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [language, setLanguage] = useState<string | null>(null);
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    // Extract language from code block classes (language-*)
    if (codeRef.current) {
      const codeElement = codeRef.current.querySelector("code");
      if (codeElement && codeElement.className) {
        const match = codeElement.className.match(/language-([^\s]+)/);
        if (match && match[1]) {
          const lang = match[1];
          setLanguage(lang);
          // Get the code content
          const code = codeElement.textContent || "";
          // Apply syntax highlighting
          highlightCode(code, lang).then(setHighlightedCode);
        }
      }
    }
  }, [children]);

  const handleCopy = () => {
    if (codeRef.current) {
      const text = codeRef.current.textContent || "";
      copy(text);
      setCopied(true);

      // Reset to copy icon after 1 second
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  return (
    <div
      className={`bg-code-background p-4 rounded-md relative group mt-4 ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex justify-between items-center mb-2">
        <div
          className="text-xs text-gray-500 uppercase"
          style={{ height: "16px" }}
        >
          {language}
        </div>
      </div>

      <CodeCopyButton
        onCopy={handleCopy}
        isHovering={isHovering}
        copied={copied}
      />

      <div ref={codeRef} className="w-full">
        <pre className="text-sm overflow-x-auto w-full whitespace-pre">
          {highlightedCode ? (
            <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          ) : (
            children
          )}
        </pre>
      </div>
    </div>
  );
}
