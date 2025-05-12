import React from "react";
import { View } from "react-native";

const SkeletonPharmacyProductCard = ({ type = "default" }) => {
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
