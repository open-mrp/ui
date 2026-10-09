import {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type FocusEvent,
    type KeyboardEvent,
    type ReactElement,
    type ReactNode,
    type SyntheticEvent,
} from 'react';
import { ButtonBase, type ButtonBaseProps } from '@/buttons/ButtonBase';
import { cn } from '@/utils/cn';
import { InternalKeyboardArrowLeftIcon, InternalKeyboardArrowRightIcon } from '@/icons/internal-icons';

type TabColor = 'primary' | 'secondary' | 'inherit';

export interface TabProps extends Omit<ButtonBaseProps, 'value' | 'onChange'> {
    label?: ReactNode;
    value?: unknown;
    icon?: ReactElement | string;
    iconPosition?: 'top' | 'bottom' | 'start' | 'end';
    wrapped?: boolean;
    selected?: boolean;
    fullWidth?: boolean;
    textColor?: TabColor;
    indicator?: ReactNode;
    onChange?: (event: SyntheticEvent, value: unknown) => void;
}

const selectedText: Record<TabColor, string> = {
    primary: 'text-primary-main',
    secondary: 'text-secondary-main',
    inherit: 'opacity-100',
};

export const Tab = forwardRef<HTMLElement, TabProps>(function Tab(
    {
        label,
        value,
        icon,
        iconPosition = 'top',
        wrapped = false,
        selected = false,
        fullWidth = false,
        textColor = 'primary',
        indicator,
        disabled = false,
        onChange,
        onClick,
        className,
        ...other
    },
    ref
) {
    const rowLayout = Boolean(
        icon && label && (iconPosition === 'start' || iconPosition === 'end')
    );
    return (
        <ButtonBase
            ref={ref}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={disabled}
            data-tab=""
            data-selected={selected ? '' : undefined}
            onClick={event => {
                if (!selected) onChange?.(event, value);
                onClick?.(event);
            }}
            className={cn(
                'relative max-w-[360px] min-w-[auto] shrink-0 overflow-hidden rounded-md px-3 py-1.5 text-center font-plex-sans text-sm font-medium leading-5 whitespace-nowrap normal-case transition-colors duration-200 active:scale-[0.97]',
                textColor === 'inherit' ? 'text-inherit opacity-60' : 'text-fg-secondary',
                textColor !== 'inherit' && !selected && 'hover:text-fg',
                selected && selectedText[textColor],
                'data-disabled:text-fg-disabled',
                textColor === 'inherit' && disabled && 'opacity-38',
                fullWidth && 'max-w-none shrink grow basis-0',
                wrapped && 'text-[0.75rem] leading-normal',
                icon && label && !rowLayout && 'py-2',
                rowLayout
                    ? iconPosition === 'end'
                        ? 'flex-row-reverse'
                        : 'flex-row'
                    : iconPosition === 'bottom'
                      ? 'flex-col-reverse'
                      : 'flex-col',
                className
            )}
            {...other}
        >
            {icon && label ? (
                <>
                    <span
                        className={cn(
                            'inline-flex',
                            iconPosition === 'top' && 'mb-1.5',
                            iconPosition === 'bottom' && 'mt-1.5',
                            iconPosition === 'start' && 'mr-2',
                            iconPosition === 'end' && 'ml-2'
                        )}
                    >
                        {icon}
                    </span>
                    {label}
                </>
            ) : (
                (icon ?? label)
            )}
            {indicator}
        </ButtonBase>
    );
});

export interface TabsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
    value?: unknown;
    onChange?: (event: SyntheticEvent, value: never) => void;
    variant?: 'standard' | 'scrollable' | 'fullWidth';
    indicatorColor?: 'primary' | 'secondary';
    textColor?: TabColor;
    scrollButtons?: 'auto' | boolean;
    allowScrollButtonsMobile?: boolean;
    centered?: boolean;
    orientation?: 'horizontal' | 'vertical';
    indicatorClassName?: string;
    flexContainerClassName?: string;
}

