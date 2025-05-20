import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import { formatDistanceToNow } from "date-fns";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuthUser } from "@/contexts/AuthContext";
import useAxios from "@/hooks/useAxios";

const tabs = ["All", "Unread", "Read"];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState("Unread");
  const [notifications, setNotifications] = useState([]);

  const router = useRouter();
  const { authUser } = useAuthUser();
  const { request: getNotifications, loading: loadingNotifications } =
    useAxios();

  const fetchNotifications = async () => {
    const { data, error } = await getNotifications({
      method: "GET",
      url: `/user/get-notification-by-recipientId`,
      authRequired: true,
    });

    console.log(data);

    if (data.data) {
      setNotifications(data.data);
    } else {
      setNotifications([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

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

  return (
    <AppLayout scroll={false}>
      {/* Header */}
      <HeaderWithBack
        showBackButton
        title="Notifications"
        clearStack
        backTo="/home"
      />

      {/* Tabs with badges */}
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

      {/* Loading Spinner */}
      {loadingNotifications ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#5C59FF" />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
          renderItem={({ item }) => (
            <View
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
            </View>
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
