import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
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

  const handleNotificationPress = (notification) => {
    console.log("Notification pressed:", notification);

    // Dynamic navigation based on notificationType
    switch (notification.notificationType) {
      case "pharmacy_order":
        router.push({
          pathname: ROUTE_PATH.APP.ORDERS.ORDER_DETAILS,
          params: { orderId: notification._id },
        });
        break;

      case "pathology_order":
        router.push({
          pathname: ROUTE_PATH.APP.PATHOLOGY.ORDER_DETAILS,
          params: { orderId: notification._id },
        });
        break;

      case "prescription":
        router.push({
          pathname: ROUTE_PATH.APP.PRESCRIPTIONS.PRESCRIPTION_DETAILS,
          params: { prescriptionId: notification._id },
        });
        break;

      case "global_notification":
        // Maybe go to a generic notifications details screen
        router.push({
          pathname: ROUTE_PATH.APP.NOTIFICATIONS.NOTIFICATION_DETAILS,
          params: { notificationId: notification._id },
        });
        break;

      default:
        // fallback for unknown types
        router.push({
          pathname: ROUTE_PATH.APP.NOTIFICATIONS.NOTIFICATION_DETAILS,
          params: { notificationId: notification._id },
        });
    }

    // Show the alert
    Alert.alert(
      `Notification - ${notification.title}`,
      `${notification.message}`,
      [
        {
          text: "OK",
          onPress: () => {
            console.log("OK Pressed");
          },
        },
      ]
    );
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

      {loading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <SkeletonNotificationCard key={index} />
        ))
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
