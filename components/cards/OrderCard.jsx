import { View, Text, Pressable, Image } from "react-native";
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
    // Reorder logic here
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
      <View className="flex-row justify-between items-center mb-2">
        <View>
          <Text className="text-base font-lexend-semibold text-black">
            Order #{order.orderNumber}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            Placed on {orderDate}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="border-t border-gray-100 my-3" />

      {/* Delivery Address */}
      <View className="mb-3">
        <Text className="text-sm font-lexend text-gray-600 mb-1">
          Delivery Address
        </Text>
        <InfoRow
          icon={<Ionicons name="location-outline" size={18} color="#6B7280" />}
          value={`${address.street}, ${address.city} - ${address.pincode}`}
        />
      </View>

      {/* Items */}
      <View className="mb-3">
        <Text className="text-sm font-lexend text-gray-600 mb-2">
          Ordered Items
        </Text>

        {items.map((item, index) => (
          <View key={index} className="flex-row items-center gap-3 mb-2 ml-1">
            <Image
              source={{
                uri:
                  item.thumbnailUrl ||
                  "https://via.placeholder.com/40x40.png?text=%20",
              }}
              className="w-10 h-10 rounded-md bg-gray-100"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-sm text-gray-800 font-lexend-semibold">
                {item.medicineName}
              </Text>
              <Text className="text-xs text-gray-500">
                Qty: {item.quantity}
              </Text>
            </View>
          </View>
        ))}

        {items.length > 1 && (
          <Text className="text-xs text-gray-500 ml-1">
            Total {items.length} items
          </Text>
        )}
      </View>

      {/* Route Info */}
      {route?.distance && route?.duration && (
        <InfoRow
          icon={<Ionicons name="navigate-outline" size={16} color="#6B7280" />}
          value={`${route.distance} · ${route.duration}`}
        />
      )}

      {/* Divider */}
      <View className="border-t border-gray-100 my-4" />

      {/* Summary */}
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

      {/* Actions */}
      <View className="flex-row gap-3 mt-5">
        {order.orderStatus.toLowerCase() === "pending" && (
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
