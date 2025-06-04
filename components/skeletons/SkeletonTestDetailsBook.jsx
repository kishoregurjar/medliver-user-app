import { View } from "react-native";
import React from "react";

export default function SkeletonTestDetailsBook() {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 flex gap-3">
      <View className="h-6 w-3/5 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
      <View className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
      <View className="h-4 w-[95%] bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
      <View className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />

      <View className="flex gap-3 pt-2">
        <View className="h-4.5 w-2/5 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
        <View className="h-3.5 w-3/5 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
        <View className="h-3.5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
        <View className="h-3.5 w-[70%] bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
        <View className="h-3.5 w-2/5 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
        <View className="h-3.5 w-[80%] bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
      </View>
    </View>
  );
}
