import { View, Text, TouchableOpacity, Image } from "react-native";
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
  const prescriptionImage = item.prescriptions?.[0]?.path;

  return (
    <View className="bg-white p-4 rounded-2xl mb-4 border border-gray-200 shadow-sm">
      {/* Top Row: ID + Status */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-base font-lexend-semibold text-gray-800">
            Prescription #{item._id.slice(-4).toUpperCase()}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">{createdDate}</Text>
        </View>

        <View className={`px-3 py-1 rounded-full ${badge}`}>
          <Text className={`text-xs font-medium ${text}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Prescription Thumbnail */}
      {prescriptionImage && (
        <View className="mt-4 rounded-xl overflow-hidden border border-gray-100">
          <Image
            source={{ uri: prescriptionImage }}
            className="w-full h-40"
            resizeMode="cover"
          />
        </View>
      )}

      {/* Total + Actions */}
      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-sm text-gray-700">
          Total Amount:{" "}
          <Text className="font-semibold text-brand-primary">
            ₹{item.total_amount?.toFixed(2) || "0.00"}
          </Text>
        </Text>

        <View className="flex-row space-x-4 items-center">
          <TouchableOpacity
            className="flex-row items-center px-2 py-1"
            onPress={onPress}
          >
            <Text className="text-brand-primary font-medium text-sm">View</Text>
            <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-2 rounded-full bg-red-50"
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#FF4C4C" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
