import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform, Alert } from "react-native";
import Constants from "expo-constants";

import useAxios from "@/hooks/useAxios";
import { useAuthUser } from "./AuthContext";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [expoToken, setExpoToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { authUser } = useAuthUser();
  const { request } = useAxios();

  const registerPushTokens = useCallback(async () => {
    if (!Device.isDevice) {
      Alert.alert(
        "Notification",
        "Push notifications require a physical device."
      );
      return;
    }

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Permission not granted for notifications.");
        return;
      }

      const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync(
        {
          projectId: Constants.expoConfig.extra?.eas?.projectId,
        }
      );

      setExpoToken(expoPushToken);
      if (__DEV__) console.log("[DEV] Expo Push Token:", expoPushToken);

      let _fcmToken = null;
      if (Platform.OS === "android") {
        const fcmData = await Notifications.getDevicePushTokenAsync({
          type: "fcm",
        });
        _fcmToken = fcmData?.data || null;
        setFcmToken(_fcmToken);
        if (__DEV__) console.log("[DEV] FCM Token:", _fcmToken);
      }

      if (authUser?.isAuthenticated) {
        await request({
          method: "POST",
          url: "/user/save-device-token",
          data: {
            expoToken: expoPushToken,
            fcmToken: Platform.OS === "android" ? _fcmToken : null,
            platform: Platform.OS,
          },
          authRequired: true,
        });

        if (__DEV__) console.log("[DEV] Device tokens sent to server");
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }
    } catch (err) {
      console.error("❌ Error registering push tokens:", err);
    }
  }, [authUser?.isAuthenticated, request]);

  const fetchNotifications = useCallback(async () => {
    if (loading) return; // prevent overlapping fetch
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await request({
        method: "GET",
        url: "/user/get-all-notification",
        authRequired: !!authUser?.isAuthenticated,
      });

      if (error)
        throw new Error(error.message || "Failed to fetch notifications.");

      const mapped =
        data?.data?.map((n) => ({
          ...n,
          isRead: n.status === "read",
          timestamp: n.sentAt,
          subtitle: n.message,
        })) || [];

      setNotifications(mapped);
    } catch (err) {
      console.error("❌ Fetch notifications failed:", err);
      setError(err.message || "Fetch error");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [request, authUser?.isAuthenticated, loading]);

  const markAsRead = useCallback(
    async (notificationId) => {
      if (!authUser?.isAuthenticated) return false;

      const { error } = await request({
        method: "PUT",
        url: "/user/update-notification-status",
        data: { notificationId },
        authRequired: true,
      });

      if (error) {
        console.error("❌ Mark as read error:", error);
        return false;
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true, status: "read" } : n
        )
      );
      return true;
    },
    [request, authUser?.isAuthenticated]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // Run on mount
  useEffect(() => {
    registerPushTokens();
    fetchNotifications();
  }, []);

  // Re-fetch on login
  useEffect(() => {
    if (authUser?.isAuthenticated) {
      fetchNotifications();
      registerPushTokens();
    }
  }, [authUser?.isAuthenticated]);

  // Foreground notifications
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        if (__DEV__)
          console.log("[DEV] Foreground notification:", notification);
        Alert.alert(
          "🔔 Notification",
          notification?.request?.content?.body || "New message received."
        );
        fetchNotifications();
      }
    );
    return () => subscription.remove();
  }, [fetchNotifications]);

  // Background notification taps
  useEffect(() => {
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (__DEV__) console.log("[DEV] Notification tapped:", response);
        fetchNotifications();
      });
    return () => responseSubscription.remove();
  }, [fetchNotifications]);

  const contextValue = useMemo(() => {
    return {
      notifications,
      fetchNotifications,
      markAsRead,
      unreadCount,
      loading,
      error,
      expoToken,
      fcmToken,
    };
  }, [
    notifications,
    fetchNotifications,
    markAsRead,
    unreadCount,
    loading,
    error,
    expoToken,
    fcmToken,
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
