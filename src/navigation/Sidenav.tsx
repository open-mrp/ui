'use client';

import { cn } from '@/utils/cn';
import { PanelLeftClose } from 'lucide-react';
import { useSidenavState } from '../hooks/useSidenavStore';
import { NavLink, NavSubSectionData } from './types';

export interface NavSection {
    title: string;
    links: (NavLink | NavSubSectionData)[];
}

export interface SidenavProps {
    sections: NavSection[];
    renderNavItem: (item: NavLink | NavSubSectionData) => React.ReactNode;
    className?: string;
    /** Height of the sidenav. Defaults to 'calc(100vh - 64px)' */
    height?: string;
}

export default function Sidenav({
    sections,
    renderNavItem,
    className = '',
    height = 'calc(100vh - 64px)',
}: SidenavProps) {
    const { isCollapsed, toggleCollapsed } = useSidenavState();

    return (
        <nav
            className={cn(
                `bg-gray-900 px-2 max-sm:hidden relative transition-all duration-300 ease-in-out`,
                className,
            )}
            style={{
                height,
                width: isCollapsed ? '48px' : '256px',
                minWidth: isCollapsed ? '48px' : '256px',
            }}
        >
            {/* Toggle button - absolutely positioned */}
            <button
                onClick={toggleCollapsed}
                className="absolute z-20 p-2 rounded-md backdrop-blur-sm hover:bg-gray-800 text-gray-400 hover:text-gray-100 cursor-pointer transition-all duration-300 ease-in-out"
                style={{
                    top: '12px',
                    right: isCollapsed ? '50%' : '8px',
                    transform: isCollapsed ? 'translateX(50%)' : 'translateX(0)',
                    backgroundColor: 'inherit',
                }}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <div
                    className="transition-transform duration-300 ease-in-out"
                    style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                    <PanelLeftClose className="w-5 h-5" />
                </div>
            </button>

            {/* Content wrapper with fade overlay */}
            <div
                className={`relative h-full overflow-hidden transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'
                }`}
                style={{
                    transitionProperty: 'opacity, visibility',
                    transitionDuration: isCollapsed ? '150ms' : '300ms',
                    transitionDelay: isCollapsed ? '0ms' : '100ms',
                    backgroundColor: 'inherit',
                    width: '240px',
                    minWidth: '240px',
                }}
            >
                {/* Top fade gradient */}
                <div
                    className="absolute top-0 left-0 right-0 h-12 z-10 pointer-events-none"
                    style={{
                        backgroundColor: 'inherit',
                        maskImage:
                            'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 75%, transparent 100%)',
                        WebkitMaskImage:
                            'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 75%, transparent 100%)',
                    }}
                />

                {/* Bottom fade gradient */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-12 z-10 pointer-events-none"
                    style={{
                        backgroundColor: 'inherit',
                        maskImage:
                            'linear-gradient(to top, black 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 75%, transparent 100%)',
                        WebkitMaskImage:
                            'linear-gradient(to top, black 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 75%, transparent 100%)',
                    }}
                />

                {/* Scrollable content */}
                <div className="h-full overflow-y-auto overflow-x-hidden py-4 px-1">
                    {sections.map((section, index) => (
                        <div
                            key={section.title}
                            className={`pb-2 ${
                                index < sections.length - 1 ? 'border-b border-gray-700' : ''
                            }`}
                        >
                            <h3
                                className="mx-2 text-gray-100 my-3 flex items-center whitespace-nowrap font-ibm-plex-mono"
                                style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 400,
                                    letterSpacing: '0.5px',
                                }}
                            >
                                {section.title.toUpperCase()}
                            </h3>
                            <div className="flex flex-col gap-2">
                                {section.links.map(renderNavItem)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    );
}
