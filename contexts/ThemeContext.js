// contexts/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setDarkMode(storedTheme === "dark");
      } else {
        // Fallback to system preference
        setDarkMode(systemColorScheme === "dark");
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  useEffect(() => {
    const saveTheme = async () => {
      await AsyncStorage.setItem("theme", darkMode ? "dark" : "light");
    };
    saveTheme();
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
