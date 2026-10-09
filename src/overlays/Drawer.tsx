import { forwardRef, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Modal, type ModalProps } from './Modal';
import { elevationClasses } from '@/layout/Paper';
import { usePresence } from '@/hooks/use-presence';

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps extends Omit<
    ModalProps,
    'children' | 'open' | 'contentClassName' | 'contentIsBackdrop'
> {
    open?: boolean;
    anchor?: DrawerAnchor;
    variant?: 'temporary' | 'persistent' | 'permanent';
    elevation?: number;
    paperClassName?: string;
    paperProps?: ComponentPropsWithoutRef<'div'>;
    children?: ReactNode;
}

const anchorPaperClasses: Record<DrawerAnchor, string> = {
    left: 'left-0',
    right: 'right-0',
    top: 'top-0 right-0 left-0 h-auto max-h-full',
    bottom: 'top-auto right-0 bottom-0 left-0 h-auto max-h-full',
};

const dockedBorder: Record<DrawerAnchor, string> = {
    left: 'border-r border-solid border-divider',
    right: 'border-l border-solid border-divider',
    top: 'border-b border-solid border-divider',
    bottom: 'border-t border-solid border-divider',
};

const slideIn: Record<DrawerAnchor, string> = {
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right',
    top: 'animate-slide-in-up',
    bottom: 'animate-slide-in-up',
};

const slideOut: Record<DrawerAnchor, string> = {
    left: 'animate-slide-out-left',
    right: 'animate-slide-out-right',
    top: 'animate-slide-out-down',
    bottom: 'animate-slide-out-down',
};

const paperBase =
    'fixed top-0 z-[1100] flex h-full flex-[1_0_auto] flex-col overflow-y-auto bg-paper text-fg outline-0 transition-shadow duration-300 ease-standard [-webkit-overflow-scrolling:touch]';

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
    {
        open = false,
        anchor = 'left',
        variant = 'temporary',
        elevation = 16,
        paperClassName,
        paperProps,
        className,
        children,
        onClose,
        initialFocusRef,
        ...other
    },
    ref
) {
    const { mounted, state } = usePresence(open, 195);
    const paperRef = useRef<HTMLDivElement | null>(null);
    if (variant === 'permanent' || variant === 'persistent') {
        const visible = variant === 'permanent' || mounted;
        return (
            <div ref={ref} className={cn('flex-[0_0_auto]', className)}>
                {visible ? (
                    <div
                        data-slot="drawer-paper"
                        {...paperProps}
                        className={cn(
                            paperBase,
                            anchorPaperClasses[anchor],
                            dockedBorder[anchor],
                            elevationClasses[0],
                            variant === 'persistent' &&
                                (state === 'open' ? slideIn[anchor] : slideOut[anchor]),
                            paperProps?.className,
                            paperClassName
                        )}
                    >
                        {children}
                    </div>
                ) : null}
            </div>
        );
    }
    return (
        <Modal
            ref={ref}
            open={open}
            onClose={onClose}
            exitDuration={195}
            initialFocusRef={initialFocusRef ?? paperRef}
            className={cn('z-[1100]', className)}
            {...other}
        >
            {presence => (
                <div
                    ref={paperRef}
                    role="dialog"
                    aria-modal="true"
                    tabIndex={-1}
                    data-slot="drawer-paper"
                    {...paperProps}
                    className={cn(
                        paperBase,
                        anchorPaperClasses[anchor],
                        elevationClasses[elevation],
                        presence === 'open' ? slideIn[anchor] : slideOut[anchor],
                        paperProps?.className,
                        paperClassName
                    )}
                >
                    {children}
                </div>
            )}
        </Modal>
    );
});

export interface BackdropProps extends ComponentPropsWithoutRef<'div'> {
    open: boolean;
    invisible?: boolean;
}

export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(function Backdrop(
    { open, invisible: _invisible, className, ...other },
    ref
) {
    const { mounted, state } = usePresence(open, 195);
    if (!mounted) return null;
    return (
        <div
            ref={ref}
            aria-hidden
            className={cn(
                'fixed inset-0 flex items-center justify-center bg-transparent [-webkit-tap-highlight-color:transparent]',
                state === 'open' ? 'animate-fade-in' : 'animate-fade-out opacity-0',
                className
            )}
            {...other}
        />
    );
});

export interface AppBarProps extends ComponentPropsWithoutRef<'header'> {
    position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
    elevation?: number;
    color?: 'primary' | 'secondary' | 'default' | 'inherit' | 'transparent';
}

const appBarPosition = {
    fixed: 'fixed top-0 right-0 left-auto z-[1200] print:absolute',
    absolute: 'absolute top-0 right-0 left-auto z-[1200]',
    sticky: 'sticky top-0 right-0 left-auto z-[1200]',
    static: 'static',
    relative: 'relative',
};

export const AppBar = forwardRef<HTMLElement, AppBarProps>(function AppBar(
    { position = 'fixed', elevation = 4, color = 'primary', className, ...other },
    ref
) {
    return (
        <header
            ref={ref}
            className={cn(
                'box-border flex w-full shrink-0 flex-col bg-blur backdrop-blur-[24px] transition-shadow duration-300 ease-standard',
                color === 'primary' && 'text-primary-contrast dark:text-fg',
                color === 'secondary' && 'text-secondary-contrast dark:text-fg',
                color === 'default' && 'text-fg',
                color === 'inherit' && 'text-inherit',
                elevationClasses[elevation],
                appBarPosition[position],
                className
            )}
            {...other}
        />
    );
});

export interface ToolbarProps extends ComponentPropsWithoutRef<'div'> {
    disableGutters?: boolean;
    variant?: 'regular' | 'dense';
}

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
    { disableGutters = false, variant = 'regular', className, ...other },
    ref
) {
    return (
        <div
            ref={ref}
            className={cn(
                'relative flex items-center',
                !disableGutters && 'px-4 screen-sm:px-6',
                variant === 'dense'
                    ? 'min-h-12'
                    : 'min-h-14 max-screen-sm:landscape:min-h-12 screen-sm:min-h-16',
                className
            )}
            {...other}
        />
    );
});
