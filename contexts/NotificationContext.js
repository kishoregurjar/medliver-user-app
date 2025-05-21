import { createContext, useContext, useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { request } = useAxios();

  const fetchNotifications = async () => {
    setLoading(true);
    const { data } = await request({
      method: "GET",
      url: "/user/get-notification-by-recipientId",
      authRequired: true,
    });

    const mapped =
      data?.data?.map((n) => ({
        ...n,
        isRead: n.status === "read",
        timestamp: n.sentAt,
      })) || [];

    setNotifications(mapped);
    setLoading(false);
  };

  const markAsRead = async (notificationId) => {
    await request({
      method: "PUT",
      url: "/user/update-notification-status",
      data: { notificationId },
      authRequired: true,
    });

    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        fetchNotifications,
        unreadCount,
        loading,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
