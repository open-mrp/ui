import {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type FocusEvent,
    type KeyboardEvent,
    type MouseEvent,
    type ReactElement,
    type Ref,
} from 'react';
import { ButtonBase, type ButtonBaseProps } from './ButtonBase';
import { cn } from '@/utils/cn';
import { useForkRef } from '@/hooks/use-fork-ref';
import type { Size } from '@/theme/types';

type ToggleColor = 'standard' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
type GroupPosition = 'first' | 'middle' | 'last' | 'only';

const selectedColors: Record<ToggleColor, string> = {
    standard: 'text-fg bg-fg/8 hover:bg-fg/12',
    primary: 'text-primary-main bg-primary-main/8 hover:bg-primary-main/12',
    secondary: 'text-secondary-main bg-secondary-main/8 hover:bg-secondary-main/12',
    error: 'text-error-main bg-error-main/8 hover:bg-error-main/12',
    info: 'text-info-main bg-info-main/8 hover:bg-info-main/12',
    success: 'text-success-main bg-success-main/8 hover:bg-success-main/12',
    warning: 'text-warning-main bg-warning-main/8 hover:bg-warning-main/12',
};

const sizeClasses: Record<Size, string> = {
    small: 'p-[7px] text-[0.8125rem]',
    medium: 'p-[11px] text-[0.875rem]',
    large: 'p-[15px] text-[0.9375rem]',
};

const positionClasses: Record<GroupPosition, string> = {
    only: '',
    first: 'rounded-r-none',
    middle: 'rounded-none -ml-px border-l-transparent',
    last: 'rounded-l-none -ml-px border-l-transparent',
};

export interface ToggleButtonProps extends Omit<ButtonBaseProps, 'value' | 'onChange' | 'color'> {
    value: unknown;
    selected?: boolean;
    color?: ToggleColor;
    size?: Size;
    fullWidth?: boolean;
    onChange?: (event: MouseEvent<HTMLElement>, value: unknown) => void;
    groupPosition?: GroupPosition;
}

export const ToggleButton = forwardRef<HTMLElement, ToggleButtonProps>(function ToggleButton(
    {
        value,
        selected = false,
        color = 'standard',
        size = 'medium',
        fullWidth = false,
        onChange,
        onClick,
        groupPosition = 'only',
        className,
        ...other
    },
    ref
) {
    return (
        <ButtonBase
            ref={ref}
            aria-pressed={selected}
            data-toggle-button=""
            value={value as string}
            data-selected={selected ? '' : undefined}
            onClick={event => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                onChange?.(event, value);
            }}
            className={cn(
                'rounded-lg border border-solid border-divider font-plex-sans font-semibold leading-[1.75] uppercase text-action-active hover:bg-fg/4 hover:no-underline',
                sizeClasses[size],
                selected && selectedColors[color],
                'data-disabled:border-action-disabled-bg data-disabled:text-action-disabled',
                fullWidth && 'w-full',
                positionClasses[groupPosition],
                groupPosition !== 'only' &&
                    groupPosition !== 'first' &&
                    '[[data-selected]+&[data-selected]]:ml-0 [[data-selected]+&[data-selected]]:border-l-0',
                className
            )}
            {...other}
        />
    );
});

export interface ToggleButtonGroupProps<T = unknown> extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'onChange' | 'color'
> {
    value?: T;
    onChange?: (event: MouseEvent<HTMLElement>, value: T) => void;
    exclusive?: boolean;
    size?: Size;
    color?: ToggleColor;
    disabled?: boolean;
    fullWidth?: boolean;
    orientation?: 'horizontal' | 'vertical';
}

function isSelected(groupValue: unknown, value: unknown): boolean {
    if (Array.isArray(groupValue)) return groupValue.includes(value);
    return groupValue === value;
}

