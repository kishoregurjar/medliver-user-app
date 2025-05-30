import { View, Text, Pressable } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { format } from "date-fns";
import { useRouter } from "expo-router";

export default function OrderCard({ order }) {
  const router = useRouter();
  const date = format(new Date(order.orderDate), "dd MMM yyyy, hh:mm a");
  const address = order.deliveryAddress;
  const route = order.pharmacyToCustomerRoute?.[0];
  const item = order.items?.[0];

  const handlePress = () => {
    router.push(`/account/orders/${order._id}`);
  };

  // Status color
  const getStatusColor = (status) => {
    if (status.includes("delivered")) return "text-green-600";
    if (status.includes("cancelled")) return "text-red-500";
    return "text-yellow-600"; // pending, assigned, etc.
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 active:opacity-80"
    >
      {/* Order Header */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-base font-lexend-semibold text-black">
          Order #{order.orderNumber}
        </Text>
        <Text className="text-xs text-gray-500">{date}</Text>
      </View>

      {/* Address */}
      <View className="flex-row items-start space-x-2 mb-3">
        <Ionicons name="location-outline" size={18} color="#6B7280" />
        <Text className="text-sm text-gray-600 flex-1">
          {address.street}, {address.city} - {address.pincode}
        </Text>
      </View>

      {/* Item Summary */}
      <View className="flex-row items-center space-x-2 mb-2">
        <MaterialIcons name="medication" size={16} color="#6B7280" />
        <Text className="text-sm text-gray-700">
          {item?.medicineName} × {item?.quantity}
        </Text>
      </View>

      {/* Distance/Time */}
      {route?.distance && route?.duration && (
        <View className="flex-row items-center space-x-2 mb-2">
          <Ionicons name="navigate-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600">
            {route.distance} · {route.duration}
          </Text>
        </View>
      )}

      {/* Info Rows */}
      <View className="mt-2 space-y-1">
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-600">Amount</Text>
          <Text className="text-sm font-medium text-black">
            ₹{order.totalAmount.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-600">Payment</Text>
          <Text className="text-sm font-medium text-black capitalize">
            {order.paymentMethod}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-600">Status</Text>
          <Text
            className={`text-sm font-semibold ${getStatusColor(
              order.orderStatus
            )} capitalize`}
          >
            {order.orderStatus.replaceAll("_", " ")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
