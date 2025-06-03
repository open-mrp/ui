"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavLink, NavSubSectionData } from "./types";

export interface NavSubSectionProps {
  subSection: NavSubSectionData;
  isPathActive: (path: string) => boolean;
  renderNavItem: (item: NavLink | NavSubSectionData) => React.ReactNode;
  className?: string;
}

// Helper function to check if an item is a NavLink
const isNavLink = (item: NavLink | NavSubSectionData): item is NavLink => {
  return "href" in item;
};

// Constants for animation timings
const ANIMATION_CONSTANTS = {
  SCALE_DELAY: 50,
  PING_DELAY: 400,
  PING_DURATION: 900,
} as const;

// Types for indicator position
interface IndicatorPosition {
  top: number;
  scale: number;
}

// Extracted hook for handling active item detection
const useActiveItem = (
  items: (NavLink | NavSubSectionData)[],
  isPathActive: (path: string) => boolean
) => {
  return useMemo(() => {
    const hasActive = items.some((item) =>
      isNavLink(item)
        ? isPathActive(item.href)
        : item.items.some(
            (subItem) => isNavLink(subItem) && isPathActive(subItem.href)
          )
    );

    const activeIdx = items.findIndex(
      (item) => isNavLink(item) && isPathActive(item.href)
    );

    return { hasActive, activeIdx };
  }, [items, isPathActive]);
};

// Extracted hook for handling indicator position
const useIndicatorPosition = (
  itemsRef: React.RefObject<HTMLDivElement>,
  activeIndex: number,
  isOpen: boolean,
  prevActiveIndex: number
): [IndicatorPosition | null, boolean, (show: boolean) => void] => {
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
    const itemRect = activeItem.getBoundingClientRect();
    const top = itemRect.top - containerTop + itemRect.height / 2;

    const isInitialEntry = prevActiveIndex === -1;

    if (isInitialEntry) {
      // First set initial position
      setPosition({ top, scale: 0 });

      // Then trigger scale animation
      setTimeout(() => {
        setPosition({ top, scale: 1 });

        // Start ping after delay
        setTimeout(() => {
          setShowPing(true);

          // Hide ping after duration
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

// Extracted component for the chevron icon
const ChevronIcon: React.FC<{ isOpen: boolean }> = React.memo(({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
));

ChevronIcon.displayName = "ChevronIcon";

// Extracted component for the active indicator
const ActiveIndicator: React.FC<{
  position: IndicatorPosition;
  showPing: boolean;
}> = React.memo(({ position, showPing }) => (
  <div className="relative">
    <div
      className="absolute transition-all duration-500 cubic-bezier(0.2, 0, 0, 1)"
      style={
        {
          left: "-4px",
          top: 0,
          "--indicator-offset": `${position.top}px`,
          transform: `translateY(-50%) translateY(var(--indicator-offset, 0))`,
        } as React.CSSProperties
      }
    >
      {showPing && (
        <div
          className="absolute w-3.5 h-3.5 -left-0.25 -top-0.25 rounded-full bg-secondary-500/50 animate-ping"
          aria-hidden="true"
        />
      )}
      <div
        className="relative w-3 h-3 rounded-full bg-secondary-500 z-20 transition-all duration-500 ease-in-out"
        style={{
          opacity: position.scale,
          transform: `scale(${position.scale})`,
        }}
        aria-hidden="true"
      />
    </div>
  </div>
));

ActiveIndicator.displayName = "ActiveIndicator";

export default function NavSubSection({
  subSection,
  isPathActive,
  renderNavItem,
  className = "",
}: NavSubSectionProps) {
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const [prevActiveIndex, setPrevActiveIndex] = useState(-1);

  const { hasActive, activeIdx: activeIndex } = useActiveItem(
    subSection.items,
    isPathActive
  );
  const [isOpen, setIsOpen] = useState(hasActive);
  const [position, showPing, setShowPing] = useIndicatorPosition(
    itemsContainerRef as React.RefObject<HTMLDivElement>,
    activeIndex,
    isOpen,
    prevActiveIndex
  );

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  // Update previous active index when active index changes
  useEffect(() => {
    setPrevActiveIndex(activeIndex);
  }, [activeIndex]);

  // Auto-open section when it contains the active item
  useEffect(() => {
    if (hasActive && !isOpen) {
      setIsOpen(true);
    }
  }, [hasActive, isOpen]);

  return (
    <div className={className}>
      <button
        onClick={toggleOpen}
        className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-sm cursor-pointer text-left
          ${
            hasActive
              ? "font-medium hover:bg-gray-800 text-gray-200"
              : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
          }`}
        aria-expanded={isOpen}
        aria-controls={`subsection-${subSection.title}`}
      >
        <span>{subSection.title}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      <div className="ml-2 relative">
        {/* Border line */}
        <div
          className={`absolute top-0 bottom-0 w-0 border-l-3 border-gray-700 transition-all duration-300 origin-top
            ${isOpen ? "scale-y-100" : "scale-y-0"}`}
          aria-hidden="true"
        />

        {/* Animated Active Indicator */}
        {isOpen && position && (
          <ActiveIndicator position={position} showPing={showPing} />
        )}

        {/* Content with padding */}
        <div
          id={`subsection-${subSection.title}`}
          ref={itemsContainerRef}
          className={`pl-3 overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
          role="region"
          aria-hidden={!isOpen}
        >
          {subSection.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className={`text-sm py-1 transition-all duration-300 ease-in-out motion-safe:transition-transform motion-safe:transition-opacity
                ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-2 opacity-0"
                }`}
              style={{
                transitionDelay: `${itemIndex * 75}ms`,
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
