// hooks/useDevPerfLogger.js
import { useEffect, useRef } from "react";
import { usePathname } from "expo-router";
import { markPerfStart, markPerfEnd } from "@/utils/performanceUtils";

export const useDevPerfLogger = () => {
  const pathname = usePathname();
  const prevPath = useRef(null);

  useEffect(() => {
    if (!pathname) return;    

    // End previous mark
    if (prevPath.current && prevPath.current !== pathname) {
      markPerfEnd(`Screen: ${prevPath.current}`);
    }

    // Start new mark
    markPerfStart(`Screen: ${pathname}`);
    prevPath.current = pathname;
  }, [pathname]);
};
