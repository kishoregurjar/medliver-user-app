// contexts/NavigationHistoryContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";

const NavigationHistoryContext = createContext();

export const useNavigationHistory = () => useContext(NavigationHistoryContext);

const STORAGE_KEY = "app-navigation-history";
const MAX_HISTORY = 5;

export const NavigationHistoryProvider = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [history, setHistory] = useState([]);
  const [actionType, setActionType] = useState("push");

  // Load stored history on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    })();
  }, []);

  // Track pathname changes
  useEffect(() => {
    if (!pathname) return;
    const entry = {
      pathname,
      timestamp: Date.now(),
      actionType,
    };

    setHistory((prev) => {
      const updated = [...prev, entry].slice(-MAX_HISTORY);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [pathname]);

  const getLastVisited = () => {
    if (history.length > 1) return history[history.length - 2];
    return null;
  };

  const goBackWithTracking = () => {
    setActionType("back");
    router.back();
  };

  const pushWithTracking = (path) => {
    setActionType("push");
    router.push(path);
  };

  const replaceWithTracking = (path) => {
    setActionType("replace");
    router.replace(path);
  };

  return (
    <NavigationHistoryContext.Provider
      value={{
        history,
        getLastVisited,
        goBackWithTracking,
        pushWithTracking,
        replaceWithTracking,
      }}
    >
      {children}
    </NavigationHistoryContext.Provider>
  );
};
