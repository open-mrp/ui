'use client';

import {
    Children,
    Fragment,
    forwardRef,
    isValidElement,
    useState,
    type ComponentPropsWithoutRef,
    type ReactNode,
} from 'react';
import { ButtonBase } from '@/buttons/ButtonBase';
import { cn } from '@/utils/cn';
import { InternalMoreHorizIcon } from '@/icons/internal-icons';

export interface BreadcrumbsProps extends ComponentPropsWithoutRef<'nav'> {
    separator?: ReactNode;
    maxItems?: number;
    itemsBeforeCollapse?: number;
    itemsAfterCollapse?: number;
    expandText?: string;
    listClassName?: string;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
    {
        separator = '/',
        maxItems = 8,
        itemsBeforeCollapse = 1,
        itemsAfterCollapse = 1,
        expandText = 'Show path',
        listClassName,
        className,
        children,
        ...other
    },
    ref
) {
    const [expanded, setExpanded] = useState(false);
    const items = Children.toArray(children).filter(isValidElement);
    let visible: ReactNode[] = items;
    if (
        !expanded &&
        items.length > maxItems &&
        itemsBeforeCollapse + itemsAfterCollapse < items.length
    ) {
        visible = [
            ...items.slice(0, itemsBeforeCollapse),
            <ButtonBase
                key="ellipsis"
                aria-label={expandText}
                onClick={() => setExpanded(true)}
                className="mx-1 flex rounded-[2px] bg-grey-100 px-1 text-grey-700 hover:bg-grey-200 dark:bg-grey-700 dark:text-grey-100 dark:hover:bg-grey-600"
            >
                <InternalMoreHorizIcon className="h-4 w-6" />
            </ButtonBase>,
            ...items.slice(items.length - itemsAfterCollapse),
        ];
    }
    return (
        <nav
            ref={ref}
            aria-label="breadcrumb"
            className={cn(
                'm-0 font-plex-sans text-[1rem] leading-[1.5] text-fg-secondary',
                className
            )}
            {...other}
        >
            <ol className={cn('m-0 flex list-none flex-wrap items-center p-0', listClassName)}>
                {visible.map((item, index) => (
                    <Fragment key={`item-${index}`}>
                        <li>{item}</li>
                        {index < visible.length - 1 ? (
                            <li aria-hidden className="mx-2 flex select-none">
                                {separator}
                            </li>
                        ) : null}
                    </Fragment>
                ))}
            </ol>
        </nav>
    );
});
