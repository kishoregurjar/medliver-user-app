import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "@/utils/format";
import STATIC from "@/utils/constants";

const PathologyTestCard = ({
  item,
  onPress,
  showBookButton = true,
  type = "default",
}) => {
  if (!item || typeof item !== "object") return null;

  const {
    _id = "",
    name = "No Name",
    price = 0,
    sample_required = "Unknown",
    deliveryTime = "Varies",
    image = "https://onemg.gumlet.io/l_watermark_346,w_240,h_24%E2%80%A6_240,c_fit,q_auto,f_auto/hx2gxivwmeoxxxsc1hix.png",
  } = item;

  const id = _id;

  // Placeholder/fallback image
  const imageSource =
    image && typeof image === "string"
      ? { uri: image }
      : STATIC.IMAGES.COMPONENTS.TEST;

  const mrp = price + 100; // Dummy MRP for UI
  const discount = Math.max(mrp - price, 0);
  const discountPercent = ((discount / mrp) * 100).toFixed(0);

  const handlePress = () => {
    if (typeof onPress === "function") {
      onPress(id);
    }
  };

  if (type === "small") {
    // Example small layout if needed
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="w-48 bg-white rounded-2xl p-3 mr-4 border border-background-soft"
        activeOpacity={0.8}
        key={id}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            className="w-full h-20 mb-2"
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-20 bg-gray-100 rounded-xl mb-2" />
        )}

        <Text className="text-sm font-lexend-bold text-black" numberOfLines={1}>
          {name}
        </Text>

        <Text
          className="text-xs text-gray-500 mb-1 leading-tight"
          numberOfLines={1}
        >
          {sample_required}
        </Text>

        <Text className="text-xs text-gray-500 leading-tight mb-1">
          {deliveryTime}
        </Text>

        <Text className="text-sm font-lexend-bold text-black">
          {formatPrice(price)}
        </Text>

        {showBookButton && (
          <TouchableOpacity className="bg-brand-primary flex-row items-center justify-center rounded-lg py-1.5 mt-2">
            <Ionicons name="flask" size={14} color="#fff" />
            <Text className="text-white text-xs font-lexend-semibold ml-1">
              Book Now
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
      className="w-48 bg-white rounded-2xl p-3 mr-4 border border-background-soft"
      activeOpacity={0.8}
      key={id}
    >
      {/* Image */}
      {imageSource ? (
        <Image
          source={imageSource}
          className="w-full h-24 mb-2"
          resizeMode="contain"
        />
      ) : (
        <View className="w-full h-24 bg-gray-100 rounded-xl mb-2" />
      )}

      {/* Test Name */}
      <Text
        className="text-sm font-lexend-bold text-black mb-1"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </Text>

      {/* Sample required */}
      <Text
        className="text-xs text-gray-500 mb-1 leading-tight"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        Sample: {sample_required}
      </Text>

      {/* Delivery time */}
      <Text
        className="text-xs text-gray-500 mb-2 leading-tight"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        Delivery: {deliveryTime}
      </Text>

      {/* Pricing */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xs text-gray-400 line-through">
          MRP {formatPrice(mrp)}
        </Text>
        <Text className="text-xs text-green-600 font-lexend-semibold">
          Save ₹{discount.toFixed(0)}
        </Text>
      </View>

      <Text className="text-sm font-lexend-bold text-black mb-1">
        {formatPrice(price)}
      </Text>

      {/* Book Now button */}
      {showBookButton && (
        <TouchableOpacity
          onPress={handlePress}
          className="bg-brand-primary flex-row items-center justify-center rounded-lg py-2"
          activeOpacity={0.8}
        >
          <Ionicons name="flask" size={16} color="#fff" />
          <Text className="text-white text-sm font-lexend-semibold ml-1">
            Book Now
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default PathologyTestCard;