type ToggleButtonGroupComponent = <T = unknown>(
    props: ToggleButtonGroupProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement | null;

export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
    function ToggleButtonGroup(
        {
            value,
            onChange,
            exclusive = false,
            size = 'medium',
            color = 'standard',
            disabled = false,
            fullWidth = false,
            orientation = 'horizontal',
            className,
            children,
            onKeyDown,
            ...other
        },
        ref
    ) {
        const valid = Children.toArray(children).filter(isValidElement) as Array<
            ReactElement<ToggleButtonProps>
        >;
        const groupRef = useRef<HTMLDivElement | null>(null);
        const handleRef = useForkRef(groupRef, ref);
        const [activeIndex, setActiveIndex] = useState<number | null>(null);
        const isItemDisabled = (index: number) =>
            Boolean(valid[index]?.props.disabled ?? disabled);
        const firstEnabled = valid.findIndex((_, index) => !isItemDisabled(index));
        const rovingIndex =
            activeIndex !== null && activeIndex < valid.length && !isItemDisabled(activeIndex)
                ? activeIndex
                : firstEnabled;
        const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
            onKeyDown?.(event);
            if (
                event.defaultPrevented ||
                event.altKey ||
                event.shiftKey ||
                event.ctrlKey ||
                event.metaKey
            )
                return;
            const previousKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
            const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
            const container = groupRef.current;
            if (!container) return;
            const items = Array.from(
                container.querySelectorAll<HTMLElement>('[data-toggle-button]')
            ).filter(item => item.closest('[role=group]') === container);
            const focused = items.indexOf(document.activeElement as HTMLElement);
            let current = focused === -1 ? rovingIndex : focused;
            let step = 1;
            if (event.key === previousKey) {
                step = -1;
                if (document.activeElement === container) current = items.length;
            } else if (event.key === nextKey) {
                if (document.activeElement === container) current = -1;
            } else if (event.key === 'Home') {
                current = -1;
            } else if (event.key === 'End') {
                step = -1;
                current = items.length;
            } else {
                return;
            }
            event.preventDefault();
            for (let offset = 1; offset <= items.length; offset += 1) {
                const index =
                    (((current + step * offset) % items.length) + items.length) % items.length;
                const item = items[index];
                if (item && !item.hasAttribute('data-disabled')) {
                    item.focus();
                    setActiveIndex(index);
                    return;
                }
            }
        };
        const handleChange = (event: MouseEvent<HTMLElement>, buttonValue: unknown) => {
            if (!onChange) return;
            if (exclusive) {
                onChange(event, value === buttonValue ? null : buttonValue);
                return;
            }
            const current = Array.isArray(value) ? [...value] : [];
            const index = current.indexOf(buttonValue);
            if (index >= 0) current.splice(index, 1);
            else current.push(buttonValue);
            onChange(event, current);
        };
        return (
            <div
                ref={handleRef}
                role="group"
                onKeyDown={handleKeyDown}
                className={cn(
                    'inline-flex rounded-lg',
                    orientation === 'vertical' && 'flex-col',
                    fullWidth && 'w-full',
                    className
                )}
                {...other}
            >
                {valid.map((element, index) => {
                    const position: GroupPosition =
                        valid.length === 1
                            ? 'only'
                            : index === 0
                              ? 'first'
                              : index === valid.length - 1
                                ? 'last'
                                : 'middle';
                    return cloneElement(element, {
                        key: element.key ?? index,
                        groupPosition: position,
                        selected: element.props.selected ?? isSelected(value, element.props.value),
                        onChange: handleChange,
                        size: element.props.size ?? size,
                        color: element.props.color ?? color,
                        disabled: element.props.disabled ?? disabled,
                        fullWidth,
                        tabIndex: index === rovingIndex ? 0 : -1,
                        onFocus: (event: FocusEvent<HTMLButtonElement>) => {
                            element.props.onFocus?.(event);
                            setActiveIndex(index);
                        },
                    });
                })}
            </div>
        );
    }
) as ToggleButtonGroupComponent;
