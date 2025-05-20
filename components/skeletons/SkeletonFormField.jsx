import React from "react";
import { View } from "react-native";

export default function SkeletonFormField() {
  return (
    <View className="my-2 animate-pulse">
      <View className="h-4 bg-gray-300 rounded w-32 mb-2" />
      <View className="h-12 bg-gray-200 rounded" />
    </View>
  );
}
