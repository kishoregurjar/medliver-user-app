import React from "react";
import { View } from "react-native";

export default function SkeletonTestOrderDetails() {
  return (
    <View className="flex-1 gap-3">
      {/* Skeleton Card */}
      {[1, 2, 3].map((section) => (
        <View
          key={section}
          className="bg-white rounded-2xl p-4 border border-gray-100 flex-1 gap-3"
        >
          {/* Title */}
          <View className="h-5 w-32 bg-gray-200 rounded-md" />

          {/* Rows */}
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              className="h-4 w-full bg-gray-200 rounded-md flex-1 gap-3"
            />
          ))}

          {/* Optional total row for test section */}
          {section === 2 && (
            <View className="h-4 w-1/2 bg-gray-300 rounded-md mt-2" />
          )}
        </View>
      ))}
    </View>
  );
}
