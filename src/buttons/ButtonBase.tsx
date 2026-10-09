import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ElementType,
    type KeyboardEvent,
    type MouseEvent,
} from 'react';
import { cn } from '@/utils/cn';

export const buttonBaseClasses =
    'relative box-border inline-flex items-center justify-center bg-transparent outline-0 border-0 m-0 rounded-none p-0 cursor-pointer select-none align-middle appearance-none no-underline text-inherit [-webkit-tap-highlight-color:transparent] data-disabled:pointer-events-none data-disabled:cursor-default print:[print-color-adjust:exact]';

export type ButtonBaseElement = HTMLButtonElement & HTMLAnchorElement;

export interface ButtonBaseProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onClick'> {
    onClick?: (event: MouseEvent<ButtonBaseElement>) => void;
    component?: ElementType;
    href?: string;
    to?: string;
    target?: string;
    rel?: string;
    disableRipple?: boolean;
    [key: `data-${string}`]: unknown;
}

export function resolveButtonElement(
    component: ElementType | undefined,
    href: string | undefined
): ElementType {
    if (component) return component;
    if (href) return 'a';
    return 'button';
}

function hasNativeKeyboardActivation(element: HTMLElement): boolean {
    if (element.tagName === 'BUTTON') return true;
    return element.tagName === 'A' && Boolean((element as HTMLAnchorElement).href);
}

interface ButtonKeyboardOptions<T extends HTMLElement> {
    disabled?: boolean;
    onClick?: (event: MouseEvent<T>) => void;
    onKeyDown?: (event: KeyboardEvent<T>) => void;
    onKeyUp?: (event: KeyboardEvent<T>) => void;
}

export function buttonKeyboardHandlers<T extends HTMLElement>({
    disabled,
    onClick,
    onKeyDown,
    onKeyUp,
}: ButtonKeyboardOptions<T>) {
    return {
        onClick: (event: MouseEvent<T>) => {
            if (disabled) {
                event.preventDefault();
                return;
            }
            onClick?.(event);
        },
        onKeyDown: (event: KeyboardEvent<T>) => {
            if (disabled) return;
            onKeyDown?.(event);
            if (
                event.target !== event.currentTarget ||
                hasNativeKeyboardActivation(event.currentTarget)
            )
                return;
            if (event.key === ' ') {
                event.preventDefault();
                return;
            }
            if (event.key === 'Enter') {
                event.preventDefault();
                event.currentTarget.click();
            }
        },
        onKeyUp: (event: KeyboardEvent<T>) => {
            if (disabled) return;
            onKeyUp?.(event);
            if (
                event.target === event.currentTarget &&
                !hasNativeKeyboardActivation(event.currentTarget) &&
                event.key === ' ' &&
                !event.defaultPrevented
            )
                event.currentTarget.click();
        },
    };
}

export const ButtonBase = forwardRef<HTMLElement, ButtonBaseProps>(function ButtonBase(
    {
        component,
        href,
        className,
        type,
        disabled,
        disableRipple: _disableRipple,
        tabIndex = 0,
        onClick,
        onKeyDown,
        onKeyUp,
        ...other
    },
    ref
) {
    const Component = resolveButtonElement(component, href);
    const isLink = Boolean(href || other.to);
    const isNativeButton = Component === 'button';
    const handlers = buttonKeyboardHandlers<ButtonBaseElement>({
        disabled,
        onClick,
        onKeyDown,
        onKeyUp,
    });
    return (
        <Component
            ref={ref}
            href={href}
            type={isLink || !isNativeButton ? type : (type ?? 'button')}
            disabled={!isLink && isNativeButton ? disabled : undefined}
            aria-disabled={(isLink || !isNativeButton) && disabled ? true : undefined}
            data-disabled={disabled ? '' : undefined}
            tabIndex={disabled ? -1 : tabIndex}
            role={!isLink && !isNativeButton ? 'button' : undefined}
            className={cn(buttonBaseClasses, className)}
            {...handlers}
            {...other}
        />
    );
});
