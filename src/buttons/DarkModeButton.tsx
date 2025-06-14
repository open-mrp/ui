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
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </Button>
    );
  }

  return (
    <Button className={className} variant="outlined" onClick={toggleDarkMode}>
      {isDark ? "Light Mode" : "Dark Mode"}
    </Button>
  );
}
