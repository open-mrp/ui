import type { ComponentSize } from "@/types/ComponentSize";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import React from "react";

export type ButtonVariant = "contained" | "outlined" | "text" | "icon";

// Base styles
const BASE_STYLES =
  "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-250 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const buttonVariants = cva(BASE_STYLES, {
  variants: {
    variant: {
      contained: "",
      outlined: "border",
      text: "",
      icon: "p-2",
    },
    color: {
      primary: "",
      secondary: "",
      gray: "",
    } as Record<string, string>,
    size: {
      sm: "px-4 py-2 text-xs",
      md: "px-4 py-2",
      lg: "px-6 py-2 text-base",
    },
    disabled: {
      true: "hover:cursor-auto",
      false: "hover:cursor-pointer",
    },
    blur: {
      true: "backdrop-blur-md",
      false: "",
    },
  },
  compoundVariants: [
    // Contained variants
    {
      variant: "contained",
      color: "primary",
      disabled: false,
      blur: false,
      class:
        "bg-primary-500 text-white hover:bg-primary-600 dark:hover:bg-primary-600",
    },
    {
      variant: "contained",
      color: "secondary",
      disabled: false,
      blur: false,
      class:
        "bg-secondary-500 text-white hover:bg-secondary-600 dark:hover:bg-secondary-600",
    },
    {
      variant: "contained",
      color: "gray",
      disabled: false,
      blur: false,
      class: "bg-gray-500 text-white hover:bg-gray-600 dark:hover:bg-gray-600",
    },
    {
      variant: "contained",
      disabled: true,
      blur: false,
      class: "bg-gray-700/50 text-gray-600",
    },
    {
      variant: "contained",
      blur: true,
      disabled: false,
      class:
        "bg-white/10 text-white hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10",
    },

    // Outlined variants
    {
      variant: "outlined",
      color: "primary",
      disabled: false,
      blur: false,
      class:
        "border-primary-500 text-primary-500 hover:bg-primary-500/5 hover:border-primary-500",
    },
    {
      variant: "outlined",
      color: "secondary",
      disabled: false,
      blur: false,
      class:
        "border-secondary-500 text-secondary-500 hover:bg-secondary-500/5 hover:border-secondary-500",
    },
    {
      variant: "outlined",
      color: "gray",
      disabled: false,
      blur: false,
      class:
        "border-gray-500 text-gray-500 hover:bg-gray-500/5 hover:border-gray-500",
    },
    {
      variant: "outlined",
      disabled: true,
      blur: false,
      class: "border-gray-700/50 text-gray-600",
    },
    {
      variant: "outlined",
      blur: true,
      disabled: false,
      class:
        "border-white/20 text-white hover:bg-white/10 hover:border-white/30 dark:hover:bg-white/5",
    },

    // Text variants
    {
      variant: "text",
      color: "primary",
      disabled: false,
      blur: false,
      class:
        "text-primary-500 hover:bg-primary-500/5 dark:hover:bg-primary-500/5",
    },
    {
      variant: "text",
      color: "secondary",
      disabled: false,
      blur: false,
      class:
        "text-secondary-500 hover:bg-secondary-500/5 dark:hover:bg-secondary-500/5",
    },
    {
      variant: "text",
      color: "gray",
      disabled: false,
      blur: false,
      class: "text-gray-500 hover:bg-gray-500/5 dark:hover:bg-gray-500/5",
    },
    {
      variant: "text",
      disabled: true,
      blur: false,
      class: "text-gray-600",
    },
    {
      variant: "text",
      blur: true,
      disabled: false,
      class: "text-white hover:bg-white/20 dark:hover:bg-white/15",
    },

    // Icon variants
    {
      variant: "icon",
      color: "primary",
      disabled: false,
      blur: false,
      class:
        "text-primary-500 hover:bg-primary-500/5 dark:hover:bg-primary-500/5",
    },
    {
      variant: "icon",
      color: "secondary",
      disabled: false,
      blur: false,
      class:
        "text-secondary-500 hover:bg-secondary-500/5 dark:hover:bg-secondary-500/5",
    },
    {
      variant: "icon",
      color: "gray",
      disabled: false,
      blur: false,
      class: "text-gray-500 hover:bg-gray-500/5 dark:hover:bg-gray-500/5",
    },
    {
      variant: "icon",
      disabled: true,
      blur: false,
      class: "text-gray-600",
    },
    {
      variant: "icon",
      blur: true,
      disabled: false,
      class: "text-white hover:bg-white/20 dark:hover:bg-white/15",
    },
  ],
  defaultVariants: {
    variant: "contained",
    color: "primary",
    size: "md",
    disabled: false,
    blur: false,
  },
});

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ComponentSize;
  color?: string;
  disabled?: boolean;
  blur?: boolean;
}

export default function Button({
  children,
  variant = "contained",
  size = "md",
  color = "primary",
  disabled = false,
  blur = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        buttonVariants({ variant, color, size, disabled, blur }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
