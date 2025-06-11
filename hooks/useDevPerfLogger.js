// hooks/useDevPerfLogger.js
import { useEffect, useRef } from "react";
import { markPerfStart, markPerfEnd } from "@/utils/performanceUtils";

export const useDevPerfLogger = (navigationRef) => {
  const previousRouteName = useRef(null);

  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener("state", () => {
      const currentRoute = navigationRef.current?.getCurrentRoute();

      if (currentRoute?.name && currentRoute.name !== previousRouteName.current) {
        const label = `Screen: ${currentRoute.name}`;

        // End timing for previous screen
        if (previousRouteName.current) {
          markPerfEnd(`Screen: ${previousRouteName.current}`);
        }

        // Start timing for new screen
        markPerfStart(label);
        previousRouteName.current = currentRoute.name;
      }
    });

    return unsubscribe;
  }, [navigationRef]);
};
