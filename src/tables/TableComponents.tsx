"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  SettingsIcon,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/cn";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

export type SortDirection = "asc" | "desc" | null;

export interface SortableTableHeadProps
  extends Omit<React.ComponentProps<"th">, "onClick"> {
  sortKey?: string;
  sortDirection?: SortDirection;
  onSort?: (sortKey: string) => void;
  sortable?: boolean;
}

function SortableTableHead({
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
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        sortable && "cursor-pointer hover:bg-muted/50 transition-colors",
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
              <ChevronUpIcon className="size-3 text-foreground transition-colors" />
            ) : sortDirection === "desc" ? (
              <ChevronDownIcon className="size-3 text-foreground transition-colors" />
            ) : (
              <div className="flex flex-col">
                {/* <ChevronUpIcon className="size-3 text-muted-foreground transition-colors" />
                <ChevronDownIcon className="size-3 -mt-1 text-muted-foreground transition-colors" /> */}
              </div>
            )}
          </div>
        )}
      </div>
    </th>
  );
}

export interface DraggableTableHeadProps extends SortableTableHeadProps {
  columnId: string;
  onColumnReorder?: (fromColumnId: string, toColumnId: string) => void;
  columnIndex?: number;
  isDragging?: boolean;
  isDragOver?: boolean;
}

export interface ToggleableTableHeadProps extends DraggableTableHeadProps {
  isVisible?: boolean;
  showDragHandle?: boolean;
}

function ToggleableTableHead({
  className,
  children,
  sortKey,
  sortDirection,
  onSort,
  sortable = true,
  columnId,
  onColumnReorder,
  columnIndex = 0,
  isDragging = false,
  isDragOver = false,
  isVisible = true,
  showDragHandle = true,
  ...props
}: ToggleableTableHeadProps) {
  const [isDragOverSelf, setIsDragOverSelf] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", columnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOverSelf(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverSelf(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverSelf(false);

    const draggedColumnId = e.dataTransfer.getData("text/plain");
    if (draggedColumnId && draggedColumnId !== columnId && onColumnReorder) {
      onColumnReorder(draggedColumnId, columnId);
    }
  };

  const handleClick = () => {
    if (sortable && sortKey && onSort) {
      onSort(sortKey);
    }
  };

  return (
    <th
      data-slot="toggleable-table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        sortable && "cursor-pointer hover:bg-muted/50 transition-colors",
        isDragging && "opacity-50",
        (isDragOver || isDragOverSelf) &&
          "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500",
        !isVisible && "opacity-50",
        className
      )}
      onClick={handleClick}
      draggable={showDragHandle}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...props}
    >
      <div className="flex items-center gap-1">
        {showDragHandle && (
          <div className="flex items-center">
            <GripVerticalIcon className="size-3 text-muted-foreground cursor-grab active:cursor-grabbing" />
          </div>
        )}
        <div className="flex items-center gap-1 flex-1">
          <span>{children}</span>
        </div>
        {sortable && sortKey && (
          <div className="flex items-center">
            {sortDirection === "asc" ? (
              <ChevronUpIcon className="size-3 text-foreground transition-colors" />
            ) : sortDirection === "desc" ? (
              <ChevronDownIcon className="size-3 text-foreground transition-colors" />
            ) : (
              <div className="flex flex-col">
                {/* <ChevronUpIcon className="size-3 text-muted-foreground transition-colors" /> */}
                {/* <ChevronDownIcon className="size-3 -mt-1 text-muted-foreground transition-colors" /> */}
              </div>
            )}
          </div>
        )}
      </div>
    </th>
  );
}

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

function ColumnToggleDropdown({
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

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  ColumnToggleDropdown,
  SortableTableHead,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  ToggleableTableHead,
};
