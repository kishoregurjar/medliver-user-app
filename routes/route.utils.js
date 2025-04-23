import ROUTE_PATH from "./route.constants";

/**
 * Generate a route with support for dynamic params and query params
 * @param {'AUTH'|'APP'} group - Route group
 * @param {string} key - Key inside the group enum
 * @param {{ params?: Record<string, string|number>, query?: Record<string, string|number|boolean|undefined> }} [options]
 * @returns {string} - The final generated route
 */
export function generateRoute(group, key, options = {}) {
  let path = ROUTE_PATH[group][key];

  // Replace dynamic params like [id]
  if (options.params) {
    for (const [paramKey, value] of Object.entries(options.params)) {
      path = path.replace(`[${paramKey}]`, encodeURIComponent(String(value)));
    }
  }

  // Append query params if any
  if (options.query) {
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
