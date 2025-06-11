import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useRouter } from "expo-router";
import { useNotification } from "@/contexts/NotificationContext";
import NotificationCard from "@/components/cards/NotificationCard";
import SkeletonNotificationCard from "@/components/skeletons/SkeletonNotificationCard";
import ROUTE_PATH from "@/routes/route.constants";

const tabs = ["All", "Unread", "Read"];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState("Unread");
  const router = useRouter();

  const {
    notifications,
    fetchNotifications,
    markAsRead,
    loading,
    error,
    expoToken,
    fcmToken,
  } = useNotification();

  console.log("NotificationsScreen - expoToken:", expoToken);
  console.log("NotificationsScreen - fcmToken:", fcmToken);
  

  const onRefresh = async () => {
    await fetchNotifications();
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
    // if (!notification.isRead) {
    //   const success = await markAsRead(notification._id);
    //   if (!success) return; // Optionally show error feedback
    // }
    router.push(
      `${ROUTE_PATH.APP.NOTIFICATIONS.NOTIFICATION_DETAILS}?notificationId=${notification._id}`
    );
  };

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <SkeletonNotificationCard key={index} />
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

      {/* Content */}
      {loading ? (
        renderSkeletons()
      ) : error ? (
        <Text className="text-center text-red-500 font-lexend mt-10">
          {error}
        </Text>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item._id?.toString()}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <NotificationCard
              item={item}
              onPress={() => handleNotificationPress(item)}
            />
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
