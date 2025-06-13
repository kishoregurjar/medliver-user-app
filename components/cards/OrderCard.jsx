import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { format } from "date-fns";
import { useRouter } from "expo-router";

function InfoRow({ icon, value }) {
  return (
    <View className="flex-row items-start gap-2 mb-2">
      {icon}
      <Text className="text-sm text-gray-700 flex-1">{value}</Text>
    </View>
  );
}

function Section({ title, value }) {
  return (
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="text-sm font-lexend text-gray-500">{title}</Text>
        <Text className="text-base font-lexend-semibold text-gray-900 mt-1">
          {value}
        </Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#6B7280" />
    </View>
  );
}

function StatusBadge({ status }) {
  const statusLabel = status.replaceAll("_", " ");
  const getColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <View className={`px-2 py-1 rounded-full ${getColor()}`}>
      <Text className="text-xs font-lexend-medium">{statusLabel}</Text>
    </View>
  );
}

export default function OrderCard({ order }) {
  const router = useRouter();
  const orderDate = format(new Date(order.orderDate), "dd MMM yyyy, hh:mm a");
  const address = order.deliveryAddress;
  const route = order.pharmacyToCustomerRoute?.[0];
  const items = order.items ?? [];

  const handlePress = () => {
    router.push(`/account/orders/${order._id}`);
  };

  const handleReorder = () => {
    // you can implement a reorder logic here
    console.log("Reorder", order._id);
  };

  const handleTrack = () => {
    router.push(`/account/orders/${order._id}?track=true`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-2xl p-4 border border-gray-200 active:opacity-80"
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-base font-lexend-semibold text-black">
          Order #{order.orderNumber}
        </Text>
      </View>
      <Text className="text-sm font-lexend text-text-muted mb-3">
        Placed on {orderDate}
      </Text>

      {/* Address */}
      <InfoRow
        icon={<Ionicons name="location-outline" size={18} color="#6B7280" />}
        value={`${address.street}, ${address.city} - ${address.pincode}`}
      />

      {/* All Items */}
      <View className="mb-3">
        {items.map((item, index) => (
          <InfoRow
            key={index}
            icon={<MaterialIcons name="medication" size={16} color="#6B7280" />}
            value={`${item.medicineName} × ${item.quantity}`}
          />
        ))}
        {items.length > 1 && (
          <Text className="text-xs text-gray-500 ml-6">
            {items.length} items in total
          </Text>
        )}
      </View>

      {/* Route */}
      {route?.distance && route?.duration && (
        <InfoRow
          icon={<Ionicons name="navigate-outline" size={16} color="#6B7280" />}
          value={`${route.distance} · ${route.duration}`}
        />
      )}

      {/* Divider */}
      <View className="border-t border-gray-200 my-4" />

      {/* Summary Sections */}
      <View className="space-y-4">
        <Section
          title="Total Amount"
          value={`₹${order.totalAmount.toFixed(2)}`}
        />
        <Section title="Payment Method" value={order.paymentMethod} />
        <Section
          title="Order Status"
          value={order.orderStatus.replaceAll("_", " ")}
        />
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3 mt-5">
        {order.orderStatus === "pending" && (
          <Pressable
            onPress={handleTrack}
            className="flex-1 py-2 px-3 bg-blue-50 border border-blue-600 rounded-xl"
          >
            <Text className="text-blue-700 text-center font-lexend-semibold">
              Track Order
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleReorder}
          className="flex-1 py-2 px-3 bg-gray-900 rounded-xl"
        >
          <Text className="text-white text-center font-lexend-semibold">
            Reorder
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
