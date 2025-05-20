import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatNumber, formatPrice } from "@/utils/format";
import STATIC from "@/utils/constants";

const PharmacyProductCard = ({
  item,
  onPress,
  showAddToCart = true,
  type = "default",
}) => {
  if (!item || typeof item !== "object") return null;

  // ✅ ID handling based on presence of product object
  const id = item?.product?._id || item?._id || "";
  const { soldCount = 0 } = item;
  const product = item?.product || item;

  const {
    name = "No Name",
    price = 0,
    packSizeLabel = "",
    manufacturer = "Unknown",
    short_composition1 = "",
    short_composition2 = "",
    isPrescriptionRequired = false,
    images = null,
  } = product;

  // const imageSource =
  //   images && Array.isArray(images) && images.length > 0
  //     ? { uri: images[0] }
  //     : null;

  const imageSource = STATIC.IMAGES.COMPONENTS.MEDICINE_2

  const subtitle = `${short_composition1?.trim() || ""} ${
    short_composition2?.trim() || ""
  }`.trim();

  const handlePress = () => {
    if (typeof onPress === "function") {
      onPress(id);
    }
  };

  const mrp = price + 15; // Dummy MRP for UI
  const discount = Math.max(mrp - price, 0);

  if (type === "small") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="w-48 bg-white rounded-2xl p-3 mr-4"
        activeOpacity={0.8}
        key={id}
      >
        {/* Image */}
        {imageSource ? (
          <Image
            source={imageSource}
            className="w-full h-24 mb-3"
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-24 mb-3 bg-gray-100 rounded-xl" />
        )}

        {/* Title & Price */}
        <Text className="text-sm font-lexend-bold text-black" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-text-primary text-sm font-lexend-bold">
          {formatPrice(price)}
        </Text>

        {/* Subtitle */}
        <Text
          className="text-xs font-lexend text-gray-500 mb-3 leading-tight"
          numberOfLines={1}
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
      {imageSource ? (
        <Image
          source={imageSource}
          className="w-full h-24 mb-3"
          resizeMode="contain"
        />
      ) : (
        <View className="w-full h-24 mb-3 bg-gray-100 rounded-xl" />
      )}

      {/* Rating / Sold Count */}
      <View className="flex-row items-center mb-1 border border-background-soft rounded-full px-2 py-0.5 w-fit self-start">
        <Ionicons name="star" size={14} color="#FFD700" />
        <Text className="text-xs font-lexend text-text-muted ml-1">
          {soldCount > 0
            ? formatNumber(soldCount, 1)
            : (Math.random() * (5 - 3.5) + 3.5).toFixed(1)}
        </Text>
      </View>

      {/* Title */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className="font-lexend-bold text-sm text-text-primary leading-tight mb-1"
      >
        {name}
      </Text>

      {/* Price Info */}
      <Text className="text-text-primary text-sm font-lexend-bold">
        {formatPrice(price)}
      </Text>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-xs font-lexend text-text-muted line-through">
          MRP {formatPrice(mrp)}
        </Text>
        <Text className="text-[10px] font-lexend text-green-600 mb-1">
          Save ₹{discount.toFixed(0)}
        </Text>
      </View>

      {/* Manufacturer */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className="text-[10px] font-lexend text-text-muted leading-tight mb-2"
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
