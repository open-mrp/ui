'use client';

import { CloseIcon } from '@/icons';
import * as React from 'react';

import { cn } from '@/utils/cn';
import { Slot } from '@/utils/slot';
import { Modal } from './Modal';
import { overlayProps } from './overlay';

interface SheetContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
    titleId: string;
    descriptionId: string;
    contentId: string;
    hasDescription: boolean;
    setHasDescription: (value: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext(component: string): SheetContextValue {
    const context = React.useContext(SheetContext);
    if (!context) throw new Error(`<${component}> must be used within <Sheet>`);
    return context;
}

export interface SheetProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

function Sheet({ open: openProp, defaultOpen = false, onOpenChange, children }: SheetProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const [hasDescription, setHasDescription] = React.useState(false);
    const controlled = openProp !== undefined;
    const open = controlled ? openProp : uncontrolledOpen;
    const id = React.useId();
    const setOpen = React.useCallback(
        (next: boolean) => {
            if (!controlled) setUncontrolledOpen(next);
            onOpenChange?.(next);
        },
        [controlled, onOpenChange],
    );
    const context = React.useMemo(
        () => ({
            open,
            setOpen,
            titleId: `${id}-title`,
            descriptionId: `${id}-description`,
            contentId: `${id}-content`,
            hasDescription,
            setHasDescription,
        }),
        [open, setOpen, id, hasDescription],
    );
    return <SheetContext.Provider value={context}>{children}</SheetContext.Provider>;
}

type ButtonLikeProps = React.ComponentProps<'button'> & { asChild?: boolean };

function SheetTrigger({ asChild = false, onClick, ...props }: ButtonLikeProps) {
    const { open, setOpen, contentId } = useSheetContext('SheetTrigger');
    const Component = asChild ? Slot : 'button';
    return (
        <Component
            type={asChild ? undefined : 'button'}
            data-slot="sheet-trigger"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? contentId : undefined}
            data-state={open ? 'open' : 'closed'}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (!event.defaultPrevented) setOpen(!open);
            }}
            {...props}
        />
    );
}

function SheetClose({ asChild = false, onClick, ...props }: ButtonLikeProps) {
    const { setOpen } = useSheetContext('SheetClose');
    const Component = asChild ? Slot : 'button';
    return (
        <Component
            type={asChild ? undefined : 'button'}
            data-slot="sheet-close"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (!event.defaultPrevented) setOpen(false);
            }}
            {...props}
        />
    );
}

const tabbableSelector =
    'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const slideIn = {
    right: 'animate-slide-in-right',
    left: 'animate-slide-in-left',
    top: 'animate-slide-in-up',
    bottom: 'animate-slide-in-up',
};

const slideOut = {
    right: 'animate-slide-out-right',
    left: 'animate-slide-out-left',
    top: 'animate-slide-out-down',
    bottom: 'animate-slide-out-down',
};

function SheetContent({
    className,
    children,
    side = 'right',
    ...props
}: React.ComponentProps<'div'> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
}) {
    const { open, setOpen, titleId, descriptionId, contentId, hasDescription } =
        useSheetContext('SheetContent');
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const [initialFocusRef] = React.useState<React.RefObject<HTMLElement | null>>(() => ({
        get current() {
            const panel = panelRef.current;
            if (!panel) return null;
            const first = Array.from(panel.querySelectorAll<HTMLElement>(tabbableSelector)).find(
                (element) => element.tabIndex >= 0 && element.getClientRects().length > 0,
            );
            return first ?? panel;
        },
    }));
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            exitDuration={195}
            initialFocusRef={initialFocusRef}
            backdropClassName="bg-black/50"
        >
            {(presence) => (
                <div
                    ref={panelRef}
                    id={contentId}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    aria-describedby={hasDescription ? descriptionId : undefined}
                    tabIndex={-1}
                    data-slot="sheet-content"
                    data-state={presence}
                    {...overlayProps}
                    className={cn(
                        'fixed z-50 flex flex-col shadow-lg outline-hidden',
                        presence === 'open' ? slideIn[side] : slideOut[side],
                        side === 'right' && 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
                        side === 'left' && 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
                        side === 'top' && 'inset-x-0 top-0 h-auto border-b',
                        side === 'bottom' && 'inset-x-0 bottom-0 h-auto border-t',
                        'bg-white text-gray-900 border-gray-200',
                        'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
                        className,
                    )}
                    {...props}
                >
                    <div className="flex flex-col h-full overflow-hidden">{children}</div>
                    <SheetClose className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
                        <CloseIcon />
                        <span className="sr-only">Close</span>
                    </SheetClose>
                </div>
            )}
        </Modal>
    );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="sheet-header"
            className={cn('flex flex-col gap-1.5 p-4 flex-shrink-0', className)}
            {...props}
        />
    );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="sheet-footer"
            className={cn('flex flex-col gap-2 p-4 flex-shrink-0', className)}
            {...props}
        />
    );
}

function SheetTitle({ className, ...props }: React.ComponentProps<'h2'>) {
    const { titleId } = useSheetContext('SheetTitle');
    return (
        <h2
            id={titleId}
            data-slot="sheet-title"
            className={cn('text-gray-900 dark:text-gray-100 font-semibold', className)}
            {...props}
        />
    );
}

function SheetDescription({ className, ...props }: React.ComponentProps<'p'>) {
    const { descriptionId, setHasDescription } = useSheetContext('SheetDescription');
    React.useEffect(() => {
        setHasDescription(true);
        return () => setHasDescription(false);
    }, [setHasDescription]);
    return (
        <p
            id={descriptionId}
            data-slot="sheet-description"
            className={cn('text-gray-600 dark:text-gray-400 text-sm', className)}
            {...props}
        />
    );
}

function SheetBody({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="sheet-body"
            className={cn('flex-1 overflow-auto p-4', className)}
            {...props}
        />
    );
}

export {
    Sheet,
    SheetBody,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
};
