// NotificationContext.js
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import useAxios from "@/hooks/useAxios";
import { useAuthUser } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { request } = useAxios();
  const { authUser } = useAuthUser();

  // Remove authUser dependency here, directly access in callback
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await request({
      method: "GET",
      url: "/user/get-all-notification",
      authRequired: !!authUser?.isAuthenticated, // still send token if logged in
    });

    if (error) {
      setError(error.message || "Failed to fetch notifications.");
      setNotifications([]);
    } else {
      const mapped =
        data?.data?.map((n) => ({
          ...n,
          isRead: n.status === "read",
          timestamp: n.sentAt,
          subtitle: n.message,
        })) || [];
      setNotifications(mapped);
    }

    setLoading(false);
  }, [request]); // only request dependency

  const markAsRead = useCallback(
    async (notificationId) => {
      const { error } = await request({
        method: "PUT",
        url: "/user/update-notification-status",
        data: { notificationId },
        authRequired: !!authUser?.isAuthenticated, // still send token if logged in
      });

      if (error) {
        console.error("Error marking notification as read:", error);
        return false;
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true, status: "read" } : n
        )
      );

      return true;
    },
    [request]
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ✅ Only run ONCE on mount
  useEffect(() => {
    fetchNotifications();
  }, []); // no dependency here

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        fetchNotifications,
        markAsRead,
        unreadCount,
        loading,
        error,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
