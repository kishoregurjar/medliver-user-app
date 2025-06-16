import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function OrderTrackingInfoPanel({
  animatedStyle,
  eta,
  distance,
  pharmacyName,
  totalAmount,
  items,
  expanded,
  setExpanded,
}) {
  return (
    <Animated.View
      style={animatedStyle}
      className="absolute bottom-0 left-0 right-0 bg-white p-5 rounded-t-3xl"
    >
      <View className="flex-row justify-evenly items-center bg-gray-100 p-4 rounded-2xl mb-3">
        <View>
          <Text className="text-sm font-semibold text-gray-600">
            Estimated Time
          </Text>
          <Text className="text-base text-gray-900">{eta}</Text>
        </View>
        <View className="h-8 w-0.5 bg-gray-400" />
        <View>
          <Text className="text-sm font-semibold text-gray-600">Distance</Text>
          <Text className="text-base text-gray-900">{distance}</Text>
        </View>
      </View>

      <View className="flex-row items-center mb-3 space-x-2">
        <MaterialCommunityIcons
          name="storefront-outline"
          size={24}
          color="#B31F24"
        />
        <Text className="text-xl font-semibold text-gray-900">
          {pharmacyName}
        </Text>
      </View>

      <View className="mb-2 gap-2">
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          className="flex-row justify-between items-center mb-1"
        >
          <Text className="text-base font-semibold">Items</Text>
          <MaterialCommunityIcons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>

        {expanded &&
          items.map((item, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center px-2"
            >
              <Text className="text-base text-gray-800">
                {item.quantity} x {item.name}
              </Text>
              <Text className="text-base text-gray-700">₹{item.price}</Text>
            </View>
          ))}
      </View>

      <View className="h-0.5 w-full bg-gray-200 my-3" />

      <View className="flex-row justify-between items-center">
        <Text className="text-xl font-semibold text-gray-900">
          Total Amount
        </Text>
        <Text className="text-xl font-semibold text-gray-900">
          {totalAmount}
        </Text>
      </View>
    </Animated.View>
  );
}
