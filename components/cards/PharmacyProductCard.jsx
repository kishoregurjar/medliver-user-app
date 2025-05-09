import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatNumber, formatPrice, getDiscount } from "@/utils/format";

const PharmacyProductCard = ({
  item,
  onPress,
  showAddToCart = true,
  type = "default",
}) => {
  if (!item || typeof item !== "object") return null; // Basic safety

  const {
    id = "",
    image,
    title = "No Title",
    subtitle = "",
    price = 0,
    mrp = 0,
    rating = 0,
    manufacturer = "Unknown",
  } = item;

  const discount = Math.max(mrp - price, 0);

  const handlePress = () => {
    if (typeof onPress === "function") {
      onPress(id);
    }
  };

  if (type === "small") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="w-48 bg-white rounded-2xl p-3 mr-4"
        activeOpacity={0.8}
        key={id}
      >
        {/* Image */}
        {image ? (
          <Image
            source={image}
            className="w-full h-24 mb-3"
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-24 mb-3 bg-gray-100 rounded-xl" />
        )}

        {/* Title & Price */}
        <View className="flex-row justify-between items-center mb-1">
          <Text
            className="text-sm font-lexend-bold text-black"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text className="text-text-primary text-sm font-bold">
            {formatPrice(item.price)}
          </Text>
        </View>

        {/* Subtitle */}
        <Text
          className="text-xs text-gray-500 mb-3 leading-tight"
          numberOfLines={2}
        >
          {subtitle || manufacturer}
        </Text>

        {/* Add to Cart */}
        {showAddToCart && (
          <TouchableOpacity className="bg-brand-background flex-row items-center justify-center rounded-lg py-1">
            <Ionicons name="add" size={16} color="#E55150" />
            <Text className="text-brand-primary text-sm font-lexend-semibold ml-1">
              Add to Cart
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  // Default layout
  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-2xl p-3 w-52 mr-4"
      activeOpacity={0.8}
      key={id}
    >
      {/* Image */}
      {image ? (
        <Image
          source={image}
          className="w-full h-24 mb-3"
          resizeMode="contain"
        />
      ) : (
        <View className="w-full h-24 mb-3 bg-gray-100 rounded-xl" />
      )}

      {/* Rating */}
      <View className="flex-row items-center mb-1 border border-background-soft rounded-full px-2 py-0.5 w-fit self-start">
        <Ionicons name="star" size={14} color="#FFD700" />
        <Text className="text-xs text-text-muted ml-1">
          {formatNumber(item.rating, 1)}
        </Text>
      </View>

      {/* Title */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className="font-semibold text-sm text-text-primary leading-tight mb-1"
      >
        {title}
      </Text>

      {/* Price Info */}
      <Text className="text-text-primary text-sm font-bold">
        {formatPrice(item.price)}
      </Text>
      <Text className="text-xs text-text-muted line-through">
        MRP {formatPrice(item.mrp)}
      </Text>
      <Text className="text-[10px] text-green-600 mb-1">
        Save ₹{getDiscount(item.mrp, item.price).toFixed(0)}
      </Text>

      {/* Manufacturer */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className="text-[10px] text-text-muted leading-tight mb-2"
      >
        By {manufacturer}
      </Text>

      {/* Add to Cart */}
      {showAddToCart && (
        <TouchableOpacity className="flex-row items-center justify-center rounded-lg py-1">
          <Ionicons name="add" size={16} color="#E2AD5F" />
          <Text className="text-brand-secondary text-sm font-lexend-semibold ml-1">
            Add to Cart
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default PharmacyProductCard;
