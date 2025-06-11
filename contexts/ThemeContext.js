// contexts/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();
const THEME_STORAGE_KEY = "theme";

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // 'light' | 'dark'
  const [darkMode, setDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Load saved theme or fallback to system
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === "light" || storedTheme === "dark") {
          setDarkMode(storedTheme === "dark");
        } else {
          setDarkMode(systemColorScheme === "dark");
        }
      } catch (e) {
        console.error("Failed to load theme from AsyncStorage", e);
        setDarkMode(systemColorScheme === "dark");
      } finally {
        setThemeLoaded(true);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  // Save preference whenever darkMode changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem(
          THEME_STORAGE_KEY,
          darkMode ? "dark" : "light"
        );
      } catch (e) {
        console.error("Failed to save theme to AsyncStorage", e);
      }
    };

    if (themeLoaded) saveTheme();
  }, [darkMode, themeLoaded]);

  // Dev logging
  useEffect(() => {
    if (__DEV__) {
      console.log("[DEV] Theme mode:", darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  if (!themeLoaded) return null; // prevent incorrect theme flash

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
