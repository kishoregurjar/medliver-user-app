import React from "react";
import { View, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32; // Account for horizontal padding

export default function SkeletonPharmacyProductDetails() {
  return (
    <View className="animate-pulse flex-1">
      {/* Image Carousel Skeleton */}
      <View
        className="w-full h-60 bg-gray-200 rounded-2xl mb-4"
        style={{ width: CARD_WIDTH }}
      />

      {/* Dot Indicators */}
      <View className="flex-row justify-center mb-6">
        {[...Array(3)].map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full mx-1 ${
              i === 0 ? "w-5 bg-gray-400" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </View>

      {/* Product Title */}
      <View className="h-5 w-3/4 bg-gray-300 rounded mb-2" />
      <View className="h-4 w-1/2 bg-gray-300 rounded mb-1" />
      <View className="h-4 w-1/3 bg-gray-300 rounded mb-5" />

      {/* Price Info */}
      <View className="h-6 w-1/4 bg-gray-300 rounded mb-2" />
      <View className="h-4 w-2/3 bg-gray-300 rounded mb-5" />

      {/* Tab Buttons */}
      <View className="flex-row gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <View key={i} className="h-6 w-20 bg-gray-300 rounded-md" />
        ))}
      </View>

      {/* Product Description */}
      <View className="h-20 w-full bg-gray-300 rounded-md mb-6" />

      {/* Additional Info */}
      <View className="h-5 w-36 bg-gray-300 rounded-md mb-2" />
      <View className="h-4 w-3/4 bg-gray-300 rounded-md mb-8" />

      {/* Similar Products */}
      <View className="flex-row">
        {[...Array(3)].map((_, i) => (
          <View key={i} className="w-36 h-52 bg-gray-200 rounded-xl mr-3" />
        ))}
      </View>
    </View>
  );
}
