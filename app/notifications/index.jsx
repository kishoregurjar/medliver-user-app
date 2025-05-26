import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuthUser } from "@/contexts/AuthContext";
import useAxios from "@/hooks/useAxios";
import { formatDistanceToNow } from "date-fns";
import { Divider } from "@/components/ui/divider";

const tabs = ["All", "Unread", "Read"];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState("Unread");
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const { authUser } = useAuthUser();
  const { request: getNotifications, loading: loadingNotifications } =
    useAxios();
  const { request: updateNotificationStatus } = useAxios();

  const fetchNotifications = async () => {
    const { data, error } = await getNotifications({
      method: "GET",
      url: `/user/get-notification-by-recipientId`,
      authRequired: true,
    });

    if (data?.data) {
      const mappedNotifications = data.data.map((n) => ({
        ...n,
        isRead: n.status === "read",
        timestamp: n.sentAt,
        subtitle: n.message,
      }));
      setNotifications(mappedNotifications);
    } else {
      setNotifications([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (authUser && authUser.isAuthenticated) {
        fetchNotifications();
      }
    }, [authUser])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const counts = {
    All: notifications.length,
    Unread: notifications.filter((n) => !n.isRead).length,
    Read: notifications.filter((n) => n.isRead).length,
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "Unread") return !n.isRead;
    if (activeTab === "Read") return n.isRead;
    return true;
  });

  const handleNotificationPress = async (notification) => {
    if (!authUser || !authUser.isAuthenticated) return;

    if (!notification.isRead) {
      const { error } = await updateNotificationStatus({
        method: "PUT",
        url: `/user/update-notification-status`,
        data: { notificationId: notification._id },
        authRequired: true,
      });

      if (error) {
        console.error("Error updating notification status:", error);
        return;
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id
            ? { ...n, isRead: true, status: "read" }
            : n
        )
      );
    }

    router.push(`/notification-details/${notification._id}`);
  };

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <View
        key={index}
        className="p-4 border-b border-gray-100 flex-row justify-between items-start animate-pulse"
      >
        <View className="flex-1 pr-2">
          <View className="w-3/4 h-4 bg-gray-200 rounded mb-2" />
          <View className="w-full h-3 bg-gray-200 rounded mb-1.5" />
          <View className="w-1/2 h-3 bg-gray-200 rounded" />
        </View>
        <View className="w-2 h-2 rounded-full bg-gray-300 mt-1" />
      </View>
    ));
  };

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack
        showBackButton
        title="Notifications"
        clearStack
        backTo="/home"
      />

      {/* Tabs */}
      <View className="flex-row bg-white justify-around py-2 mb-2 rounded-xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`pb-2 px-2 flex-row items-center gap-x-1 ${
                isActive ? "border-b-2 border-accent-indigo" : ""
              }`}
            >
              <Text
                className={`text-sm font-lexend-medium ${
                  isActive ? "text-accent-indigo" : "text-gray-500"
                }`}
              >
                {tab}
              </Text>
              {counts[tab] > 0 && (
                <View className="bg-indigo-100 px-1.5 py-0.5 rounded-full">
                  <Text className="text-xs text-accent-indigo font-lexend-semibold">
                    {counts[tab]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {loadingNotifications ? (
        renderSkeletons()
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleNotificationPress(item)}
              className={`p-4 border-b border-gray-100 flex-row justify-between items-start ${
                !item.isRead ? "bg-gray-50" : ""
              }`}
            >
              <View className="flex-1 pr-2">
                <Text className="font-lexend-semibold text-black">
                  {item.title}
                </Text>
                <Text className="text-sm font-lexend text-gray-600 mt-1">
                  {item.subtitle}
                </Text>
                <Text className="text-xs font-lexend text-text-muted mt-1">
                  {formatDistanceToNow(new Date(item.timestamp), {
                    addSuffix: true,
                  })}
                </Text>
              </View>
              {!item.isRead && (
                <View className="w-2 h-2 rounded-full bg-brand-primary mt-1" />
              )}
              {/* Diivider line */}
              <View className="w-1 h-full bg-gray-200 ml-2" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-center text-text-muted font-lexend mt-10">
              No {activeTab.toLowerCase()} notifications.
            </Text>
          }
        />
      )}
    </AppLayout>
  );
}
