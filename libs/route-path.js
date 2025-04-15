export const ROUTE_PATH = {
  AUTH: {
    LOGIN: "/",
    LOGOUT: "/logout",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
    PROFILE: "/profile",
    PROFILE_PREVIEW: "/profile-preview",
    VERIFY: "/verify/:verifyToken",
    RESET_PASSWORD: "/reset-password/:resetToken",
  },
  DASHBOARD: {
    DASHBOARD: "/dashboard",
    MANAGERS: "/dashboard/managers",
    SUPPLIERS: "/dashboard/suppliers",
    CUSTOMERS: "/dashboard/customers",
    INVENTORY: "/dashboard/inventory",
    PURCHASING: "/dashboard/purchasing",
    SALES: "/dashboard/sales",
    FINANCIALS: "/dashboard/financials",
    REPORTS_AND_ANALYTICS: "/dashboard/reports-and-analytics",
    REPORTS: "/dashboard/reports",
    ANALYTICS: "/dashboard/analytics",
    SETTINGS: "/dashboard/settings",
    SETTINGS_MANAGE_CATEGORIES: "/dashboard/settings/manage-categories",
    SETTINGS_MANAGE_PRODUCTS: "/dashboard/settings/manage-products",
  },
};

export default ROUTE_PATH;
