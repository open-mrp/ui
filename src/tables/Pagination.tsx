import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/buttons/ShadButton";
import { cn } from "@/utils/cn";

const PaginationContext = React.createContext<{ buttonClassName?: string }>({});

function Pagination({
  className,
  buttonClassName,
  ...props
}: React.ComponentProps<"nav"> & { buttonClassName?: string }) {
  return (
    <PaginationContext.Provider value={{ buttonClassName }}>
      <nav
        role="navigation"
        aria-label="pagination"
        data-slot="pagination"
        className={cn(
          "mx-auto flex w-full justify-center text-gray-700 dark:text-gray-200",
          className
        )}
        {...props}
      />
    </PaginationContext.Provider>
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="pagination-item" className={cn("", className)} {...props} />
  );
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"button">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  const { buttonClassName } = React.useContext(PaginationContext);
  const baseButtonClasses =
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-0 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-500 transition-colors";
  const activeButtonClasses =
    "border-gray-400 bg-gray-200 text-gray-900 dark:border-gray-400 dark:bg-gray-700 dark:text-white";
  const mergedClassName = cn(
    baseButtonClasses,
    isActive && activeButtonClasses,
    buttonClassName,
    className
  );

  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      variant="outline"
      size={size}
      className={mergedClassName}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "size">) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: Omit<React.ComponentProps<typeof PaginationLink>, "size">) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4 text-gray-500 dark:text-gray-400" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
