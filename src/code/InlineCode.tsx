'use client';

import React from 'react';

export interface InlineCodeProps {
    children: React.ReactNode;
    className?: string;
}

export default function InlineCode({ children, className }: InlineCodeProps) {
    return (
        <code
            className={`bg-gray-500 text-primary-50 text-sm px-2 py-0.5 rounded-md relative group ${className}`}
        >
            {children}
        </code>
    );
}
