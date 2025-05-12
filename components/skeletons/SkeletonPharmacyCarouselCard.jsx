import React from "react";
import { View, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const SPACING = 12;
const CARD_WIDTH = width * 0.99 - SPACING * 2;

const SkeletonSpecialOfferCarousel = () => {
  return (
    <View className="mb-6">
      {/* Offer Card Skeleton */}
      <View
        className="p-5 bg-gray-200 rounded-2xl flex-row justify-between items-center animate-pulse"
        style={{ width: CARD_WIDTH, height: 160 }}
      >
        {/* Left Content */}
        <View className="flex-1 pr-3">
          <View className="h-4 w-32 bg-gray-300 rounded mb-2" />
          <View className="h-3 w-24 bg-gray-300 rounded mb-1" />
          <View className="h-4 w-28 bg-gray-300 rounded mb-1" />
          <View className="h-3 w-16 bg-gray-300 rounded mb-2" />
          <View className="h-6 w-20 bg-gray-300 rounded-full" />
        </View>

        {/* Image Skeleton */}
        <View className="w-24 h-24 bg-gray-300 rounded-xl" />
      </View>

      {/* Dot Indicators Skeleton */}
      <View className="flex-row justify-center mt-3">
        {[...Array(3)].map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full mx-1 ${
              i === 0 ? "w-5 bg-gray-400" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default SkeletonSpecialOfferCarousel;
