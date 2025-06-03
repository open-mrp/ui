"use client";
import { useEffect, useRef, useState } from "react";
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

export default function NavSubSection({
  subSection,
  isPathActive,
  renderNavItem,
  className = "",
}: NavSubSectionProps) {
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const [activeItemPosition, setActiveItemPosition] = useState<number | null>(
    null
  );
  const [scale, setScale] = useState(0);
  const [showPing, setShowPing] = useState(false);
  const [prevActiveIndex, setPrevActiveIndex] = useState(-1);
  const [prevPosition, setPrevPosition] = useState<number | null>(null);

  const hasActiveItem = subSection.items.some((item) => {
    if (isNavLink(item)) {
      return isPathActive(item.href);
    } else {
      return item.items.some(
        (subItem) => isNavLink(subItem) && isPathActive(subItem.href)
      );
    }
  });

  // Initialize isOpen state only once, based on hasActiveItem
  const [isOpen, setIsOpen] = useState(hasActiveItem);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Find the index of the active NavLink
  const activeIndex = subSection.items.findIndex(
    (item) => isNavLink(item) && isPathActive(item.href)
  );

  // Handle initial animation and position updates
  useEffect(() => {
    if (itemsContainerRef.current && activeIndex !== -1 && isOpen) {
      const itemElements = itemsContainerRef.current.children;
      if (activeIndex < itemElements.length) {
        const activeItem = itemElements[activeIndex] as HTMLElement;
        const containerTop =
          itemsContainerRef.current.getBoundingClientRect().top;
        const itemRect = activeItem.getBoundingClientRect();
        const relativeTop = itemRect.top - containerTop + itemRect.height / 2;

        const isInitialEntry = prevActiveIndex === -1;

        if (isInitialEntry) {
          setScale(0);
          setActiveItemPosition(relativeTop);
          setTimeout(() => {
            setScale(1);
            setTimeout(() => {
              setShowPing(true);
              setTimeout(() => setShowPing(false), 900);
            }, 300);
          }, 50);
        } else {
          setActiveItemPosition(relativeTop);
          setScale(1);
        }

        setPrevActiveIndex(activeIndex);
      }
    } else {
      setActiveItemPosition(null);
      setScale(0);
      setPrevActiveIndex(-1);
      setShowPing(false);
    }
  }, [activeIndex, isOpen, prevActiveIndex]);

  // Auto-open section when it contains the active item
  useEffect(() => {
    if (hasActiveItem && !isOpen) {
      setIsOpen(true);
    }
  }, [hasActiveItem]);

  return (
    <div className={className}>
      <button
        onClick={toggleOpen}
        className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-sm cursor-pointer text-left
          ${
            hasActiveItem
              ? "font-medium hover:bg-gray-800 text-gray-200"
              : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
          }`}
      >
        <span>{subSection.title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="ml-2 relative">
        {/* Border line */}
        <div
          className={`absolute top-0 bottom-0 w-0 border-l-3 border-gray-700 ${
            isOpen ? "" : "hidden"
          }`}
        ></div>

        {/* Animated Active Indicator */}
        {isOpen && activeItemPosition !== null && (
          <div className="relative">
            <div
              className="absolute transition-all duration-500 cubic-bezier(0.2, 0, 0, 1)"
              style={
                {
                  left: "-4px",
                  top: 0,
                  "--indicator-offset": `${activeItemPosition}px`,
                  transform: `translateY(-50%) translateY(var(--indicator-offset, 0))`,
                } as React.CSSProperties
              }
            >
              {showPing && (
                <div className="absolute w-3 h-3 rounded-full bg-secondary-500/50 animate-ping" />
              )}
              <div
                className="relative w-3 h-3 rounded-full bg-secondary-500 z-20 transition-all duration-500 ease-out"
                style={{
                  opacity: scale,
                  transform: `scale(${scale})`,
                }}
              />
            </div>
          </div>
        )}

        {/* Content with padding */}
        <div
          ref={itemsContainerRef}
          className={`pl-3 overflow-hidden transition-all duration-300 ${
            isOpen ? "pt-0.5" : "max-h-0"
          }`}
        >
          {subSection.items.map((item, itemIndex) => (
            <div key={itemIndex} className="text-sm py-1">
              {renderNavItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
