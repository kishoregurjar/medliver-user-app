import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { format } from "date-fns";

export default function OrderCard({ order }) {
  const address = order.deliveryAddress;
  const date = format(new Date(order.orderDate), "dd MMM yyyy, hh:mm a");

  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-lexend-semibold text-black">
          Order #{order._id.slice(-6).toUpperCase()}
        </Text>
        <Text className="text-sm text-gray-500">{date}</Text>
      </View>

      <View className="flex-row items-start space-x-2 mb-2">
        <Ionicons name="location-outline" size={18} color="#6b7280" />
        <Text className="text-sm text-gray-600">
          {address.house_number}, {address.street}, {address.city} -{" "}
          {address.pincode}
        </Text>
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-gray-600">Amount</Text>
        <Text className="text-sm font-medium text-black">
          ₹{order.totalAmount.toFixed(2)}
        </Text>
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className="text-sm text-gray-600">Payment</Text>
        <Text className="text-sm font-medium text-black capitalize">
          {order.paymentMethod}
        </Text>
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className="text-sm text-gray-600">Status</Text>
        <Text className="text-sm font-medium text-brand-primary capitalize">
          {order.orderStatus}
        </Text>
      </View>
    </View>
  );
}
