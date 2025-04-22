import ROUTE_PATH from "./route.constants";
import { RouteGroup, RouteKey } from "./route.types";

/**
 * Generate a type-safe route for Expo Router
 * @param group 'AUTH' | 'APP'
 * @param key route key from group
 * @param options optional route params and query params
 * @returns string path e.g., `/profile/123?ref=home`
 */
export function generateRoute<T extends RouteGroup, K extends RouteKey<T>>(
  group: T,
  key: K,
  options?: {
    params?: Record<string, string | number>;
    query?: Record<string, string | number | boolean | undefined>;
  }
): string {
  let path = ROUTE_PATH[group][key];

  // Replace [param] placeholders
  if (options?.params) {
    for (const [paramKey, value] of Object.entries(options.params)) {
      path = path.replace(`[${paramKey}]`, encodeURIComponent(String(value)));
    }
  }

  // Add query parameters
  if (options?.query) {
    const searchParams = new URLSearchParams();
    for (const [queryKey, value] of Object.entries(options.query)) {
      if (value !== undefined) {
        searchParams.append(queryKey, String(value));
      }
    }

    const queryString = searchParams.toString();
    if (queryString) path += `?${queryString}`;
  }

  return path;
}
