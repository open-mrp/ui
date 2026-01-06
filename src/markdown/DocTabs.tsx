'use client';

import { cn } from '@/utils/cn';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { DocTabProps } from './DocTab';

export interface DocTabsProps {
    children: ReactNode;
    defaultTab?: string;
    className?: string;
}

// Helper to check if a React element is a DocTab component
// Checks for displayName first, then falls back to checking for required 'label' prop
// This handles MDX compilation where component types may be wrapped differently
function isDocTab(child: React.ReactNode): child is React.ReactElement<DocTabProps> {
    if (!React.isValidElement(child)) return false;
    // Check displayName on the component type
    const type = child.type as { displayName?: string };
    if (type.displayName === 'DocTab') return true;
    // Fallback: check if it has the required 'label' prop that DocTab needs
    const props = child.props as { label?: string };
    return typeof props.label === 'string';
}

export default function DocTabs({ children, defaultTab, className }: DocTabsProps) {
    // Filter children to only include valid DocTab elements
    // MDX can insert whitespace/text nodes between components that we need to ignore
    const tabs = useMemo(() => {
        return React.Children.toArray(children).filter(isDocTab);
    }, [children]);

    const [activeTab, setActiveTab] = useState(defaultTab || '');

    useEffect(() => {
        if (!activeTab && tabs.length > 0) {
            setActiveTab(tabs[0].props.label);
        }
    }, [activeTab, tabs]);

    return (
        <div className={cn('w-full', className)}>
            <div className="border-b border-[var(--text-primary)]/20">
                <nav className="flex space-x-0" aria-label="Tabs">
                    {tabs.map((tab) =>
                        React.cloneElement(tab, {
                            key: tab.props.label,
                            showContent: false,
                            isActive: activeTab === tab.props.label,
                            onSelect: setActiveTab,
                        }),
                    )}
                </nav>
            </div>
            <div className="mt-4">
                {tabs.map((tab) =>
                    React.cloneElement(tab, {
                        key: tab.props.label,
                        showContent: true,
                        isActive: activeTab === tab.props.label,
                        onSelect: setActiveTab,
                    }),
                )}
            </div>
        </div>
    );
}
