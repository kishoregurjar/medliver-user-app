import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { format } from "date-fns";

export default function UserPrescriptionCard({ item, onPress }) {
  const createdDate = item?.created_at
    ? format(new Date(item.created_at), "dd MMM yyyy, hh:mm a")
    : "N/A";

  const prescriptionId =
    `#${item?.prescriptionNumber}` || `#${item._id.slice(-4).toUpperCase()}`;
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
      <View className="flex-row bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Image Section */}
        <Image
          source={{
            uri:
              prescriptionImage ||
              "https://via.placeholder.com/300x200.png?text=Prescription",
          }}
          className="w-[30%] h-full min-h-[150px] bg-gray-100"
          resizeMode="cover"
        />

        {/* Info Section */}
        <View className="flex-1 p-4 justify-between">
          {/* Top */}
          <View>
            <Text className="text-base font-lexend-semibold text-black mb-1">
              Order {prescriptionId}
            </Text>
            <Text className="text-xs text-gray-500 mb-1">
              Placed on {createdDate}
            </Text>
            <View className={`px-2 py-1 rounded-full self-start ${badge}`}>
              <Text className={`text-xs ${text} font-lexend-medium capitalize`}>
                {item.status || "Unknown"}
              </Text>
            </View>
          </View>

          {/* Bottom */}
          <View className="mt-3">
            {item.deliveryAddress?.street && (
              <Text className="text-sm text-gray-800 font-lexend mb-1">
                {item.deliveryAddress.street}, {item.deliveryAddress.city} -{" "}
                {item.deliveryAddress.pincode}
              </Text>
            )}

            <Text className="text-sm text-gray-700 font-lexend">
              Total:{" "}
              <Text className="text-brand-primary font-lexend-semibold">
                ₹{totalAmount}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
