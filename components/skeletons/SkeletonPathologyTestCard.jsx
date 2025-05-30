import React from "react";
import { View } from "react-native";

const SkeletonPathologyTestCard = () => {
  return (
    <View className="w-48 bg-white rounded-2xl p-3 mr-4 border border-background-soft animate-pulse">
      {/* Image Placeholder */}
      <View className="w-full h-24 mb-2 bg-gray-200 rounded-xl" />

      {/* Test Name Placeholder */}
      <View className="h-4 bg-gray-200 rounded w-3/4 mb-1" />

      {/* Sample Required Placeholder */}
      <View className="h-3 bg-gray-200 rounded w-1/2 mb-1" />

      {/* Delivery Time Placeholder */}
      <View className="h-3 bg-gray-200 rounded w-1/3 mb-2" />

      {/* Pricing Placeholder */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="h-3 bg-gray-200 rounded w-1/4" />
        <View className="flex-row items-center space-x-1">
          <View className="h-4 bg-gray-200 rounded w-6" />
          <View className="h-3 bg-gray-200 rounded w-8" />
        </View>
      </View>

      {/* Book Now Button Placeholder */}
      <View className="h-8 bg-gray-200 rounded-lg w-full" />
    </View>
  );
};

export default SkeletonPathologyTestCard;
