'use client';

import ChevronDownIcon from '@/icons/ChevronDownIcon';
import ChevronUpIcon from '@/icons/ChevronUpIcon';
import { cn } from '@/utils/cn';
import React, { useState } from 'react';
import DocHeading from './DocHeading';

export interface DocNumberedSectionProps {
    children: React.ReactNode;
    number?: number;
    title: string;
    className?: string;
    isOptional?: boolean;
}

export default function DocNumberedSection({
    children,
    number,
    title,
    className,
    isOptional,
}: DocNumberedSectionProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={cn('border-t border-[var(--border-color)] pt-4', className)}>
            <div
                className="w-full flex items-center gap-4 justify-between transition-colors cursor-pointer group mb-4"
                onClick={() => setIsOpen(!isOpen)}
            >
                <DocHeading
                    level={3}
                    number={number}
                    isOptional={isOptional}
                    className="!font-bold !m-0 !pt-0"
                >
                    {title}
                </DocHeading>
                <div className="flex items-center justify-center min-w-[32px] h-[32px]">
                    {isOpen ? (
                        <ChevronUpIcon className="w-6 h-6 text-[var(--text-secondary)]" />
                    ) : (
                        <ChevronDownIcon className="w-6 h-6 text-[var(--text-secondary)]" />
                    )}
                </div>
            </div>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="pb-4">{children}</div>
            </div>
        </div>
    );
}
