// components/cart/SkeletonCartScreen.js
import { View } from "react-native";

export default function SkeletonOrderCard() {
  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
      {/* Order ID and Date */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
        <View className="h-4 w-20 bg-gray-200 rounded-md animate-pulse" />
      </View>

      {/* Amount */}
      <View className="flex-row justify-between mt-2">
        <View className="h-4 w-20 bg-gray-200 rounded-md animate-pulse" />
        <View className="h-4 w-16 bg-gray-200 rounded-md animate-pulse" />
      </View>

      {/* Payment */}
      <View className="flex-row justify-between mt-1">
        <View className="h-4 w-20 bg-gray-200 rounded-md animate-pulse" />
        <View className="h-4 w-16 bg-gray-200 rounded-md animate-pulse" />
      </View>

      {/* Status */}
      <View className="flex-row justify-between mt-1">
        <View className="h-4 w-20 bg-gray-200 rounded-md animate-pulse" />
        <View className="h-4 w-16 bg-gray-200 rounded-md animate-pulse" />
      </View>
    </View>
  );
}
