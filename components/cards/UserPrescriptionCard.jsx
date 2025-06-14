import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

export default function UserPrescriptionCard({ item, onPress, onDelete }) {
  const createdDate = item?.created_at
    ? format(new Date(item.created_at), "dd MMM yyyy, hh:mm a")
    : "N/A";

  const prescriptionId =
    item?.prescriptionNumber || `#${item._id.slice(-4).toUpperCase()}`;
  const prescriptionImage = item?.prescriptions?.[0]?.path;
  const totalAmount = Number(item?.total_amount || 0).toFixed(2);

  const getStatusStyles = () => {
    const status = item.status?.toLowerCase();
    switch (status) {
      case "pending":
        return { badge: "bg-yellow-100", text: "text-yellow-800" };
      case "completed":
        return { badge: "bg-green-100", text: "text-green-700" };
      case "assigned_to_pharmacy":
        return { badge: "bg-blue-100", text: "text-blue-700" };
      default:
        return { badge: "bg-gray-200", text: "text-gray-600" };
    }
  };

  const { badge, text } = getStatusStyles();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View className="bg-white border border-gray-200 rounded-2xl p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-base font-lexend-semibold text-black">
              Order #{prescriptionId}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Placed on {createdDate}
            </Text>
          </View>
        </View>

        {/* --- Prescription Image --- */}
        <View className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
          <Image
            source={{
              uri:
                prescriptionImage ||
                "https://via.placeholder.com/300x200.png?text=Prescription",
            }}
            className="w-full h-40"
            resizeMode="cover"
          />
        </View>

        {/* --- Delivery Info --- */}

        {item.deliveryAddress?.street && (
          <View className="mt-4">
            <Text className="text-xs text-gray-500 font-lexend mb-1">
              Delivery Address
            </Text>
            <Text className="text-sm text-gray-800 font-lexend-semibold">
              {item.deliveryAddress.street}, {item.deliveryAddress.city} -{" "}
              {item.deliveryAddress.pincode}
            </Text>
          </View>
        )}

        {/* --- Footer Section --- */}
        <View className="mt-5 flex-row justify-between items-center">
          <Text className="text-sm text-gray-700 font-lexend">
            Total:{" "}
            <Text className="text-brand-primary font-lexend-semibold">
              ₹{totalAmount}
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
