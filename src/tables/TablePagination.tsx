import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ElementType,
    type MouseEvent,
    type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import { IconButton } from '@/buttons/IconButton';
import { InternalKeyboardArrowLeftIcon, InternalKeyboardArrowRightIcon } from '@/icons/internal-icons';
import { MenuItem } from '@/overlays/Menu';
import { Select } from '@/forms/Select';

export interface TablePaginationProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: MouseEvent<HTMLElement> | null, page: number) => void;
    onRowsPerPageChange?: (event: { target: { value: string } }) => void;
    rowsPerPageOptions?: Array<number | { value: number; label: string }>;
    labelRowsPerPage?: ReactNode;
    labelDisplayedRows?: (info: {
        from: number;
        to: number;
        count: number;
        page: number;
    }) => ReactNode;
    component?: ElementType;
    showFirstButton?: boolean;
    showLastButton?: boolean;
}

function defaultLabelDisplayedRows({
    from,
    to,
    count,
}: {
    from: number;
    to: number;
    count: number;
}) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

export const TablePagination = forwardRef<HTMLDivElement, TablePaginationProps>(
    function TablePagination(
        {
            count,
            page,
            rowsPerPage,
            onPageChange,
            onRowsPerPageChange,
            rowsPerPageOptions = [10, 25, 50, 100],
            labelRowsPerPage = 'Rows per page:',
            labelDisplayedRows = defaultLabelDisplayedRows,
            component,
            className,
            ...other
        },
        ref
    ) {
        const Component = component ?? 'td';
        const from = count === 0 ? 0 : page * rowsPerPage + 1;
        const to =
            count === -1
                ? (page + 1) * rowsPerPage
                : rowsPerPage === -1
                  ? count
                  : Math.min(count, (page + 1) * rowsPerPage);
        const lastPage =
            count === -1
                ? Number.POSITIVE_INFINITY
                : Math.max(0, Math.ceil(count / rowsPerPage) - 1);
        return (
            <Component
                ref={ref}
                className={cn(
                    'overflow-auto font-plex-sans text-[0.875rem] text-fg last:p-0',
                    className
                )}
                {...other}
            >
                <div className="relative flex min-h-[52px] items-center pr-0.5 pl-4 screen-sm:pl-6">
                    <div className="flex-[1_1_100%]" />
                    {rowsPerPageOptions.length > 1 ? (
                        <>
                            <p className="m-0 shrink-0 font-plex-sans text-[0.875rem] leading-[1.57]">
                                {labelRowsPerPage}
                            </p>
                            <Select
                                variant="standard"
                                disableUnderline
                                value={rowsPerPage}
                                onChange={event =>
                                    onRowsPerPageChange?.({
                                        target: { value: String(event.target.value) },
                                    })
                                }
                                className="mr-8 ml-2 shrink-0 text-inherit text-[length:inherit]"
                                displayClassName="pr-6 pl-2 text-right [text-align-last:right]"
                            >
                                {rowsPerPageOptions.map(option => {
                                    const value =
                                        typeof option === 'number' ? option : option.value;
                                    const label =
                                        typeof option === 'number' ? option : option.label;
                                    return (
                                        <MenuItem key={value} value={value}>
                                            {label}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </>
                    ) : null}
                    <p className="m-0 shrink-0 font-plex-sans text-[0.875rem] leading-[1.57]">
                        {labelDisplayedRows({
                            from,
                            to: count === -1 ? to : Math.min(to, count),
                            count,
                            page,
                        })}
                    </p>
                    <div className="ml-5 shrink-0">
                        <IconButton
                            color="inherit"
                            aria-label="Go to previous page"
                            title="Go to previous page"
                            disabled={page === 0}
                            onClick={event => onPageChange(event, page - 1)}
                        >
                            <InternalKeyboardArrowLeftIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            aria-label="Go to next page"
                            title="Go to next page"
                            disabled={page >= lastPage}
                            onClick={event => onPageChange(event, page + 1)}
                        >
                            <InternalKeyboardArrowRightIcon />
                        </IconButton>
                    </div>
                </div>
            </Component>
        );
    }
);
