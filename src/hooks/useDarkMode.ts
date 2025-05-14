import { useEffect, useState } from "react";

const DARK_MODE_KEY = "dark";
const LIGHT_MODE_KEY = "light";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled in localStorage or system preference
    const isDarkMode =
      localStorage.getItem("theme") === DARK_MODE_KEY ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add(DARK_MODE_KEY);
    } else {
      document.documentElement.classList.remove(DARK_MODE_KEY);
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add(DARK_MODE_KEY);
      localStorage.setItem("theme", DARK_MODE_KEY);
    } else {
      document.documentElement.classList.remove(DARK_MODE_KEY);
      localStorage.setItem("theme", LIGHT_MODE_KEY);
    }
  };

  return { isDark, toggleDarkMode };
}
