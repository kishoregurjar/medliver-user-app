import React from "react";
import { View } from "react-native";

export default function SkeletonPrescriptionCard() {
  return (
    <View className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 animate-pulse">
      {/* Top Row */}
      <View className="flex-row justify-between items-start">
        <View className="gap-3">
          <View className="w-40 h-4 bg-gray-300 rounded-md" />
          <View className="w-24 h-3 bg-gray-200 rounded-md" />
        </View>
        <View className="w-16 h-6 bg-gray-200 rounded-full" />
      </View>

      {/* Bottom Row */}
      <View className="mt-4 flex-row justify-between items-center">
        <View className="w-32 h-4 bg-gray-200 rounded-md" />
        <View className="w-24 h-4 bg-gray-200 rounded-md" />
      </View>
    </View>
  );
}
