import { ComponentSize } from "@/types/ComponentSize";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import React from "react";

export type ButtonColor = "primary" | "secondary" | "gray" | "blur";
export type ButtonVariant = "contained" | "outlined" | "text";

// Base styles
const BASE_STYLES =
  "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors duration-250 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const buttonVariants = cva(BASE_STYLES, {
  variants: {
    variant: {
      contained: "",
      outlined: "border",
      text: "",
    },
    color: {
      primary: "",
      secondary: "",
      gray: "",
      blur: "",
    },
    size: {
      icon: "p-2",
      sm: "px-4 py-2 text-xs",
      md: "px-4 py-2",
      lg: "px-6 py-2 text-base",
    },
    disabled: {
      true: "hover:cursor-auto",
      false: "hover:cursor-pointer",
    },
  },
  compoundVariants: [
    // Contained variants
    {
      variant: "contained",
      color: "primary",
      disabled: false,
      class:
        "bg-primary-500 text-primary-50 hover:bg-primary-600 dark:hover:bg-primary-600",
    },
    {
      variant: "contained",
      color: "secondary",
      disabled: false,
      class:
        "bg-secondary-500 text-secondary-50 hover:bg-secondary-600 dark:hover:bg-secondary-600",
    },
    {
      variant: "contained",
      color: "gray",
      disabled: false,
      class:
        "bg-gray-500 text-gray-50 hover:bg-gray-600 dark:hover:bg-gray-600",
    },
    {
      variant: "contained",
      color: "blur",
      disabled: false,
      class:
        "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10",
    },
    {
      variant: "contained",
      disabled: true,
      class: "bg-gray-700/50 text-gray-600",
    },

    // Outlined variants
    {
      variant: "outlined",
      color: "primary",
      disabled: false,
      class:
        "border-primary-100 dark:border-primary-700 text-primary-500 hover:bg-primary-500/4 hover:border-primary-500",
    },
    {
      variant: "outlined",
      color: "secondary",
      disabled: false,
      class:
        "border-secondary-100 dark:border-secondary-700 text-secondary-500 hover:bg-secondary-500/4 hover:border-secondary-500",
    },
    {
      variant: "outlined",
      color: "gray",
      disabled: false,
      class:
        "border-gray-100 dark:border-gray-700 text-gray-500 hover:bg-gray-500/4 hover:border-gray-500",
    },
    {
      variant: "outlined",
      color: "blur",
      disabled: false,
      class:
        "border-white/20 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/30",
    },
    {
      variant: "outlined",
      disabled: true,
      class: "border-gray-700/50 text-gray-600",
    },

    // Text variants
    {
      variant: "text",
      color: "primary",
      disabled: false,
      class:
        "text-primary-500 dark:text-primary-400 hover:bg-primary-500/5 dark:hover:bg-primary-400/5",
    },
    {
      variant: "text",
      color: "secondary",
      disabled: false,
      class:
        "text-secondary-500 dark:text-secondary-400 hover:bg-secondary-500/5 dark:hover:bg-secondary-400/5",
    },
    {
      variant: "text",
      color: "gray",
      disabled: false,
      class:
        "text-gray-500 dark:text-gray-400 hover:bg-gray-500/5 dark:hover:bg-gray-400/5",
    },
    {
      variant: "text",
      color: "blur",
      disabled: false,
      class: "text-white hover:bg-white/10",
    },
    { variant: "text", disabled: true, class: "text-gray-600" },
  ],
  defaultVariants: {
    variant: "contained",
    color: "primary",
    size: "md",
    disabled: false,
  },
});

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ComponentSize | "icon";
  color?: ButtonColor;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "contained",
  size = "md",
  color = "primary",
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        buttonVariants({ variant, color, size, disabled }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
