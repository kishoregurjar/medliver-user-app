import React from "react";
import { View } from "react-native";

export default function SkeletonAddressCard() {
  return (
    <View className="bg-white rounded-3xl p-5 border border-background-soft my-2 animate-pulse">
      <View className="h-4 w-24 bg-gray-200 rounded mb-3" />
      <View className="h-3 w-3/4 bg-gray-200 rounded mb-2" />
      <View className="h-3 w-2/3 bg-gray-200 rounded mb-2" />
      <View className="h-3 w-1/2 bg-gray-200 rounded" />
      <View className="flex-row justify-end gap-2 mt-4">
        <View className="h-6 w-14 bg-gray-200 rounded-xl" />
        <View className="h-6 w-20 bg-gray-200 rounded-xl" />
        <View className="h-6 w-6 bg-gray-200 rounded-full" />
      </View>
    </View>
  );
}
