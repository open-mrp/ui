import { useState } from "react";
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
  const hasActiveItem = subSection.items.some((item) => {
    if (isNavLink(item)) {
      return isPathActive(item.href);
    } else {
      return item.items.some(
        (subItem) => isNavLink(subItem) && isPathActive(subItem.href)
      );
    }
  });

  const [isOpen, setIsOpen] = useState(hasActiveItem);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Find the index of the active NavLink
  const activeIndex = subSection.items.findIndex(
    (item) => isNavLink(item) && isPathActive(item.href)
  );

  return (
    <div className={className}>
      <button
        onClick={toggleOpen}
        className={`flex w-full items-center justify-between rounded px-2 py-1 text-sm cursor-pointer
          ${
            hasActiveItem
              ? "text-gray-200 font-medium hover:bg-gray-800"
              : "text-gray-400 hover:bg-gray-800"
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
        {isOpen && activeIndex !== -1 && (
          <div
            className="absolute w-3 h-3 rounded-full bg-secondary-500 z-20 transition-transform duration-500 ease-in-out"
            style={{
              left: "-4px",
              top: "12px",
              transform: `translateY(${activeIndex * 32}px)`,
            }}
          />
        )}

        {/* Content with padding */}
        <div
          className={`pl-3 overflow-hidden transition-all duration-300 ${
            isOpen ? "pt-0.5" : "max-h-0"
          }`}
        >
          {subSection.items.map((item, itemIndex) => (
            <div key={itemIndex} className="text-sm py-0.5">
              {renderNavItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
