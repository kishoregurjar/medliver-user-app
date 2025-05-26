import React from "react";
import { View } from "react-native";

export default function SkeletonNotificationCard() {
  return (
    <View className="p-4 border-b border-gray-100 flex-row justify-between items-start animate-pulse">
      <View className="flex-1 pr-2">
        <View className="w-3/4 h-4 bg-gray-200 rounded mb-2" />
        <View className="w-full h-3 bg-gray-200 rounded mb-1.5" />
        <View className="w-1/2 h-3 bg-gray-200 rounded" />
      </View>
      <View className="w-2 h-2 rounded-full bg-gray-300 mt-1" />
    </View>
  );
}
