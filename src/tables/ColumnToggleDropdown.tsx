"use client";

import {
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  SettingsIcon,
} from "lucide-react";

import { cn } from "@/utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../navigation/DropdownMenu";

export interface ColumnConfig {
  id: string;
  label: string;
  isVisible: boolean;
  isRequired?: boolean;
}

export interface ColumnToggleDropdownProps {
  columns: ColumnConfig[];
  onToggleColumn: (columnId: string) => void;
  onResetColumns?: () => void;
  className?: string;
}

export function ColumnToggleDropdown({
  columns,
  onToggleColumn,
  onResetColumns,
  className,
}: ColumnToggleDropdownProps) {
  const visibleColumns = columns.filter((col) => col.isVisible).length;
  const totalColumns = columns.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "border-gray-300 text-gray-900 data-[placeholder]:text-gray-500 [&_svg:not([class*='text-'])]:text-gray-500 focus-visible:border-stone-500 focus-visible:ring-stone-500/50 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:focus-visible:border-stone-400 dark:focus-visible:ring-stone-400/50 flex w-fit items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9",
            className
          )}
          title="Column settings"
        >
          <div className="flex items-center gap-2">
            <SettingsIcon className="size-4" />
            <span>
              Columns ({visibleColumns}/{totalColumns})
            </span>
          </div>
          <ChevronDownIcon className="size-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Column Visibility</span>
          {onResetColumns && (
            <button
              onClick={onResetColumns}
              className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500/50 dark:focus:ring-stone-400/50 rounded px-1 py-0.5"
            >
              Reset
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-48 overflow-y-auto">
          {columns.map((column) => (
            <div
              key={column.id}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer",
                column.isRequired && "opacity-50"
              )}
              onClick={() => !column.isRequired && onToggleColumn(column.id)}
            >
              <input
                type="checkbox"
                checked={column.isVisible}
                onChange={() => onToggleColumn(column.id)}
                disabled={column.isRequired}
                className="rounded border-gray-300 dark:border-gray-600 size-4"
              />
              <span
                className={cn(
                  "flex-1",
                  column.isRequired && "text-gray-500 dark:text-gray-400"
                )}
              >
                {column.label}
                {column.isRequired && " (required)"}
              </span>
              {column.isVisible ? (
                <EyeIcon className="size-4 text-gray-900 dark:text-gray-100" />
              ) : (
                <EyeOffIcon className="size-4 text-gray-500 dark:text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
