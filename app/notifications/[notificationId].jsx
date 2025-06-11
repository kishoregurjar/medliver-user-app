import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import useAxios from "@/hooks/useAxios";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";

export default function NotificationDetailsScreen() {
  const { notificationId } = useLocalSearchParams();

  const { request: getNotificationDetails, loading: isLoading } = useAxios();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      const { data, error } = await getNotificationDetails({
        url: "/user/get-notification-by-id",
        method: "GET",
        params: { notificationId },
      });

      if (!error && data?.data?.[0]) {
        setNotification(data.data[0]);
      }
    };

    if (notificationId) {
      fetchNotificationDetails();
    }
  }, [notificationId]);

  return (
    <AppLayout>
      <HeaderWithBack showBackButton title="Notification" />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#B31F24" />
          <Text className="text-base text-text-muted mt-2">
            Loading notification details...
          </Text>
        </View>
      ) : notification ? (
        <View className="flex-1 px-6 py-4">
          <Text className="text-2xl font-bold text-text-primary mb-2">
            {notification.title}
          </Text>

          <Text className="text-base text-text-muted mb-4">
            {notification.message}
          </Text>

          <View className="flex flex-col gap-1">
            <Text className="text-sm text-text-muted">
              <Text className="font-semibold text-text-primary">
                Recipient Type:
              </Text>{" "}
              {notification.recipientType}
            </Text>

            <Text className="text-sm text-text-muted">
              <Text className="font-semibold text-text-primary">Status:</Text>{" "}
              {notification.status}
            </Text>

            <Text className="text-sm text-text-muted">
              <Text className="font-semibold text-text-primary">
                Notification Type:
              </Text>{" "}
              {notification.notificationType}
            </Text>

            <Text className="text-sm text-text-muted">
              <Text className="font-semibold text-text-primary">Sent At:</Text>{" "}
              {format(new Date(notification.sentAt), "dd MMM yyyy, hh:mm a")}
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-text-muted">
            No notification details found.
          </Text>
        </View>
      )}
    </AppLayout>
  );
}
