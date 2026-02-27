'use client';

import copy from 'copy-to-clipboard';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { highlightCode } from '../utils/highlight';
import CodeCopyButton from './CodeCopyButton';
import { findFoldRegions, type FoldRegion } from './findFoldRegions';
import { splitHighlightedLines } from './splitHighlightedLines';

export interface CodeEditorProps {
    children: React.ReactNode;
    className?: string;
    /** Optional map of placeholder strings to replacement values (e.g., { "YOUR_API_KEY": "sk_test_..." }) */
    replacements?: Record<string, string>;
}

/**
 * Applies text replacements to a string
 */
function applyReplacements(text: string, replacements?: Record<string, string>): string {
    if (!replacements) return text;
    let result = text;
    for (const [placeholder, value] of Object.entries(replacements)) {
        result = result.replaceAll(placeholder, value);
    }
    return result;
}

export default function CodeEditor({ children, className, replacements }: CodeEditorProps) {
    const codeRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [language, setLanguage] = useState<string | null>(null);
    const [highlightedLines, setHighlightedLines] = useState<string[]>([]);
    const [rawCode, setRawCode] = useState('');
    const [foldedLines, setFoldedLines] = useState<Set<number>>(new Set());

    const foldRegions = useMemo(
        () => findFoldRegions(rawCode, language ?? undefined),
        [rawCode, language],
    );

    const foldableLineMap = useMemo(() => {
        const map = new Map<number, FoldRegion>();
        for (const region of foldRegions) {
            if (!map.has(region.startLine)) {
                map.set(region.startLine, region);
            }
        }
        return map;
    }, [foldRegions]);

    useEffect(() => {
        if (codeRef.current) {
            const codeElement = codeRef.current.querySelector('code');
            if (codeElement && codeElement.className) {
                const match = codeElement.className.match(/language-([^\s]+)/);
                if (match && match[1]) {
                    const lang = match[1];
                    setLanguage(lang);
                    const rawText = codeElement.textContent || '';
                    const code = applyReplacements(rawText, replacements);
                    setRawCode(code);
                    highlightCode(code, lang).then((html) => {
                        setHighlightedLines(splitHighlightedLines(html));
                    });
                }
            }
        }
    }, [children, replacements]);

    const toggleFold = useCallback((startLine: number) => {
        setFoldedLines((prev) => {
            const next = new Set(prev);
            if (next.has(startLine)) {
                next.delete(startLine);
            } else {
                next.add(startLine);
            }
            return next;
        });
    }, []);

    const rawLines = useMemo(() => rawCode.split('\n'), [rawCode]);

    const hiddenLines = useMemo(() => {
        const hidden = new Set<number>();
        for (const startLine of foldedLines) {
            const region = foldableLineMap.get(startLine);
            if (region) {
                for (let i = startLine + 1; i <= region.endLine; i++) {
                    hidden.add(i);
                }
            }
        }
        return hidden;
    }, [foldedLines, foldableLineMap]);

    const handleCopy = () => {
        const text = rawCode || codeRef.current?.textContent || '';
        copy(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    return (
        <div
            className={`bg-code-background p-4 rounded-md relative group mt-4 ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-500 uppercase" style={{ height: '16px' }}>
                    {language}
                </div>
            </div>

            <CodeCopyButton onCopy={handleCopy} isHovering={isHovering} copied={copied} />

            {/* Hidden container for extracting raw code from children */}
            <div ref={codeRef} style={{ position: 'absolute', left: -9999, top: -9999 }}>
                {children}
            </div>

            <div className="w-full">
                {highlightedLines.length > 0 ? (
                    <pre className="hljs text-sm overflow-x-auto w-full whitespace-pre !leading-relaxed">
                        <code className="block w-max min-w-full">
                        {highlightedLines.map((html, i) => {
                            const hidden = hiddenLines.has(i);
                            const isFoldStart = foldableLineMap.has(i);
                            const isFolded = foldedLines.has(i);

                            return (
                                <div
                                    key={i}
                                    className="grid transition-[grid-template-rows] duration-200 ease-in-out"
                                    style={{
                                        gridTemplateRows: hidden ? '0fr' : '1fr',
                                    }}
                                >
                                    <div
                                        className="overflow-hidden transition-opacity duration-200 ease-in-out"
                                        style={{ opacity: hidden ? 0 : 1 }}
                                    >
                                        <div className="flex">
                                            <span
                                                className="inline-flex items-center justify-center w-5 shrink-0 select-none"
                                                aria-hidden="true"
                                            >
                                                {isFoldStart && (
                                                    <button
                                                        onClick={() => toggleFold(i)}
                                                        className="text-gray-600 hover:text-gray-400 leading-none p-0 bg-transparent border-none cursor-pointer"
                                                        style={{ fontSize: '0.5rem' }}
                                                        aria-label={
                                                            isFolded
                                                                ? 'Expand code block'
                                                                : 'Collapse code block'
                                                        }
                                                    >
                                                        <svg
                                                            className={`w-3 h-3 transition-transform duration-150 ${isFolded ? '' : 'rotate-90'}`}
                                                            viewBox="0 0 8 8"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M2 1 L6 4 L2 7 Z" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </span>
                                            <span className="flex-1">
                                                <span
                                                    dangerouslySetInnerHTML={{ __html: html }}
                                                />
                                                {isFolded && (() => {
                                                    const region = foldableLineMap.get(i);
                                                    const endText =
                                                        region?.type === 'bracket'
                                                            ? ` ${rawLines[region.endLine]?.trim()}`
                                                            : '';
                                                    return (
                                                        <span className="text-gray-300 ml-2 bg-gray-600/40 px-2 py-0.5 rounded-sm border border-gray-500/30 animate-in fade-in duration-200">
                                                            &hellip;{endText}
                                                        </span>
                                                    );
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        </code>
                    </pre>
                ) : (
                    <pre className="text-sm overflow-x-auto w-full whitespace-pre">{children}</pre>
                )}
            </div>
        </div>
    );
}
