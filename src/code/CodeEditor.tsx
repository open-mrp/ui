'use client';

import copy from 'copy-to-clipboard';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { highlightCode } from '../utils/highlight';
import CodeCopyButton from './CodeCopyButton';
import { findFoldRegions, type FoldRegion } from './findFoldRegions';
import { splitHighlightedLines } from './splitHighlightedLines';

/**
 * A replacement value. Pass a string to use the same text for both display and
 * copy, or `{ display, copy }` to show a shortened/pretty value in the
 * rendered snippet while the copy button hands back the full value.
 */
export type ReplacementValue = string | { display: string; copy: string };

export interface CodeEditorProps {
    children: React.ReactNode;
    className?: string;
    /** Scrollable height (in px if number) for the code area */
    height?: number | string;
    /** Maximum scrollable height (in px if number) for the code area */
    maxHeight?: number | string;
    /** Optional map of placeholder strings to replacement values (e.g., { "YOUR_API_KEY": "sk_test_..." }) */
    replacements?: Record<string, ReplacementValue>;
    /** When true (default), show the detected language label in the header */
    showLanguageLabel?: boolean;
}

function applyReplacements(
    text: string,
    replacements: Record<string, ReplacementValue> | undefined,
    variant: 'display' | 'copy',
): string {
    if (!replacements) return text;
    let result = text;
    for (const [placeholder, value] of Object.entries(replacements)) {
        const replacement = typeof value === 'string' ? value : value[variant];
        result = result.replaceAll(placeholder, replacement);
    }
    return result;
}

