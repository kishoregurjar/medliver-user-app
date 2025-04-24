import ROUTE_PATH from "./route.constants";

/**
 * Generate a route with support for path params and query params.
 * @param {'AUTH'|'APP'} group - Route group
 * @param {string} key - Key inside the group enum
 * @param {{
 *   params?: Record<string, string | number>,
 *   query?: Record<string, string | number | boolean | undefined>
 * }} [options]
 * @returns {string} - The final generated route
 */
export function generateRoute(group, key, options = {}) {
  const basePath = ROUTE_PATH?.[group]?.[key];

  if (!basePath) {
    console.warn(`Route not found for group "${group}" and key "${key}"`);
    return "/";
  }

  let path = basePath;

  // Add path params as segments
  if (options.params) {
    const paramValues = Object.values(options.params).map((val) =>
      encodeURIComponent(String(val))
    );
    if (paramValues.length) {
      path += `/${paramValues.join("/")}`;
    }
  }

  // Add query string if any
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
