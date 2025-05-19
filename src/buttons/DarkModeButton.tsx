"use client";

import { useDarkMode } from "@/hooks/useDarkMode";
import MoonIcon from "@/icons/MoonIcon";
import SunIcon from "@/icons/SunIcon";
import Button from "./Button";

export interface DarkModeButtonProps {
  variant?: "icon" | "outlined";
  className?: string;
}

export default function DarkModeButton({
  variant = "icon",
  className,
}: DarkModeButtonProps) {
  const { isDark, toggleDarkMode } = useDarkMode();

  if (variant === "icon") {
    return (
      <Button
        className={className}
        variant="icon"
        color="gray"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </Button>
    );
  }

  return (
    <Button
      className={className}
      variant="outlined"
      color="gray"
      onClick={toggleDarkMode}
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </Button>
  );
}
