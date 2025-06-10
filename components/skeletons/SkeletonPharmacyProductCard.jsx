import React from "react";
import { View } from "react-native";

const SkeletonPharmacyProductCard = ({
  type = "default",
  fullWidth = false,
}) => {
  if (fullWidth) {
    return (
      <View className="flex-row bg-white rounded-2xl p-4 mb-4 w-full gap-4">
        {/* Image section (1/4 width) */}
        <View className="w-1/4">
          <View className="w-full aspect-square bg-gray-200 rounded-xl" />
        </View>

        {/* Details section (3/4 width) */}
        <View className="flex-1 justify-between">
          {/* Title */}
          <View className="w-3/4 h-4 bg-gray-200 rounded mb-2" />

          {/* Price */}
          <View className="w-1/3 h-4 bg-gray-200 rounded mb-2" />

          {/* MRP + Discount */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="w-1/3 h-3 bg-gray-200 rounded" />
            <View className="w-1/4 h-3 bg-gray-200 rounded" />
          </View>

          {/* Manufacturer */}
          <View className="w-2/3 h-3 bg-gray-200 rounded mb-3" />

          {/* Add to Cart Button */}
          <View className="w-full h-10 bg-gray-300 rounded-lg" />
        </View>
      </View>
    );
  }

  const baseClasses =
    type === "small"
      ? "w-48 p-3 mr-4 bg-white rounded-2xl"
      : "w-52 p-3 mr-4 bg-white rounded-2xl";

  return (
    <View className={`${baseClasses} animate-pulse`}>
      {/* Image */}
      <View className="w-full h-24 mb-3 bg-gray-200 rounded-xl" />

      {/* Rating / Badge */}
      {type !== "small" && (
        <View className="w-14 h-4 rounded-full bg-gray-200 mb-1" />
      )}

      {/* Title */}
      <View className="w-4/5 h-4 bg-gray-200 rounded mb-1" />

      {/* Price */}
      <View className="w-2/5 h-3 bg-gray-200 rounded mb-1" />

      {/* MRP + Discount */}
      {type !== "small" && (
        <>
          <View className="w-1/3 h-2 bg-gray-200 rounded mb-1" />
          <View className="w-2/5 h-2 bg-gray-200 rounded mb-1" />
        </>
      )}

      {/* Manufacturer or Subtitle */}
      <View className="w-3/5 h-2 bg-gray-200 rounded mb-3" />

      {/* Add to Cart */}
      <View className="w-full h-8 bg-gray-300 rounded-lg" />
    </View>
  );
};

export default SkeletonPharmacyProductCard;
