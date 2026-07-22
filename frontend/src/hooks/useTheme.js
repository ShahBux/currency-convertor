import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "flowconvert-theme";

function getSavedTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(getSavedTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  return { theme, toggleTheme };
}
