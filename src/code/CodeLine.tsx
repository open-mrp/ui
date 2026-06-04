'use client';

import React from 'react';

export interface CodeLineProps {
    /** Zero-based line index in the full document. */
    lineIndex: number;
    /** Pre-rendered (highlighted or plain-escaped) HTML for this line. */
    html: string;
    /** Raw line text, used to compute hanging-indent for wrapped lines. */
    rawLine: string;
    isActive: boolean;
    isFoldStart: boolean;
    isFolded: boolean;
    /** Text shown after the "…" placeholder when this line is folded (e.g. the closing bracket). */
    foldEndText: string;
    /** CSS width for the line-number gutter (e.g. "3ch"). */
    lineNumberWidth: string;
    gutterHovered: boolean;
    onGutterEnter: () => void;
    onGutterLeave: () => void;
    onToggleFold: (lineIndex: number) => void;
    onSelect: (lineIndex: number) => void;
}

/**
 * A single rendered code line: line-number gutter, optional fold toggle, and the
 * highlighted content with hanging-indent for soft-wrapped lines. Shared by the
 * CodeEditor's virtualized and non-virtualized render paths, so the two stay
 * visually identical. Memoized so scrolling/highlighting only re-renders the
 * lines whose props actually change.
 */
function CodeLine({
    lineIndex,
    html,
    rawLine,
    isActive,
    isFoldStart,
    isFolded,
    foldEndText,
    lineNumberWidth,
    gutterHovered,
    onGutterEnter,
    onGutterLeave,
    onToggleFold,
    onSelect,
}: CodeLineProps) {
    const indentMatch = rawLine.match(/^[\t ]+/)?.[0] ?? '';
    const indentCh =
        indentMatch.length > 0
            ? indentMatch.split('').reduce((acc, ch) => acc + (ch === '\t' ? 4 : 1), 0)
            : 0;

    return (
        <div
            className={`grid w-full grid-cols-[auto_minmax(0,1fr)] cursor-text px-4 transition-colors duration-100 ${isActive ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'}`}
            onClick={(e) => {
                if ((e.target as HTMLElement).closest('a')) return;
                if (window.getSelection()?.toString()) return;
                onSelect(lineIndex);
            }}
        >
            <span
                className="inline-flex items-center shrink-0 select-none self-start gap-1 mr-3"
                style={{ height: '1lh' }}
                aria-hidden="true"
                onMouseEnter={onGutterEnter}
                onMouseLeave={onGutterLeave}
            >
                <span
                    className="text-gray-600 text-right tabular-nums"
                    style={{
                        width: lineNumberWidth,
                        fontSize: '0.75em',
                        lineHeight: 'inherit',
                    }}
                >
                    {lineIndex + 1}
                </span>
                <span className="inline-flex items-center justify-center w-3">
                    {isFoldStart && (gutterHovered || isFolded) && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFold(lineIndex);
                            }}
                            className="text-gray-600 hover:text-gray-400 leading-none p-0 bg-transparent border-none cursor-pointer"
                            style={{ fontSize: '0.5rem' }}
                            aria-label={isFolded ? 'Expand code block' : 'Collapse code block'}
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
                {isFolded && (
                    <span className="text-gray-300 ml-2 bg-gray-600/40 px-2 py-0.5 rounded-sm border border-gray-500/30 animate-in fade-in duration-200">
                        &hellip;{foldEndText}
                    </span>
                )}
            </span>
        </div>
    );
}

export default React.memo(CodeLine);
