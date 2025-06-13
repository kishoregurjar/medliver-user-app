import React, { useCallback, useMemo, useState } from "react";
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
import LoadingDots from "@/components/common/LoadingDots";

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

  if (__DEV__) console.log("NotificationsScreen - expoToken:", expoToken);
  if (__DEV__) console.log("NotificationsScreen - fcmToken:", fcmToken);

  const onRefresh = async () => {
    await fetchNotifications();
  };

  const counts = useMemo(
    () => ({
      All: notifications.length,
      Unread: notifications.filter((n) => !n.isRead).length,
      Read: notifications.filter((n) => n.isRead).length,
    }),
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === "Unread") return notifications.filter((n) => !n.isRead);
    if (activeTab === "Read") return notifications.filter((n) => n.isRead);
    return notifications;
  }, [notifications, activeTab]);

  const handleNotificationPress = useCallback(
    (notification) => {
      if (__DEV__) console.log("Notification pressed:", notification);

      // Dynamic navigation
      const navigate = (pathname, params) => router.push({ pathname, params });

      switch (notification.notificationType) {
        case "pharmacy_order":
          navigate(ROUTE_PATH.APP.ORDERS.ORDER_DETAILS, {
            orderId: notification._id,
          });
          break;
        case "pathology_order":
          navigate(ROUTE_PATH.APP.PATHOLOGY.ORDER_DETAILS, {
            orderId: notification._id,
          });
          break;
        case "prescription":
          navigate(ROUTE_PATH.APP.PRESCRIPTIONS.PRESCRIPTION_DETAILS, {
            prescriptionId: notification._id,
          });
          break;
        default:
          navigate(ROUTE_PATH.APP.NOTIFICATIONS.NOTIFICATION_DETAILS, {
            notificationId: notification._id,
          });
      }

      Alert.alert(
        `Notification - ${notification.title}`,
        notification.message,
        [{ text: "OK", onPress: () => {} }]
      );
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <NotificationCard
        item={item}
        onPress={() => handleNotificationPress(item)}
      />
    ),
    [handleNotificationPress]
  );

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
        <View className="flex-1 justify-center items-center mt-10">
          <LoadingDots
            title={"Loading notifications..."}
            subtitle={"Please wait..."}
          />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item._id?.toString()}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          renderItem={renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
          contentContainerClassName="bg-white p-4 rounded-xl gap-4"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-center text-text-muted font-lexend my-10">
              No {activeTab.toLowerCase()} notifications.
            </Text>
          }
        />
      )}
    </AppLayout>
  );
}
