'use client';

import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/cn';
import type { SortableTableHeadProps } from './SortableTableHead';

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

export function ToggleableTableHead({
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
        e.dataTransfer.setData('text/plain', columnId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOverSelf(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOverSelf(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOverSelf(false);

        const draggedColumnId = e.dataTransfer.getData('text/plain');
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
                'h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                sortable && 'cursor-pointer transition-colors',
                isDragging && 'opacity-50',
                (isDragOver || isDragOverSelf) && 'border-l-2',
                !isVisible && 'opacity-50',
                className,
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
                        <GripVerticalIcon className="size-3 opacity-50 cursor-grab active:cursor-grabbing" />
                    </div>
                )}
                <div className="flex items-center gap-1 flex-1">
                    <span>{children}</span>
                </div>
                {sortable && sortKey && (
                    <div className="flex items-center">
                        {sortDirection === 'asc' ? (
                            <ChevronUpIcon className="size-3 transition-colors" />
                        ) : sortDirection === 'desc' ? (
                            <ChevronDownIcon className="size-3 transition-colors" />
                        ) : (
                            <div className="flex flex-col">
                                {/* <ChevronUpIcon className="size-3 transition-colors" />
                <ChevronDownIcon className="size-3 -mt-1 transition-colors" /> */}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </th>
    );
}
