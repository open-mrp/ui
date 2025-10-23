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
            "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background hover:bg-accent dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9",
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
              className="text-xs text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50 rounded px-1 py-0.5"
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
                "flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent/50 transition-colors cursor-pointer",
                column.isRequired && "opacity-50"
              )}
              onClick={() => !column.isRequired && onToggleColumn(column.id)}
            >
              <input
                type="checkbox"
                checked={column.isVisible}
                onChange={() => onToggleColumn(column.id)}
                disabled={column.isRequired}
                className="rounded border-input size-4"
              />
              <span
                className={cn(
                  "flex-1",
                  column.isRequired && "text-muted-foreground"
                )}
              >
                {column.label}
                {column.isRequired && " (required)"}
              </span>
              {column.isVisible ? (
                <EyeIcon className="size-4 text-foreground" />
              ) : (
                <EyeOffIcon className="size-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
