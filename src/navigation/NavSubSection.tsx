'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, NavSubSectionData } from './types';

export interface NavSubSectionProps {
    subSection: NavSubSectionData;
    isPathActive: (path: string) => boolean;
    renderNavItem: (item: NavLink | NavSubSectionData) => React.ReactNode;
    className?: string;
}

// Helper function to check if an item is a NavLink
const isNavLink = (item: NavLink | NavSubSectionData): item is NavLink => {
    return 'href' in item;
};

interface AnimationConstants {
    readonly INDICATOR_TRANS_TIME: number;
    readonly SCALE_DELAY: number;
    readonly PING_DELAY: number;
    readonly PING_DURATION: number;
    readonly OPEN_TIME: number;
    readonly ITEM_TIME: number;
}

const ANIMATION_CONSTANTS: AnimationConstants = {
    INDICATOR_TRANS_TIME: 600,
    SCALE_DELAY: 50,
    PING_DELAY: 100,
    PING_DURATION: 900,
    OPEN_TIME: 300,
    ITEM_TIME: 20,
} as const;

interface IndicatorPosition {
    readonly top: number;
    readonly scale: number;
}

const useActiveItem = (
    items: (NavLink | NavSubSectionData)[],
    isPathActive: (path: string) => boolean,
) => {
    return useMemo(() => {
        const hasActive = items.some((item) =>
            isNavLink(item)
                ? isPathActive(item.href)
                : item.items.some((subItem) => isNavLink(subItem) && isPathActive(subItem.href)),
        );

        // Find active index including subsections
        const activeIdx = items.findIndex((item) =>
            isNavLink(item)
                ? isPathActive(item.href)
                : item.items.some((subItem) => isNavLink(subItem) && isPathActive(subItem.href)),
        );

        return { hasActive, activeIdx };
    }, [items, isPathActive]);
};

const useIndicatorPosition = (
    itemsRef: React.MutableRefObject<HTMLDivElement | null>,
    activeIndex: number,
    isOpen: boolean,
    prevActiveIndex: number,
): readonly [IndicatorPosition | null, boolean, (show: boolean) => void] => {
    const [position, setPosition] = useState<IndicatorPosition | null>(null);
    const [showPing, setShowPing] = useState(false);

    useEffect(() => {
        if (!itemsRef.current || activeIndex === -1 || !isOpen) {
            setPosition(null);
            setShowPing(false);
            return;
        }

        const itemElements = itemsRef.current.children;
        if (activeIndex >= itemElements.length) return;

        const activeItem = itemElements[activeIndex] as HTMLElement;
        const containerTop = itemsRef.current.getBoundingClientRect().top;

        // Get the button element for subsections
        const buttonElement = activeItem.querySelector('button') as HTMLElement;
        const targetElement = buttonElement || activeItem;

        const itemRect = targetElement.getBoundingClientRect();
        const top = itemRect.top - containerTop + itemRect.height / 2;

        const isInitialEntry = prevActiveIndex === -1;

        if (isInitialEntry) {
            setPosition({ top, scale: 0 });

            setTimeout(() => {
                setPosition({ top, scale: 1 });

                setTimeout(() => {
                    setShowPing(true);

                    setTimeout(() => {
                        setShowPing(false);
                    }, ANIMATION_CONSTANTS.PING_DURATION);
                }, ANIMATION_CONSTANTS.PING_DELAY);
            }, ANIMATION_CONSTANTS.SCALE_DELAY);
        } else {
            setPosition({ top, scale: 1 });
        }
    }, [activeIndex, isOpen, prevActiveIndex]);

    return [position, showPing, setShowPing];
};

// Improved ChevronIcon with better accessibility
const ChevronIcon: React.FC<{ isOpen: boolean }> = React.memo(({ isOpen }) => (
    <div className="flex-shrink-0 w-5 h-5">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transition-transform ease-in-out ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            role="img"
            aria-label={isOpen ? 'Collapse section' : 'Expand section'}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </div>
));

// Improved ActiveIndicator with better accessibility and performance
const ActiveIndicator: React.FC<{
    position: IndicatorPosition;
    showPing: boolean;
}> = React.memo(({ position, showPing }) => (
    <div className="relative">
        <div
            className="absolute transition-all ease-out"
            style={
                {
                    left: '-4px',
                    top: 0,
                    '--indicator-offset': `${position.top}px`,
                    transform: `translateY(-50%) translateY(var(--indicator-offset, 0))`,
                    transitionDuration: `${ANIMATION_CONSTANTS.INDICATOR_TRANS_TIME}ms`,
                } as React.CSSProperties
            }
        >
            {showPing && (
                <div
                    className="absolute w-3.5 h-3.5 -left-0.25 -top-0.25 rounded-full bg-primary-500/50 animate-ping"
                    aria-hidden="true"
                />
            )}
            <div
                className="relative w-3 h-3 rounded-full bg-primary-500 z-20 transition-transform ease-out"
                style={{
                    opacity: position.scale,
                    transform: `scale(${position.scale})`,
                    transitionDuration: `${ANIMATION_CONSTANTS.INDICATOR_TRANS_TIME}ms`,
                }}
                aria-hidden="true"
            />
        </div>
    </div>
));

