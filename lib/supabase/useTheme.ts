"use client";
import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuto, setIsAuto] = useState(true);
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    const hour = new Date().getHours();
    const isNightTime = hour >= 19 || hour < 6;
    const prefersDarkSystem = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const autoShouldBeDark = isNightTime || prefersDarkSystem;

    let finalThemeIsDark: boolean;
    if (savedTheme) {
      setIsAuto(false);
      finalThemeIsDark = savedTheme === "dark";
    } else {
      setIsAuto(true);
      finalThemeIsDark = autoShouldBeDark;
    }

    if (finalThemeIsDark) {
      root.classList.add("dark");
      setIsDarkMode(true);
    } else {
      root.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    applyTheme();
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [applyTheme]);

  const toggleTheme = () => {
    const newThemeIsDark = !isDarkMode;
    setIsDarkMode(newThemeIsDark);
    setIsAuto(false);
    document.documentElement.classList.toggle("dark", newThemeIsDark);
    localStorage.setItem("theme", newThemeIsDark ? "dark" : "light");
  };

  const resetToAuto = () => {
    localStorage.removeItem("theme");
    applyTheme();
  };

  return { isDarkMode, isAuto, mounted, toggleTheme, resetToAuto };
}