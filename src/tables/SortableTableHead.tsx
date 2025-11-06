"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/cn";

export type SortDirection = "asc" | "desc" | null;

export interface SortableTableHeadProps
  extends Omit<React.ComponentProps<"th">, "onClick"> {
  sortKey?: string;
  sortDirection?: SortDirection;
  onSort?: (sortKey: string) => void;
  sortable?: boolean;
}

export function SortableTableHead({
  className,
  children,
  sortKey,
  sortDirection,
  onSort,
  sortable = true,
  ...props
}: SortableTableHeadProps) {
  const handleClick = () => {
    if (sortable && sortKey && onSort) {
      onSort(sortKey);
    }
  };

  return (
    <th
      data-slot="sortable-table-head"
      className={cn(
        "text-gray-900 dark:text-gray-100 h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        sortable &&
          "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <div className="flex items-center gap-1">
        <span>{children}</span>
        {sortable && sortKey && (
          <div className="flex items-center">
            {sortDirection === "asc" ? (
              <ChevronUpIcon className="size-3 text-gray-900 dark:text-gray-100 transition-colors" />
            ) : sortDirection === "desc" ? (
              <ChevronDownIcon className="size-3 text-gray-900 dark:text-gray-100 transition-colors" />
            ) : (
              <div className="flex flex-col">
                {/* <ChevronUpIcon className="size-3 text-gray-500 dark:text-gray-400 transition-colors" />
                <ChevronDownIcon className="size-3 -mt-1 text-gray-500 dark:text-gray-400 transition-colors" /> */}
              </div>
            )}
          </div>
        )}
      </div>
    </th>
  );
}