export default function NavSubSection({
    subSection,
    isPathActive,
    renderNavItem,
    className = '',
}: NavSubSectionProps): React.ReactElement {
    const itemsContainerRef = useRef<HTMLDivElement>(null);
    const borderRef = useRef<HTMLDivElement>(null);
    const [prevActiveIndex, setPrevActiveIdx] = useState<number>(-1);
    const [isInInitialTransition, setIsInInitialTransition] = useState(false);
    const [borderHeight, setBorderHeight] = useState<number | null>(null);

    const { hasActive, activeIdx: activeIndex } = useActiveItem(subSection.items, isPathActive);
    const [isOpen, setIsOpen] = useState<boolean>(hasActive);
    const [position, showPing, setShowPing] = useIndicatorPosition(
        itemsContainerRef,
        activeIndex,
        isOpen && !isInInitialTransition,
        prevActiveIndex,
    );

    // make indicators work with opening animation
    const toggleOpen = useCallback(() => {
        setIsOpen((prev) => {
            if (!prev) {
                setIsInInitialTransition(true);
                setTimeout(() => {
                    setPrevActiveIdx(-1);
                    setIsInInitialTransition(false);
                }, ANIMATION_CONSTANTS.OPEN_TIME);
            } else {
                setPrevActiveIdx(activeIndex);
            }
            return !prev;
        });
    }, [activeIndex]);

    // prevent ping on every change
    useEffect(() => {
        setPrevActiveIdx(activeIndex);
    }, [activeIndex]);

    // Auto-open section when it becomes active
    useEffect(() => {
        if (hasActive && !isOpen && prevActiveIndex === -1) {
            setIsOpen(true);
        }
    }, [hasActive, isOpen, prevActiveIndex]);

    return (
        <div className={className}>
            <button
                onClick={toggleOpen}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-sm cursor-pointer text-left transition-colors gap-2
          ${
              hasActive
                  ? 'font-medium hover:bg-gray-800 text-gray-200'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
          }`}
                aria-expanded={isOpen}
                aria-controls={`subsection-${subSection.title}`}
            >
                <span className="flex-1 min-w-0">{subSection.title}</span>
                <ChevronIcon isOpen={isOpen} />
            </button>

            <div className="ml-2 relative">
                {/* Border line */}
                <div
                    className={`absolute top-0 w-0 border-l-3 border-gray-700 transition-transform duration-${
                        ANIMATION_CONSTANTS.OPEN_TIME
                    } origin-top
            ${isOpen ? 'scale-y-100' : 'scale-y-0'}`}
                    style={{
                        height: subSection.items.some((item) => !isNavLink(item))
                            ? `calc(${
                                  subSection.items.findIndex((item) => !isNavLink(item)) * 2.5
                              }rem + 3.5rem)`
                            : '100%',
                    }}
                    aria-hidden="true"
                />

                {/* Animated Active Indicator */}
                {isOpen && position && <ActiveIndicator position={position} showPing={showPing} />}

                {/* Content with padding */}
                <div
                    id={`subsection-${subSection.title}`}
                    ref={itemsContainerRef}
                    className={`pl-3 overflow-hidden transition-[max-height] duration-300 ease-out
            ${isOpen ? 'max-h-[2000px]' : 'max-h-0'} ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        transitionProperty: 'max-height, opacity',
                        transitionDuration: `${ANIMATION_CONSTANTS.OPEN_TIME}ms`,
                    }}
                    role="region"
                    aria-hidden={!isOpen}
                >
                    {subSection.items.map((item, itemIndex) => (
                        <div
                            key={itemIndex}
                            className="text-sm py-1 transition-all duration-300 ease-out"
                            style={{
                                opacity: isOpen ? 1 : 0,
                                transform: `translateY(${isOpen ? 0 : 8}px)`,
                                transitionDelay: `${
                                    isOpen
                                        ? itemIndex * ANIMATION_CONSTANTS.ITEM_TIME
                                        : (subSection.items.length - itemIndex - 1) *
                                          ANIMATION_CONSTANTS.ITEM_TIME
                                }ms`,
                                transitionProperty: 'opacity, transform',
                            }}
                        >
                            {renderNavItem(item)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