const indicatorColors = {
    primary: 'border-primary-main/30 bg-primary-main/12',
    secondary: 'border-secondary-main/30 bg-secondary-main/12',
};

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
    {
        value,
        onChange,
        variant = 'standard',
        indicatorColor = 'primary',
        textColor = 'primary',
        scrollButtons = 'auto',
        allowScrollButtonsMobile = false,
        centered = false,
        orientation = 'horizontal',
        indicatorClassName,
        flexContainerClassName,
        className,
        children,
        ...other
    },
    ref
) {
    const scrollable = variant === 'scrollable';
    const vertical = orientation === 'vertical';
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const indicatorRef = useRef<HTMLSpanElement | null>(null);
    const [scrollState, setScrollState] = useState({ start: false, end: false });
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const valueToIndex = new Map<unknown, number>();
    const tabElements = Children.toArray(children).filter(child =>
        isValidElement<TabProps>(child)
    ) as Array<ReactElement<TabProps>>;
    tabElements.forEach((child, index) => {
        valueToIndex.set(child.props.value === undefined ? index : child.props.value, index);
    });
    const selectedIndex = valueToIndex.get(value);
    const isTabEnabled = (index: number) => !tabElements[index]?.props.disabled;
    const rovingIndex =
        focusedIndex !== null && isTabEnabled(focusedIndex)
            ? focusedIndex
            : selectedIndex !== undefined && isTabEnabled(selectedIndex)
              ? selectedIndex
              : tabElements.findIndex((_, index) => isTabEnabled(index));
    const tabs = tabElements.map((child, index) => {
        const childValue = child.props.value === undefined ? index : child.props.value;
        return cloneElement(child, {
            fullWidth: variant === 'fullWidth',
            selected: childValue === value,
            onChange: onChange as TabProps['onChange'],
            textColor,
            value: childValue,
            tabIndex: child.props.tabIndex ?? (index === rovingIndex ? 0 : -1),
        });
    });

    const updateIndicator = useCallback(() => {
        const list = listRef.current;
        const indicator = indicatorRef.current;
        const scroller = scrollerRef.current;
        if (!list || !indicator || !scroller) return;
        const tabsNodes = Array.from(list.children).filter(node =>
            (node as HTMLElement).hasAttribute('data-tab')
        ) as HTMLElement[];
        const tab = selectedIndex !== undefined ? tabsNodes[selectedIndex] : undefined;
        if (!tab) {
            indicator.style.width = '0px';
            indicator.style.left = '0px';
            return;
        }
        const scrollerRect = scroller.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        if (vertical) {
            indicator.style.top = `${tabRect.top - scrollerRect.top + scroller.scrollTop}px`;
            indicator.style.height = `${tabRect.height}px`;
        } else {
            indicator.style.left = `${tabRect.left - scrollerRect.left + scroller.scrollLeft}px`;
            indicator.style.width = `${tabRect.width}px`;
        }
    }, [selectedIndex, vertical]);

    const updateScrollButtons = useCallback(() => {
        const scroller = scrollerRef.current;
        if (!scroller || !scrollable) return;
        const start = scroller.scrollLeft > 1;
        const end = scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 1;
        setScrollState(previous =>
            previous.start === start && previous.end === end ? previous : { start, end }
        );
    }, [scrollable]);

    useLayoutEffect(() => {
        updateIndicator();
    });

    useEffect(() => {
        const list = listRef.current;
        const frame = requestAnimationFrame(updateScrollButtons);
        if (!list || typeof ResizeObserver === 'undefined')
            return () => cancelAnimationFrame(frame);
        const observer = new ResizeObserver(() => {
            updateIndicator();
            updateScrollButtons();
        });
        observer.observe(list);
        Array.from(list.children).forEach(child => observer.observe(child));
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [updateIndicator, updateScrollButtons]);

    useEffect(() => {
        if (!scrollable || selectedIndex === undefined) return;
        const scroller = scrollerRef.current;
        const list = listRef.current;
        if (!scroller || !list) return;
        const tab = Array.from(list.children).filter(node =>
            (node as HTMLElement).hasAttribute('data-tab')
        )[selectedIndex] as HTMLElement | undefined;
        if (!tab) return;
        const scrollerRect = scroller.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        if (tabRect.left < scrollerRect.left)
            scroller.scrollLeft += tabRect.left - scrollerRect.left;
        else if (tabRect.right > scrollerRect.right)
            scroller.scrollLeft += tabRect.right - scrollerRect.right;
    }, [scrollable, selectedIndex]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const list = listRef.current;
        if (!list) return;
        const focusable = (Array.from(list.children) as HTMLElement[]).filter(
            node => node.hasAttribute('data-tab') && !node.hasAttribute('data-disabled')
        );
        const index = focusable.indexOf(document.activeElement as HTMLElement);
        const previousKey = vertical ? 'ArrowUp' : 'ArrowLeft';
        const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
        let target: HTMLElement | undefined;
        if (event.key === previousKey)
            target = focusable[(index - 1 + focusable.length) % focusable.length];
        else if (event.key === nextKey) target = focusable[(index + 1) % focusable.length];
        else if (event.key === 'Home') target = focusable[0];
        else if (event.key === 'End') target = focusable[focusable.length - 1];
        if (target) {
            event.preventDefault();
            target.focus();
            setFocusedIndex(getTabNodes().indexOf(target));
        }
    };

    const getTabNodes = () =>
        (Array.from(listRef.current?.children ?? []) as HTMLElement[]).filter(node =>
            node.hasAttribute('data-tab')
        );

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
        const index = getTabNodes().indexOf(event.target as HTMLElement);
        if (index !== -1) setFocusedIndex(index);
    };

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
        const next = event.relatedTarget as Node | null;
        if (!next || !listRef.current?.contains(next)) setFocusedIndex(null);
    };

    const scrollBy = (direction: 1 | -1) => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        scroller.scrollBy({ left: direction * scroller.clientWidth, behavior: 'smooth' });
    };

    const showButtons =
        scrollable &&
        scrollButtons !== false &&
        (scrollState.start || scrollState.end || scrollButtons === true);
    const scrollButton = (direction: 1 | -1) => (
        <div
            role="presentation"
            aria-hidden
            onClick={() => scrollBy(direction)}
            className={cn(
                'flex w-10 shrink-0 cursor-pointer items-center justify-center opacity-80',
                (direction === -1 ? !scrollState.start : !scrollState.end) &&
                    'pointer-events-none opacity-0',
                !allowScrollButtonsMobile && scrollButtons === 'auto' && 'max-screen-sm:hidden'
            )}
        >
            {direction === -1 ? (
                <InternalKeyboardArrowLeftIcon fontSize="small" />
            ) : (
                <InternalKeyboardArrowRightIcon fontSize="small" />
            )}
        </div>
    );

    return (
        <div
            ref={ref}
            className={cn(
                'flex overflow-hidden [-webkit-overflow-scrolling:touch]',
                vertical && 'flex-col',
                className
            )}
            {...other}
        >
            {showButtons ? scrollButton(-1) : null}
            <div
                ref={scrollerRef}
                onScroll={updateScrollButtons}
                className={cn(
                    'relative rounded-lg bg-fg/[0.06] p-[3px] whitespace-nowrap',
                    variant === 'standard' && !centered && !vertical
                        ? 'inline-block w-fit flex-none'
                        : 'inline-block flex-[1_1_auto]',
                    scrollable
                        ? cn(
                              '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                              vertical
                                  ? 'overflow-x-hidden overflow-y-auto'
                                  : 'overflow-x-auto overflow-y-hidden'
                          )
                        : 'overflow-hidden'
                )}
            >
                <div
                    ref={listRef}
                    role="tablist"
                    aria-orientation={vertical ? 'vertical' : undefined}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={cn(
                        'relative z-[1] flex gap-1',
                        vertical && 'flex-col',
                        centered && 'justify-center',
                        flexContainerClassName
                    )}
                >
                    {tabs}
                </div>
                <span
                    ref={indicatorRef}
                    className={cn(
                        'pointer-events-none absolute z-0 rounded-md border border-solid transition-all duration-200 ease-out',
                        vertical ? 'right-[3px] left-[3px]' : 'top-[3px] bottom-[3px]',
                        indicatorColors[indicatorColor],
                        indicatorClassName
                    )}
                />
            </div>
            {showButtons ? scrollButton(1) : null}
        </div>
    );
});