export default function CodeEditor({
    children,
    className,
    height,
    maxHeight,
    replacements,
    showLanguageLabel = true,
}: CodeEditorProps) {
    const codeRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [language, setLanguage] = useState<string | null>(null);
    const [highlightedLines, setHighlightedLines] = useState<string[]>([]);
    const [displayCode, setDisplayCode] = useState('');
    const [copyCode, setCopyCode] = useState('');
    const [foldedLines, setFoldedLines] = useState<Set<number>>(new Set());
    const [activeLine, setActiveLine] = useState<number | null>(null);
    const [gutterHovered, setGutterHovered] = useState(false);

    const foldRegions = useMemo(
        () => findFoldRegions(displayCode, language ?? undefined),
        [displayCode, language],
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
                    const displayText = applyReplacements(rawText, replacements, 'display');
                    const copyText = applyReplacements(rawText, replacements, 'copy');
                    setDisplayCode(displayText);
                    setCopyCode(copyText);
                    highlightCode(displayText, lang).then((html) => {
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

    const rawLines = useMemo(() => displayCode.split('\n'), [displayCode]);

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

    const lineNumberWidth = useMemo(
        () => `${Math.max(2, String(highlightedLines.length).length)}ch`,
        [highlightedLines.length],
    );

    const handleCopy = () => {
        const text = copyCode || codeRef.current?.textContent || '';
        copy(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    const resolvedHeight = height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined;
    const resolvedMaxHeight =
        maxHeight !== undefined ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined;

    const outerStyle =
        resolvedHeight !== undefined || resolvedMaxHeight !== undefined
            ? {
                  ...(resolvedHeight !== undefined ? { height: resolvedHeight } : null),
                  ...(resolvedMaxHeight !== undefined ? { maxHeight: resolvedMaxHeight } : null),
              }
            : undefined;

    const scrollAreaStyle: React.CSSProperties | undefined =
        resolvedHeight !== undefined
            ? {
                  height: '100%',
                  ...(resolvedMaxHeight !== undefined ? { maxHeight: resolvedMaxHeight } : null),
              }
            : resolvedMaxHeight !== undefined
              ? { maxHeight: resolvedMaxHeight }
              : undefined;

    return (
        <div
            className={`bg-code-background pb-0 rounded-md relative group mt-4 flex flex-col ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={outerStyle}
        >
            {showLanguageLabel && (
                <div
                    className="absolute left-0 top-0 right-0 z-20 h-10 px-4 rounded-t-md rounded-b-none backdrop-blur-md flex items-center"
                    style={{
                        backgroundColor:
                            'color-mix(in srgb, var(--color-code-background) 20%, transparent)',
                    }}
                >
                    <div className="text-xs text-gray-500 uppercase" style={{ height: '16px' }}>
                        {language}
                    </div>
                </div>
            )}

            <CodeCopyButton onCopy={handleCopy} isHovering={isHovering} copied={copied} />

            {/* Hidden container for extracting raw code from children */}
            <div ref={codeRef} hidden>
                {children}
            </div>

            <div
                className={`w-full min-h-0 overflow-y-auto ${showLanguageLabel ? 'pt-10' : 'pt-4'} pb-4 rounded-md bg-code-background`}
                style={scrollAreaStyle}
            >
                {highlightedLines.length > 0 ? (
                        <pre className="hljs text-sm w-full whitespace-pre-wrap break-words !leading-relaxed">
                            <code className="block w-full">
                                {highlightedLines.map((html, i) => {
                                    const hidden = hiddenLines.has(i);
                                    const isFoldStart = foldableLineMap.has(i);
                                    const isFolded = foldedLines.has(i);
                                    const indentMatch = rawLines[i]?.match(/^[\t ]+/)?.[0] ?? '';
                                    const indentCh =
                                        indentMatch.length > 0
                                            ? indentMatch
                                                .split('')
                                                .reduce((acc, ch) => acc + (ch === '\t' ? 4 : 1), 0)
                                            : 0;

                                    const isActive = activeLine === i;

                                    return (
                                        <div
                                            key={i}
                                            className="grid w-full transition-[grid-template-rows] duration-200 ease-in-out"
                                            style={{
                                                gridTemplateRows: hidden ? '0fr' : '1fr',
                                            }}
                                        >
                                            <div
                                                className="w-full overflow-hidden transition-opacity duration-200 ease-in-out"
                                                style={{ opacity: hidden ? 0 : 1 }}
                                            >
                                                <div
                                                    className={`grid w-full grid-cols-[auto_minmax(0,1fr)] cursor-pointer px-4 transition-colors duration-100 ${isActive ? 'bg-white/[0.05]' : ''}`}
                                                    onClick={() => setActiveLine(isActive ? null : i)}
                                                >
                                                    <span
                                                        className="inline-flex items-center shrink-0 select-none self-start gap-1 mr-3"
                                                        style={{ height: '1lh' }}
                                                        aria-hidden="true"
                                                        onMouseEnter={() => setGutterHovered(true)}
                                                        onMouseLeave={() => setGutterHovered(false)}
                                                    >
                                                        <span
                                                            className="text-gray-600 text-right tabular-nums"
                                                            style={{
                                                                width: lineNumberWidth,
                                                                fontSize: '0.75em',
                                                                lineHeight: 'inherit',
                                                            }}
                                                        >
                                                            {i + 1}
                                                        </span>
                                                        <span className="inline-flex items-center justify-center w-3">
                                                            {isFoldStart &&
                                                                (gutterHovered || isFolded) && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            toggleFold(i);
                                                                        }}
                                                                        className="text-gray-600 hover:text-gray-400 leading-none p-0 bg-transparent border-none cursor-pointer"
                                                                        style={{ fontSize: '0.5rem' }}
                                                                        aria-label={
                                                                            isFolded
                                                                                ? 'Expand code block'
                                                                                : 'Collapse code block'
                                                                        }
                                                                    >
                                                                        <svg
                                                                            className={`w-3 h-3 transition-transform duration-150 ${isFolded ? '' : 'rotate-90'
                                                                                }`}
                                                                            viewBox="0 0 8 8"
                                                                            fill="currentColor"
                                                                        >
                                                                            <path d="M2 1 L6 4 L2 7 Z" />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                        </span>
                                                    </span>
                                                    <span
                                                        className="min-w-0 block"
                                                        style={
                                                            indentCh > 0
                                                                ? {
                                                                    paddingLeft: `${indentCh}ch`,
                                                                    textIndent: `-${indentCh}ch`,
                                                                }
                                                                : undefined
                                                        }
                                                    >
                                                        <span dangerouslySetInnerHTML={{ __html: html }} />
                                                        {isFolded &&
                                                            (() => {
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
                    <pre className="text-sm w-full whitespace-pre-wrap break-words">{children}</pre>
                )}
            </div>
        </div>
    );
}
