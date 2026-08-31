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

/**
 * Above every app chrome layer, matching the popover and selector overlays in this
 * library.
 *
 * A tooltip portals to the body, so nothing clips it — but a sidebar or app bar painted
 * at a higher z-index draws straight over it, and the half of the tooltip that sits under
 * the sidebar simply disappears. That reads as truncated text rather than as a stacking
 * bug, which is what makes it worth pinning here instead of leaving each consumer to
 * discover it.
 */
const TOOLTIP_Z_INDEX = 1400;

function TooltipContent({
    className,
    sideOffset = 0,
    collisionPadding = 8,
    style,
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
                collisionPadding={collisionPadding}
                style={{ zIndex: TOOLTIP_Z_INDEX, ...style }}
                className={cn(
                    'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-fit max-w-[min(24rem,calc(100vw-2rem))] origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
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
                            ' size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]',
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
