import ROUTE_PATH from "@/libs/route-path";
import { ListOrdered, Package } from "lucide-react";
import {
  FiHome,
  FiBox,
  FiUsers,
  FiShoppingCart,
  FiFileText,
  FiDollarSign,
  FiBarChart2,
  FiTrendingUp,
  FiSettings,
  FiUser,
} from "react-icons/fi";

export const ALL_PERMISSIONS = [
  "supply_management",
  "customer_management",
  "inventory_control",
  "purchasing",
  "sales_and_order_processing",
  "financial_management",
  "role_creation_permission",
  "reporting_and_analytics",
];

export const dashboardMenuItems = [
  {
    title: "Managers",
    description: "Create and manage store manager accounts.",
    route: ROUTE_PATH.DASHBOARD.MANAGERS,
    icon: <FiUser />,
  },
  {
    title: "Suppliers",
    description: "Create and manage supplier contacts.",
    route: ROUTE_PATH.DASHBOARD.SUPPLIERS,
    icon: <FiBox />,
  },
  {
    title: "Customers",
    description: "Create and manage customer profiles and details.",
    route: ROUTE_PATH.DASHBOARD.CUSTOMERS,
    icon: <FiUsers />,
  },
  {
    title: "Inventory",
    description: "Monitor product quantities and stock levels.",
    route: ROUTE_PATH.DASHBOARD.INVENTORY,
    icon: <FiShoppingCart />,
  },
  {
    title: "Purchasing",
    description: "Handle purchase orders, suppliers, and restocks.",
    route: ROUTE_PATH.DASHBOARD.PURCHASING,
    icon: <FiFileText />,
  },
  {
    title: "Sales",
    description: "Track sales orders and manage transactions.",
    route: ROUTE_PATH.DASHBOARD.SALES,
    icon: <FiDollarSign />,
  },
  {
    title: "Reports & Analytics",
    description: "View insights, analytics, and performance charts.",
    route: ROUTE_PATH.DASHBOARD.REPORTS_AND_ANALYTICS,
    icon: <FiTrendingUp />,
  },
  {
    title: "Settings",
    description: "Customize platform settings and configurations.",
    route: ROUTE_PATH.DASHBOARD.SETTINGS,
    icon: <FiSettings />,
  },
];

export const settingsMenuItems = [
  {
    title: "Manage Categories",
    description: "Create, update, and organize product categories.",
    route: ROUTE_PATH.DASHBOARD.SETTINGS_MANAGE_CATEGORIES,
    icon: <ListOrdered />,
  },
  {
    title: "Manage Products",
    description: "Add, edit, and manage your product inventory.",
    route: ROUTE_PATH.DASHBOARD.SETTINGS_MANAGE_PRODUCTS,
    icon: <Package />,
  },
];
