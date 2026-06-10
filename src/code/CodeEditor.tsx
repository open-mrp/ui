'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import copy from 'copy-to-clipboard';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { escapeHtml, highlightCode } from '../utils/highlight';
import CodeCopyButton from './CodeCopyButton';
import CodeLine from './CodeLine';
import { findFoldRegions, type FoldRegion } from './findFoldRegions';
import { applyLinkPatterns, type LinkPattern } from './applyLinkPatterns';
import { splitHighlightedLines } from './splitHighlightedLines';

/**
 * A replacement value. Pass a string to use the same text for both display and
 * copy, or `{ display, copy }` to show a shortened/pretty value in the
 * rendered snippet while the copy button hands back the full value.
 */
export type ReplacementValue = string | { display: string; copy: string };

/** Above this many lines, the code area renders with windowing (virtualization). */
const DEFAULT_VIRTUALIZE_THRESHOLD = 500;
/**
 * Above this many characters, syntax highlighting is computed lazily per visible
 * line instead of highlighting the whole document up front. See `lazyHighlightThreshold`.
 */
const DEFAULT_LAZY_HIGHLIGHT_THRESHOLD = 500_000;
/** Estimated line height (px) used before a line is measured. */
const ESTIMATED_LINE_HEIGHT = 24;
/**
 * Fallback max height (px) applied when a snippet is virtualized but the consumer
 * gave no `height`/`maxHeight`. Windowing needs a bounded, internally-scrolling
 * container; without this the editor would grow to full content height and the page
 * (not the container) would scroll, defeating virtualization.
 */
const DEFAULT_VIRTUALIZED_MAX_HEIGHT = 600;

