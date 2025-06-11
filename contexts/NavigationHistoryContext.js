// contexts/NavigationHistoryContext.js
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import { helpers } from "@/utils/helpers";

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

    if (__DEV__) {
      console.log("[DEV] Current App Navigation Pathname:", pathname);
      (async () => {
        console.log(
          "[DEV] App Async Storage:",
          await helpers.logAsyncStorage()
        );
      })();
    }

    if (history[history.length - 1]?.pathname === pathname) return;

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
  }, [pathname, actionType, history]);

  const getLastVisited = useCallback(() => {
    if (history.length > 1) return history[history.length - 2];
    return null;
  }, [history]);

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

  const clearHistory = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  const currentRoute = history[history.length - 1]?.pathname || pathname;

  const value = useMemo(
    () => ({
      history,
      getLastVisited,
      goBackWithTracking,
      pushWithTracking,
      replaceWithTracking,
      clearHistory,
      currentRoute,
    }),
    [
      history,
      getLastVisited,
      goBackWithTracking,
      pushWithTracking,
      replaceWithTracking,
      clearHistory,
      currentRoute,
    ]
  );

  return (
    <NavigationHistoryContext.Provider value={value}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};
