'use client';

import CheckIcon from '@/icons/CheckIcon';
import CopyIcon from '@/icons/CopyIcon';
import React, { useMemo, useState } from 'react';
import { cn } from '../utils/cn';

export interface DocHeadingProps {
    children: React.ReactNode;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    number?: number;
    isOptional?: boolean;
    /** When set, used as the element `id` instead of a slug derived from heading text. */
    id?: string;
}

function isReactElement(node: unknown): node is React.ReactElement {
    return React.isValidElement(node);
}

// Extract text content iteratively without recursion.
// `depth` is tree nesting (element → children), not nodes visited — headings with
// multiple inline elements (e.g. two `code` spans) must not trip the guard.
function getTextContent(node: React.ReactNode): string {
    const parts: string[] = [];
    const stack: { node: React.ReactNode; depth: number }[] = [{ node, depth: 0 }];
    const MAX_DEPTH = 32;
    const MAX_NODES = 1000;
    let nodesVisited = 0;

    while (stack.length > 0) {
        if (++nodesVisited > MAX_NODES) {
            break;
        }

        const { node: current, depth } = stack.pop()!;

        if (current === null || current === undefined) {
            continue;
        }

        if (typeof current === 'string') {
            parts.push(current);
            continue;
        }

        if (typeof current === 'number') {
            parts.push(current.toString());
            continue;
        }

        if (Array.isArray(current)) {
            // Siblings share depth — arrays are containers, not nesting.
            for (let i = current.length - 1; i >= 0; i--) {
                stack.push({ node: current[i], depth });
            }
            continue;
        }

        if (isReactElement(current)) {
            if (depth > MAX_DEPTH) {
                continue;
            }

            const { props } = current;

            // Prefer an explicit text/label prop over walking children (e.g. InternalLink).
            if (typeof current.type === 'function' && props && typeof props === 'object') {
                const record = props as Record<string, unknown>;
                const label =
                    (typeof record.text === 'string' && record.text) ||
                    (typeof record.label === 'string' && record.label) ||
                    (typeof record.children === 'string' && record.children);
                if (label) {
                    parts.push(label);
                    continue;
                }
            }

            if (props && typeof props === 'object' && 'children' in props) {
                stack.push({
                    node: (props as { children: React.ReactNode }).children,
                    depth: depth + 1,
                });
            }
            continue;
        }

        parts.push(String(current));
    }

    return parts.join('');
}

// Create a slug from text content
function createSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export default function DocHeading({
    children,
    level = 2,
    className = '',
    number,
    isOptional,
    id: idProp,
}: DocHeadingProps) {
    const id = useMemo(
        () => idProp ?? createSlug(getTextContent(children)),
        [children, idProp],
    );

    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Create a URL with the hash
        const url = window.location.href.split('#')[0] + `#${id}`;

        // Copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };

    const levelClasses: Record<number, string> = {
        1: 'text-4xl',
        2: 'text-2xl',
        3: 'text-xl',
        4: 'text-lg',
        5: 'text-base',
        6: 'text-sm',
    };

    const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;

    return (
        <HeadingTag
            className={cn(
                levelClasses[level] || 'text-2xl',
                'font-bold w-full group pt-4',
                className,
            )}
            id={id}
        >
            <div className="flex items-center gap-2">
                {number !== undefined && <span className="text-gray-500">{number}</span>}
                <span>{children}</span>
                {isOptional && (
                    <span className="text-xs font-medium text-[var(--text-secondary)] border border-[var(--text-secondary)]/20 px-2 py-0.5 rounded-full">
                        Optional
                    </span>
                )}
                <button
                    onClick={handleCopy}
                    className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out focus:opacity-100 focus:outline-none cursor-pointer"
                    aria-label="Copy link to section"
                >
                    <div className="relative w-4 h-4">
                        <span
                            className={`absolute inset-0 transition-opacity ${
                                copied
                                    ? 'opacity-0 duration-0'
                                    : 'opacity-100 duration-300 ease-in-out'
                            }`}
                        >
                            <CopyIcon />
                        </span>
                        <span
                            className={`absolute inset-0 transition-opacity ${
                                copied
                                    ? 'opacity-100 duration-300 ease-in-out'
                                    : 'opacity-0 duration-0'
                            }`}
                        >
                            <CheckIcon />
                        </span>
                    </div>
                </button>
            </div>
        </HeadingTag>
    );
}
