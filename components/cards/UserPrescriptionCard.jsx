import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

export default function UserPrescriptionCard({ item, onPress, onDelete }) {
  const createdDate = format(new Date(item.created_at), "dd MMM yyyy, hh:mm a");

  const getStatusStyles = () => {
    switch (item.status) {
      case "pending":
        return { badge: "bg-yellow-100", text: "text-yellow-800" };
      case "completed":
        return { badge: "bg-green-100", text: "text-green-700" };
      default:
        return { badge: "bg-gray-200", text: "text-gray-600" };
    }
  };

  const { badge, text } = getStatusStyles();

  return (
    <View className="bg-white p-4 rounded-2xl mb-4 border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-base font-lexend-semibold text-gray-800">
            Prescription #{item._id.slice(-4).toUpperCase()}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">{createdDate}</Text>
        </View>

        <View className={`px-3 py-1 rounded-full ${badge}`}>
          <Text className={`text-xs font-medium ${text}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-sm text-gray-600">
          Total Amount: ₹{item.total_amount || 0}
        </Text>

        <View className="flex-row space-x-4 items-center">
          <TouchableOpacity className="flex-row items-center" onPress={onPress}>
            <Text className="text-brand-primary font-medium">View</Text>
            <Ionicons name="chevron-forward" size={16} color="#B31F24" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color="#FF4C4C" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
