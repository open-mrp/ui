import type { ComponentSize } from "@/types/ComponentSize";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import React from "react";

export type ButtonColor = "primary" | "secondary" | "gray" | string;
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

const getCustomColorClasses = (
  color: string,
  variant: ButtonVariant,
  blur: boolean
) => {
  const colorMap = {
    blue: {
      contained: blur
        ? "bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 dark:bg-blue-600/5 dark:hover:bg-blue-600/10"
        : "bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700",
      outlined: blur
        ? "border-blue-600/20 text-blue-600 hover:bg-blue-600/10 hover:border-blue-600/30 dark:hover:bg-blue-600/5"
        : "border-blue-600 text-blue-600 hover:bg-blue-600/5 hover:border-blue-600",
      text: blur
        ? "text-blue-600 hover:bg-blue-600/10 dark:hover:bg-blue-600/5"
        : "text-blue-600 hover:bg-blue-600/5",
      icon: blur
        ? "text-blue-600 hover:bg-blue-600/10 dark:hover:bg-blue-600/5"
        : "text-blue-600 hover:bg-blue-600/5",
    },
    green: {
      contained: blur
        ? "bg-green-600/10 text-green-600 hover:bg-green-600/20 dark:bg-green-600/5 dark:hover:bg-green-600/10"
        : "bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700",
      outlined: blur
        ? "border-green-600/20 text-green-600 hover:bg-green-600/10 hover:border-green-600/30 dark:hover:bg-green-600/5"
        : "border-green-600 text-green-600 hover:bg-green-600/5 hover:border-green-600",
      text: blur
        ? "text-green-600 hover:bg-green-600/10 dark:hover:bg-green-600/5"
        : "text-green-600 hover:bg-green-600/5",
      icon: blur
        ? "text-green-600 hover:bg-green-600/10 dark:hover:bg-green-600/5"
        : "text-green-600 hover:bg-green-600/5",
    },
    purple: {
      contained: blur
        ? "bg-purple-600/10 text-purple-600 hover:bg-purple-600/20 dark:bg-purple-600/5 dark:hover:bg-purple-600/10"
        : "bg-purple-600 text-white hover:bg-purple-700 dark:hover:bg-purple-700",
      outlined: blur
        ? "border-purple-600/20 text-purple-600 hover:bg-purple-600/10 hover:border-purple-600/30 dark:hover:bg-purple-600/5"
        : "border-purple-600 text-purple-600 hover:bg-purple-600/5 hover:border-purple-600",
      text: blur
        ? "text-purple-600 hover:bg-purple-600/10 dark:hover:bg-purple-600/5"
        : "text-purple-600 hover:bg-purple-600/5",
      icon: blur
        ? "text-purple-600 hover:bg-purple-600/10 dark:hover:bg-purple-600/5"
        : "text-purple-600 hover:bg-purple-600/5",
    },
  };

  return colorMap[color as keyof typeof colorMap]?.[variant] || "";
};

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ComponentSize;
  color?: ButtonColor;
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
  const customColorClass = !["primary", "secondary", "gray"].includes(color)
    ? getCustomColorClasses(color, variant, blur)
    : "";

  return (
    <button
      disabled={disabled}
      className={cn(
        buttonVariants({ variant, color, size, disabled, blur }),
        customColorClass,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
