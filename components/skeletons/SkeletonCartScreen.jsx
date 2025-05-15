// components/cart/SkeletonCartScreen.js
import { View } from "react-native";

export default function SkeletonCartScreen() {
  return (
    <View className="flex-1 my-4">
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          className="flex-row p-4 my-1 rounded-xl bg-white space-x-4 animate-pulse"
        >
          <View className="w-1/4 h-24 bg-gray-200 rounded-md mr-4" />
          <View className="flex-1 justify-between py-1">
            <View className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <View className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
            <View className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
            <View className="h-4 bg-gray-200 rounded w-2/3" />
          </View>
        </View>
      ))}
    </View>
  );
}
