"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
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

function DraggableTableHead({
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
  ...props
}: DraggableTableHeadProps) {
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
      // Find the dragged column index and current column index
      // This will be handled by the parent component
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
      data-slot="draggable-table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        sortable && "cursor-pointer hover:bg-muted/50 transition-colors",
        isDragging && "opacity-50",
        (isDragOver || isDragOverSelf) &&
          "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500",
        className
      )}
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...props}
    >
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
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
  DraggableTableHead,
  SortableTableHead,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
