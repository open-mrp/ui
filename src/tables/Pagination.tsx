"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/overlays/Select";
import { cn } from "@/utils/cn";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="pagination-item" className={cn("", className)} {...props} />
  );
}

type PaginationLinkProps = {
  isActive?: boolean;
  size?: "icon" | "default";
} & React.ComponentProps<"button">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  const sizeClasses = size === "icon" ? "size-9" : "h-9 px-4 py-2";

  return (
    <button
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      disabled={isActive}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px]",
        "border shadow-xs transition-[color,box-shadow]",
        "bg-white text-gray-900 border-gray-300 hover:bg-gray-50",
        "focus-visible:border-stone-500 focus-visible:ring-stone-500/50",
        "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700",
        "dark:focus-visible:border-stone-400 dark:focus-visible:ring-stone-400/50",
        sizeClasses,
        isActive && "opacity-50 cursor-default",
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "size">) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      disabled={disabled}
      className={cn(
        "gap-1 px-2.5 sm:pl-2.5",
        disabled && "opacity-50 cursor-default",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "size">) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      disabled={disabled}
      className={cn(
        "gap-1 px-2.5 sm:pr-2.5",
        disabled && "opacity-50 cursor-default",
        className
      )}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center",
        "text-gray-500",
        "dark:text-gray-400",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon className="size-4 opacity-50" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

// Items Per Page Selector
export interface ItemsPerPageSelectorProps extends React.ComponentProps<"div"> {
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  label?: string;
}

export function ItemsPerPageSelector({
  className,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
  label = "Items per page:",
  ...props
}: ItemsPerPageSelectorProps) {
  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value, 10);
    if (newItemsPerPage !== itemsPerPage) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <span className="text-sm opacity-75 text-gray-600 dark:text-gray-400">
        {label}
      </span>
      <Select
        value={itemsPerPage.toString()}
        onValueChange={handleItemsPerPageChange}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {itemsPerPageOptions.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Pagination Controls
export interface PaginationControlsProps extends React.ComponentProps<"nav"> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
}

/**
 * Utility function to calculate visible page numbers
 */
export function getVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number
): number[] {
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisiblePages / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisiblePages - 1);

  // Adjust start if we're near the end
  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function PaginationControls({
  className,
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showFirstLast = true,
  showPrevNext = true,
  ...props
}: PaginationControlsProps) {
  const visiblePages = getVisiblePages(
    currentPage,
    totalPages,
    maxVisiblePages
  );
  const showFirstEllipsis = visiblePages[0] > 2;
  const showLastEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className={className} {...props}>
      <PaginationContent>
        {/* Previous button */}
        {showPrevNext && (
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(currentPage - 1);
              }}
              disabled={currentPage <= 1}
            />
          </PaginationItem>
        )}

        {/* First page */}
        {showFirstLast && currentPage > 1 && !visiblePages.includes(1) && (
          <PaginationItem>
            <PaginationLink
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(1);
              }}
              isActive={currentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {/* First ellipsis */}
        {showFirstEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Page numbers */}
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(page);
              }}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Last ellipsis */}
        {showLastEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last page */}
        {showFirstLast &&
          currentPage < totalPages &&
          !visiblePages.includes(totalPages) && (
            <PaginationItem>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  handlePageClick(totalPages);
                }}
                isActive={currentPage === totalPages}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

        {/* Next button */}
        {showPrevNext && (
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(currentPage + 1);
              }}
              disabled={currentPage >= totalPages}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

// Table Pagination (convenience wrapper)
export interface TablePaginationProps extends React.ComponentProps<"div"> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showItemsPerPageSelector?: boolean;
}

/**
 * Convenience component that combines ItemsPerPageSelector and PaginationControls
 * For more control, use those components directly
 */
export function TablePagination({
  className,
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showFirstLast = true,
  showPrevNext = true,
  itemsPerPage = 10,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
  showItemsPerPageSelector = true,
  ...props
}: TablePaginationProps) {
  if (totalPages <= 1 && !showItemsPerPageSelector) {
    return null;
  }

  return (
    <div
      className={cn("flex items-center justify-between w-full", className)}
      {...props}
    >
      {showItemsPerPageSelector && onItemsPerPageChange && (
        <ItemsPerPageSelector
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      )}

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          maxVisiblePages={maxVisiblePages}
          showFirstLast={showFirstLast}
          showPrevNext={showPrevNext}
        />
      )}
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
