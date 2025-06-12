import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { format } from "date-fns";

export default function DiagnosticsOrderCard({ order }) {
  const router = useRouter();

  const formattedDate = order?.orderDate
    ? format(new Date(order.orderDate), "dd MMM yyyy, hh:mm a")
    : "N/A";

  const testCount = order?.selectedTests?.length || 0;
  const pathologyStatus = order?.pathologyAttempts?.[0]?.status || "pending";
  const pathologyCenter =
    order?.pathologyCenterId?.centerName || "Not Assigned";
  const isReportAvailable = order?.reportStatus === "uploaded";

  const handlePress = () => {
    router.push(`/account/diagnostics/${order._id}`);
  };

  const getStatusColor = (status) => {
    const normalized = status?.toLowerCase() || "";
    if (normalized.includes("delivered")) return "text-green-600 bg-green-100";
    if (normalized.includes("cancelled")) return "text-red-600 bg-red-100";
    return "text-yellow-600 bg-yellow-100";
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-2xl p-4 border border-gray-200 active:opacity-90"
    >
      {/* Top Row: Title + Date */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-lexend-medium text-black">
          Diagnostics Order
        </Text>
        <Text className="text-xs text-gray-500">{formattedDate}</Text>
      </View>

      {/* Center Info */}
      <View className="flex-row items-center mb-3 space-x-2">
        <Ionicons name="business-outline" size={16} color="#6B7280" />
        <Text className="text-sm text-gray-800 font-medium flex-1">
          {pathologyCenter}
        </Text>
      </View>

      {/* Test + Collection Type Pills */}
      <View className="flex-row flex-wrap gap-2 mb-3">
        <View className="bg-gray-100 px-3 py-1 rounded-full">
          <Text className="text-xs text-gray-700 font-medium">
            {testCount > 0
              ? `${testCount} Test${testCount > 1 ? "s" : ""}`
              : "No Tests"}
          </Text>
        </View>
        <View className="bg-gray-100 px-3 py-1 rounded-full">
          <Text className="text-xs text-gray-700 font-medium">
            {order?.isHomeCollection ? "Home Collection" : "Lab Visit"}
          </Text>
        </View>
        <View className="bg-gray-100 px-3 py-1 rounded-full">
          <Text className="text-xs text-gray-700 font-medium capitalize">
            Payment: {order?.paymentMethod || "N/A"}
          </Text>
        </View>
      </View>

      {/* Status Grid */}
      <View className="mt-2 space-y-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-500">Payment Status</Text>
          <Text className="text-sm font-semibold capitalize text-gray-700">
            {order?.paymentStatus || "N/A"}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-500">Pathology Status</Text>
          <Text className="text-sm font-semibold capitalize text-gray-700">
            {pathologyStatus.replaceAll("_", " ")}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-500">Order Status</Text>
          <View
            className={`px-3 py-1 rounded-full ${getStatusColor(
              order?.orderStatus
            )}`}
          >
            <Text
              className={`text-xs font-semibold capitalize ${
                getStatusColor(order?.orderStatus).split(" ")[0]
              }`}
            >
              {order?.orderStatus?.replaceAll("_", " ") || "N/A"}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-500">Amount</Text>
          <Text className="text-sm font-semibold text-black">
            ₹{Number(order?.totalAmount || 0).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Report CTA */}
      {isReportAvailable && (
        <Pressable
          onPress={() => console.log("Download report for", order._id)}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-xl self-start"
        >
          <Text className="text-sm font-semibold text-white">
            Download Report
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}
