import { useEffect, useRef } from "react";
import { usePathname } from "expo-router";

export const useDevPerfLogger = () => {
  const pathname = usePathname();
  const prevPath = useRef(null);

  useEffect(() => {
    if (!__DEV__) return;

    const { markPerfStart, markPerfEnd } = require("@/utils/performanceUtils");

    if (!pathname) return;

    if (prevPath.current && prevPath.current !== pathname) {
      markPerfEnd(`Screen: ${prevPath.current}`);
    }

    markPerfStart(`Screen: ${pathname}`);
    prevPath.current = pathname;
  }, [pathname]);
};
