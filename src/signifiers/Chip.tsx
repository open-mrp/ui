import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import React from "react";

const chipVariants = cva(
  "inline-flex items-center font-semibold bg-primary-500 text-primary-50 rounded-full",
  {
    variants: {
      size: {
        sm: "px-1 py-0.25 text-xs",
        md: "px-2 py-0.5 text-sm",
        lg: "px-3 py-1 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface ChipProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Chip({ children, className, size }: ChipProps) {
  return (
    <span className={cn(chipVariants({ size }), className)}>{children}</span>
  );
}
