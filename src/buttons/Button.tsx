import type { ComponentSize } from "@/types/ComponentSize";
import { cva } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

export type ButtonVariant = "contained" | "outlined" | "text" | "icon";

// Base styles
const BASE_STYLES =
  "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-250 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const colorVariants = {
  primary: {
    contained: "bg-primary-500 text-white hover:bg-primary-600",
    outlined:
      "border-primary-500 text-primary-500 hover:bg-primary-500/5 hover:border-primary-500",
    text: "text-primary-500 hover:bg-primary-500/5",
    icon: "text-primary-500 hover:bg-primary-500/5",
  },
  secondary: {
    contained: "bg-secondary-500 text-white hover:bg-secondary-600",
    outlined:
      "border-secondary-500 text-secondary-500 hover:bg-secondary-500/5 hover:border-secondary-500",
    text: "text-secondary-500 hover:bg-secondary-500/5",
    icon: "text-secondary-500 hover:bg-secondary-500/5",
  },
  blue: {
    contained: "bg-blue-500 text-white hover:bg-blue-600",
    outlined:
      "border-blue-500 text-blue-500 hover:bg-blue-500/5 hover:border-blue-500",
    text: "text-blue-500 hover:bg-blue-500/5",
    icon: "text-blue-500 hover:bg-blue-500/5",
  },
  green: {
    contained: "bg-green-500 text-white hover:bg-green-600",
    outlined:
      "border-green-500 text-green-500 hover:bg-green-500/5 hover:border-green-500",
    text: "text-green-500 hover:bg-green-500/5",
    icon: "text-green-500 hover:bg-green-500/5",
  },
  purple: {
    contained: "bg-purple-500 text-white hover:bg-purple-600",
    outlined:
      "border-purple-500 text-purple-500 hover:bg-purple-500/5 hover:border-purple-500",
    text: "text-purple-500 hover:bg-purple-500/5",
    icon: "text-purple-500 hover:bg-purple-500/5",
  },
  white: {
    contained: "bg-white text-gray-900 hover:bg-gray-100",
    outlined: "border-white text-white hover:bg-white/5 hover:border-white",
    text: "text-white hover:bg-white/5",
    icon: "text-white hover:bg-white/5",
  },
  gray: {
    contained: "bg-gray-500 text-white hover:bg-gray-600",
    outlined:
      "border-gray-500 text-gray-500 hover:bg-gray-500/5 hover:border-gray-500",
    text: "text-gray-500 hover:bg-gray-500/5",
    icon: "text-gray-500 hover:bg-gray-500/5",
  },
} as const;

const buttonVariants = cva(BASE_STYLES, {
  variants: {
    variant: {
      contained: "",
      outlined: "border",
      text: "",
      icon: "p-2",
    },
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
        "bg-white/10 !text-white hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10",
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
  color?: keyof typeof colorVariants;
  disabled?: boolean;
  blur?: boolean;
}

export default function Button({
  children,
  variant = "contained",
  size = "md",
  color = "white",
  disabled = false,
  blur = false,
  className,
  ...props
}: ButtonProps) {
  const baseClasses = buttonVariants({ variant, size, disabled, blur });
  const colorClasses = colorVariants[color][variant];

  return (
    <button
      disabled={disabled}
      className={twMerge(baseClasses, colorClasses, className)}
      {...props}
    >
      {children}
    </button>
  );
}
