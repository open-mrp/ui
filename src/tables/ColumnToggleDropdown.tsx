"use client";

import {
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  SettingsIcon,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/cn";

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
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const visibleColumns = columns.filter((col) => col.isVisible).length;
  const totalColumns = columns.length;

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
        title="Column settings"
      >
        <SettingsIcon className="size-4" />
        <span>
          Columns ({visibleColumns}/{totalColumns})
        </span>
        <ChevronDownIcon
          className={cn("size-3 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-background border rounded-md shadow-lg z-50">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Column Visibility</h3>
              {onResetColumns && (
                <button
                  onClick={onResetColumns}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {columns.map((column) => (
                <label
                  key={column.id}
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={column.isVisible}
                    onChange={() => onToggleColumn(column.id)}
                    disabled={column.isRequired}
                    className="rounded border-input"
                  />
                  <span
                    className={cn(
                      "text-sm flex-1",
                      column.isRequired && "text-muted-foreground"
                    )}
                  >
                    {column.label}
                    {column.isRequired && " (required)"}
                  </span>
                  {column.isVisible ? (
                    <EyeIcon className="size-3 text-foreground" />
                  ) : (
                    <EyeOffIcon className="size-3 text-muted-foreground" />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
