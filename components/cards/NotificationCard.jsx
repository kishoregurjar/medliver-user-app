// components/notifications/NotificationCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { formatDistanceToNow } from "date-fns";

export default function NotificationCard({ item, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 border-b border-gray-100 flex-row justify-between items-start ${
        !item.isRead ? "bg-gray-50" : ""
      }`}
      activeOpacity={0.6}
      // testID={`notification-card-${item._id}`}
      // accessibilityLabel={`notification-card-${item._id}`}
    >
      <View className="flex-1 pr-2">
        <Text className="font-lexend-semibold text-black">{item.title}</Text>
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
    </TouchableOpacity>
  );
}
