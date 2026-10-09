import {
    createContext,
    forwardRef,
    useContext,
    useId,
    useRef,
    type ComponentPropsWithoutRef,
    type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import { Modal, type ModalProps } from './Modal';
import { Typography, type TypographyProps } from '@/typography/Typography';

export type DialogMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;

const maxWidthClasses: Record<Exclude<DialogMaxWidth, false>, string> = {
    xs: 'max-w-[444px]',
    sm: 'max-w-[768px]',
    md: 'max-w-[1024px]',
    lg: 'max-w-[1440px]',
    xl: 'max-w-[1720px]',
};

const bodyScrollMaxWidthClasses: Record<Exclude<DialogMaxWidth, false>, string> = {
    xs: 'max-[507.95px]:max-w-[calc(100%-64px)]',
    sm: 'max-[831.95px]:max-w-[calc(100%-64px)]',
    md: 'max-[1087.95px]:max-w-[calc(100%-64px)]',
    lg: 'max-[1503.95px]:max-w-[calc(100%-64px)]',
    xl: 'max-[1783.95px]:max-w-[calc(100%-64px)]',
};

const DialogContext = createContext<{ titleId?: string }>({});

export interface DialogProps extends Omit<
    ModalProps,
    'children' | 'contentClassName' | 'contentIsBackdrop' | 'exitDuration'
> {
    children?: ReactNode;
    maxWidth?: DialogMaxWidth;
    fullWidth?: boolean;
    fullScreen?: boolean;
    scroll?: 'paper' | 'body';
    paperClassName?: string;
    paperProps?: ComponentPropsWithoutRef<'div'>;
    containerClassName?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
    {
        open,
        onClose,
        children,
        maxWidth = 'sm',
        fullWidth = false,
        fullScreen = false,
        scroll = 'paper',
        className,
        paperClassName,
        paperProps,
        containerClassName,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        initialFocusRef,
        backdropClassName,
        ...other
    },
    ref
) {
    const titleId = useId();
    const paperRef = useRef<HTMLDivElement | null>(null);
    return (
        <Modal
            ref={ref}
            open={open}
            onClose={onClose}
            initialFocusRef={initialFocusRef ?? paperRef}
            exitDuration={100}
            contentIsBackdrop
            className={cn('print:absolute!', className)}
            backdropClassName={cn(
                'bg-black/40 backdrop-blur-sm dark:bg-black/60',
                open ? 'animate-backdrop-in' : 'animate-backdrop-out',
                backdropClassName
            )}
            contentClassName={cn(
                'h-full outline-0',
                scroll === 'paper'
                    ? 'flex items-center justify-center'
                    : 'overflow-x-hidden overflow-y-auto text-center after:inline-block after:h-full after:w-0 after:align-middle after:content-[""]',
                containerClassName
            )}
            {...other}
        >
            <DialogContext.Provider value={{ titleId: ariaLabelledBy ?? titleId }}>
                <div
                    ref={paperRef}
                    role="dialog"
                    tabIndex={-1}
                    data-slot="dialog-paper"
                    aria-modal="true"
                    aria-labelledby={ariaLabelledBy ?? titleId}
                    aria-describedby={ariaDescribedBy}
                    {...paperProps}
                    className={cn(
                        'relative m-8 overflow-y-auto rounded-xl border border-solid border-divider/70 bg-paper/85 text-fg shadow-2xl outline-0 backdrop-blur-2xl backdrop-saturate-150 print:overflow-visible print:shadow-none',
                        open ? 'animate-dialog-in' : 'animate-dialog-out',
                        scroll === 'paper'
                            ? 'flex max-h-[calc(100%-64px)] flex-col'
                            : 'inline-block text-left align-middle',
                        maxWidth ? maxWidthClasses[maxWidth] : 'max-w-[calc(100%-64px)]',
                        maxWidth && scroll === 'body' && bodyScrollMaxWidthClasses[maxWidth],
                        fullWidth && 'w-[calc(100%-64px)]',
                        fullScreen && 'm-0 h-full max-h-none w-full max-w-full rounded-none',
                        paperProps?.className,
                        paperClassName
                    )}
                >
                    {children}
                </div>
            </DialogContext.Provider>
        </Modal>
    );
});

export const DialogTitle = forwardRef<HTMLElement, TypographyProps>(function DialogTitle(
    { className, id, ...other },
    ref
) {
    const { titleId } = useContext(DialogContext);
    return (
        <Typography
            ref={ref}
            component="h2"
            variant="h6"
            id={id ?? titleId}
            data-dialog-title=""
            className={cn('flex-[0_0_auto] m-0 px-6 py-4', className)}
            {...other}
        />
    );
});

export interface DialogContentProps extends ComponentPropsWithoutRef<'div'> {
    dividers?: boolean;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
    { dividers = false, className, ...other },
    ref
) {
    return (
        <div
            ref={ref}
            className={cn(
                'flex-[1_1_auto] overflow-y-auto [-webkit-overflow-scrolling:touch]',
                dividers
                    ? 'border-t border-b border-solid border-divider px-6 py-4'
                    : 'px-6 py-5 [[data-dialog-title]+&]:pt-0',
                className
            )}
            {...other}
        />
    );
});

export interface DialogActionsProps extends ComponentPropsWithoutRef<'div'> {
    disableSpacing?: boolean;
}

export const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(function DialogActions(
    { disableSpacing = false, className, ...other },
    ref
) {
    return (
        <div
            ref={ref}
            className={cn(
                'flex flex-[0_0_auto] items-center justify-end p-2',
                !disableSpacing && '[&>:not(style)~:not(style)]:ml-2',
                className
            )}
            {...other}
        />
    );
});

export const DialogContentText = forwardRef<HTMLElement, TypographyProps>(
    function DialogContentText({ className, ...other }, ref) {
        return (
            <Typography
                ref={ref}
                variant="body1"
                color="textSecondary"
                component="p"
                className={className}
                {...other}
            />
        );
    }
);