export interface CodeEditorProps {
    children: React.ReactNode;
    className?: string;
    /** Scrollable height (in px if number) for the code area */
    height?: number | string;
    /** Maximum scrollable height (in px if number) for the code area */
    maxHeight?: number | string;
    /** Optional map of placeholder strings to replacement values (e.g., { "YOUR_API_KEY": "sk_test_..." }) */
    replacements?: Record<string, ReplacementValue>;
    /**
     * Extra link patterns for clickable spans inside highlighted code (e.g. ID prefixes).
     * `http://` and `https://` URLs are always linked without passing this prop.
     */
    linkPatterns?: LinkPattern[];
    /** When true (default), show the detected language label in the header */
    showLanguageLabel?: boolean;
    /**
     * Flush layout for embedding inside a parent panel (no outer margin or rounding).
     * Vertical padding around the code block is preserved.
     */
    embedded?: boolean;
    /**
     * Render the code area with windowing once the snippet exceeds this many lines.
     * Below the threshold the full list renders (with animated fold/expand); above it
     * only the visible lines are mounted and folding collapses instantly. Defaults to 500.
     */
    virtualizeThreshold?: number;
    /**
     * Above this many characters, highlight lazily per visible line rather than
     * highlighting the entire document up front (which can freeze the main thread on
     * multi-MB payloads). Defaults to 500,000.
     *
     * Caveat: per-line highlighting has no cross-line lexer state, so constructs that
     * span lines (block comments, multi-line strings/templates) may be miscolored in
     * this mode. Raise the threshold to force full-document highlighting if exactness
     * matters more than responsiveness for your payload sizes.
     */
    lazyHighlightThreshold?: number;
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
    linkPatterns,
    showLanguageLabel = true,
    embedded = false,
    virtualizeThreshold = DEFAULT_VIRTUALIZE_THRESHOLD,
    lazyHighlightThreshold = DEFAULT_LAZY_HIGHLIGHT_THRESHOLD,
}: CodeEditorProps) {
    const codeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [copied, setCopied] = useState(false);
    const [language, setLanguage] = useState<string | null>(null);
    const [highlightedLines, setHighlightedLines] = useState<string[]>([]);
    const [displayCode, setDisplayCode] = useState('');
    const [copyCode, setCopyCode] = useState('');
    const [foldedLines, setFoldedLines] = useState<Set<number>>(new Set());
    const [activeLine, setActiveLine] = useState<number | null>(null);
    const [gutterHovered, setGutterHovered] = useState(false);

    // Lazy (viewport) highlighting state: a per-line HTML cache keyed by line index,
    // and a version counter bumped to re-render when newly highlighted lines land.
    const lazyCacheRef = useRef<Map<number, string>>(new Map());
    const lazyPendingRef = useRef<Set<number>>(new Set());
    const [, setLazyVersion] = useState(0);

    const highlightMode: 'full' | 'lazy' =
        displayCode.length > lazyHighlightThreshold ? 'lazy' : 'full';

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
        const codeElement = codeRef.current?.querySelector('code');
        if (!codeElement?.className) return;
        const match = codeElement.className.match(/language-([^\s]+)/);
        if (!match?.[1]) return;

        const lang = match[1];
        const rawText = codeElement.textContent || '';
        const displayText = applyReplacements(rawText, replacements, 'display');
        const copyText = applyReplacements(rawText, replacements, 'copy');
        setLanguage(lang);
        setDisplayCode(displayText);
        setCopyCode(copyText);

        // New content invalidates the lazy cache.
        lazyCacheRef.current = new Map();
        lazyPendingRef.current = new Set();
        setLazyVersion((v) => v + 1);

        if (displayText.length <= lazyHighlightThreshold) {
            let cancelled = false;
            highlightCode(displayText, lang).then((html) => {
                if (cancelled) return;
                setHighlightedLines(splitHighlightedLines(applyLinkPatterns(html, linkPatterns)));
            });
            return () => {
                cancelled = true;
            };
        }
        // Lazy mode: no up-front highlight; visible lines are highlighted on demand.
        setHighlightedLines([]);
    }, [children, replacements, linkPatterns, lazyHighlightThreshold]);

    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            const container = containerRef.current;
            if (!container || container.contains(e.target as Node)) return;
            setActiveLine(null);
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveLine(null);
        };
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(
        () => () => {
            if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
        },
        [],
    );

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

    const selectLine = useCallback((lineIndex: number) => {
        setActiveLine((prev) => (prev === lineIndex ? null : lineIndex));
    }, []);

    const onGutterEnter = useCallback(() => setGutterHovered(true), []);
    const onGutterLeave = useCallback(() => setGutterHovered(false), []);

    const rawLines = useMemo(() => displayCode.split('\n'), [displayCode]);

    const lineCount = highlightMode === 'full' ? highlightedLines.length : rawLines.length;

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
        () => `${Math.max(2, String(lineCount).length)}ch`,
        [lineCount],
    );

    /** HTML for a line: highlighted when available, else plain escaped text (lazy mode). */
    const getLineHtml = useCallback(
        (i: number): string => {
            if (highlightMode === 'full') return highlightedLines[i] ?? '';
            const cached = lazyCacheRef.current.get(i);
            if (cached !== undefined) return cached;
            return applyLinkPatterns(escapeHtml(rawLines[i] ?? ''), linkPatterns);
        },
        [highlightMode, highlightedLines, rawLines, linkPatterns],
    );

    const foldEndText = useCallback(
        (i: number): string => {
            const region = foldableLineMap.get(i);
            return region?.type === 'bracket' ? ` ${rawLines[region.endLine]?.trim() ?? ''}` : '';
        },
        [foldableLineMap, rawLines],
    );

    const isReady = highlightMode === 'full' ? highlightedLines.length > 0 : displayCode.length > 0;
    const shouldVirtualize = lineCount > virtualizeThreshold;

    // Virtualization: the list of line indices that are actually visible (not folded away).
    const visibleIndices = useMemo(() => {
        if (!shouldVirtualize) return null;
        const arr: number[] = [];
        for (let i = 0; i < lineCount; i++) {
            if (!hiddenLines.has(i)) arr.push(i);
        }
        return arr;
    }, [shouldVirtualize, lineCount, hiddenLines]);

    const virtualizer = useVirtualizer({
        count: visibleIndices?.length ?? 0,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => ESTIMATED_LINE_HEIGHT,
        overscan: 12,
        // Key by stable line index so measurements survive fold/expand re-indexing.
        getItemKey: (index) => visibleIndices?.[index] ?? index,
    });

    const virtualItems = shouldVirtualize ? virtualizer.getVirtualItems() : [];

    // Line indices currently mounted in the DOM — the ones lazy highlighting targets.
    const renderedLineIndices = useMemo(() => {
        if (shouldVirtualize) {
            return virtualItems
                .map((vi) => visibleIndices?.[vi.index])
                .filter((i): i is number => i != null);
        }
        const arr: number[] = [];
        for (let i = 0; i < lineCount; i++) {
            if (!hiddenLines.has(i)) arr.push(i);
        }
        return arr;
        // virtualItems is recreated each scroll; that's the intended trigger.
    }, [shouldVirtualize, virtualItems, visibleIndices, lineCount, hiddenLines]);

    const renderedRangeKey = renderedLineIndices.join(',');

    // Lazy highlight: colorize any rendered lines not yet in the cache.
    useEffect(() => {
        if (highlightMode !== 'lazy' || !language) return;
        const cache = lazyCacheRef.current;
        const pending = lazyPendingRef.current;
        const todo = renderedLineIndices.filter((i) => !cache.has(i) && !pending.has(i));
        if (todo.length === 0) return;

        todo.forEach((i) => pending.add(i));
        let cancelled = false;
        Promise.all(
            todo.map(async (i) => {
                const html = await highlightCode(rawLines[i] ?? '', language);
                const lineHtml =
                    splitHighlightedLines(applyLinkPatterns(html, linkPatterns))[0] ?? '';
                return [i, lineHtml] as const;
            }),
        ).then((results) => {
            results.forEach(([i]) => pending.delete(i));
            if (cancelled) return;
            results.forEach(([i, html]) => cache.set(i, html));
            setLazyVersion((v) => v + 1);
        });

        return () => {
            cancelled = true;
        };
    }, [renderedRangeKey, highlightMode, language, linkPatterns, rawLines, renderedLineIndices]);

    const handleCopy = () => {
        const text = copyCode || codeRef.current?.textContent || '';
        copy(text);
        setCopied(true);
        if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
        copiedTimeoutRef.current = setTimeout(() => setCopied(false), 1000);
    };

    const resolvedHeight =
        height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined;
    const explicitMaxHeight =
        maxHeight !== undefined
            ? typeof maxHeight === 'number'
                ? `${maxHeight}px`
                : maxHeight
            : undefined;
    // Ensure virtualized snippets always have a bounded, scrollable container.
    const resolvedMaxHeight =
        explicitMaxHeight ??
        (shouldVirtualize && resolvedHeight === undefined
            ? `${DEFAULT_VIRTUALIZED_MAX_HEIGHT}px`
            : undefined);

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

    const lineProps = (i: number) => ({
        lineIndex: i,
        html: getLineHtml(i),
        rawLine: rawLines[i] ?? '',
        isActive: activeLine === i,
        isFoldStart: foldableLineMap.has(i),
        isFolded: foldedLines.has(i),
        foldEndText: foldEndText(i),
        lineNumberWidth,
        gutterHovered,
        onGutterEnter,
        onGutterLeave,
        onToggleFold: toggleFold,
        onSelect: selectLine,
    });

    const chromeRounding = embedded ? '' : 'rounded-md';
    const outerSpacing = embedded ? '' : 'mt-4';

    return (
        <div
            ref={containerRef}
            className={`code-editor pb-0 relative group flex flex-col ${chromeRounding} ${outerSpacing} ${className}`}
            style={outerStyle}
        >
            {showLanguageLabel && (
                <div
                    className="absolute left-0 top-0 right-0 z-20 h-10 px-4 rounded-t-md rounded-b-none backdrop-blur-md flex items-center"
                    style={{
                        backgroundColor:
                            'color-mix(in srgb, var(--code-background) 20%, transparent)',
                    }}
                >
                    <div className="text-xs text-gray-500 uppercase" style={{ height: '16px' }}>
                        {language}
                    </div>
                </div>
            )}

            <CodeCopyButton onCopy={handleCopy} copied={copied} />

            {/* Hidden container for extracting raw code from children */}
            <div ref={codeRef} hidden>
                {children}
            </div>

            <div
                ref={scrollRef}
                className={`code-editor-scroll w-full min-h-0 overflow-y-auto ${showLanguageLabel ? 'pt-10' : 'pt-4'} pb-4 ${chromeRounding}`}
                style={scrollAreaStyle}
            >
                {isReady ? (
                    <pre className="hljs text-sm w-full whitespace-pre-wrap break-words !leading-relaxed">
                        {shouldVirtualize ? (
                            <div
                                style={{
                                    height: virtualizer.getTotalSize(),
                                    width: '100%',
                                    position: 'relative',
                                }}
                            >
                                {virtualItems.map((vi) => {
                                    const i = visibleIndices![vi.index];
                                    return (
                                        <div
                                            key={i}
                                            data-index={vi.index}
                                            ref={virtualizer.measureElement}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                transform: `translateY(${vi.start}px)`,
                                            }}
                                        >
                                            <CodeLine {...lineProps(i)} />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <code className="block w-full">
                                {Array.from({ length: lineCount }, (_, i) => {
                                    const hidden = hiddenLines.has(i);
                                    return (
                                        <div
                                            key={i}
                                            className="grid w-full transition-[grid-template-rows] duration-200 ease-in-out"
                                            style={{ gridTemplateRows: hidden ? '0fr' : '1fr' }}
                                        >
                                            <div
                                                className="w-full overflow-hidden transition-opacity duration-200 ease-in-out"
                                                style={{ opacity: hidden ? 0 : 1 }}
                                            >
                                                <CodeLine {...lineProps(i)} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </code>
                        )}
                    </pre>
                ) : (
                    <pre className="text-sm w-full whitespace-pre-wrap break-words">{children}</pre>
                )}
            </div>
        </div>
    );
}
