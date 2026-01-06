'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

// https://wradix-ui.com/primitives/docs/components/tooltip

import { cn } from '@/utils/cn';

function TooltipProvider({
    delayDuration = 400,
    skipDelayDuration = 300,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            skipDelayDuration={skipDelayDuration}
            {...props}
        />
    );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipProvider>
            <TooltipPrimitive.Root data-slot="tooltip" {...props} />
        </TooltipProvider>
    );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
    className,
    sideOffset = 0,
    children,
    showArrow = true,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
    showArrow?: boolean;
}) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                sideOffset={sideOffset}
                className={cn(
                    'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
                    'bg-gray-800 fill-gray-800 text-gray-100 shadow-md',
                    'dark:bg-gray-100 dark:fill-gray-100 dark:text-gray-800 ',
                    className,
                )}
                {...props}
            >
                {children}
                {showArrow && (
                    <TooltipPrimitive.Arrow
                        className={cn(
                            ' z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]',
                            'fill-gray-800 bg-gray-800 text-gray-100',
                            'dark:fill-gray-100 dark:bg-gray-100 dark:text-gray-800',
                            className,
                        )}
                    />
                )}
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
