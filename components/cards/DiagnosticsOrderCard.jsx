import React from "react";
import { View, Text, Pressable } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { format } from "date-fns";

// Mini section layout with arrow
function Section({ title, value }) {
  return (
    <View className="flex-row justify-between items-center mb-3">
      <View>
        <Text className="text-sm font-lexend text-gray-500">{title}</Text>
        <Text className="text-base font-lexend-semibold text-gray-900 mt-1 capitalize">
          {value || "N/A"}
        </Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#6B7280" />
    </View>
  );
}

// Small pill component
function Chip({ icon, label, bg = "bg-gray-100" }) {
  const IconComponent =
    icon === "payment" ? MaterialIcons : MaterialCommunityIcons;

  return (
    <View className={`flex-row items-center px-3 py-1 rounded-full ${bg}`}>
      <IconComponent name={icon} size={14} color="#4B5563" />
      <Text className="ml-2 text-xs text-gray-700 font-medium">{label}</Text>
    </View>
  );
}

// Status badge (only if pending, delivered, cancelled)
function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let bg = "bg-yellow-100";
  let text = "text-yellow-700";
  if (normalized.includes("delivered")) {
    bg = "bg-green-100";
    text = "text-green-700";
  } else if (normalized.includes("cancelled")) {
    bg = "bg-red-100";
    text = "text-red-600";
  } else if (!normalized.includes("pending")) {
    return null; // Only show for pending, delivered, cancelled
  }

  return (
    <View className={`self-start px-3 py-1 rounded-full ${bg} mt-2`}>
      <Text className={`text-xs font-semibold capitalize ${text}`}>
        {status.replaceAll("_", " ")}
      </Text>
    </View>
  );
}

export default function DiagnosticsOrderCard({ order }) {
  const router = useRouter();

  const formattedDate = order?.orderDate
    ? format(new Date(order.orderDate), "dd MMM yyyy, hh:mm a")
    : "N/A";

  const testCount = order?.selectedTests?.length || 0;
  const pathologyCenter =
    order?.pathologyCenterId?.centerName || "Not Assigned";
  const isReportAvailable = order?.reportStatus === "uploaded";

  const handlePress = () => {
    router.push(`/account/diagnostics/${order._id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-2xl p-4 border border-gray-200 active:opacity-90 shadow-sm"
    >
      {/* Header */}
      <View className="mb-4">
        <Text className="text-base font-lexend-semibold text-black">
          Order #{order?.orderNumber || "N/A"}
        </Text>
        <Text className="text-xs text-gray-400 mt-0.5">
          Placed on {formattedDate}
        </Text>
      </View>

      {/* Pathology Center */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="business-outline" size={14} color="#6B7280" />
        <Text className="ml-2 text-sm text-gray-700 font-medium">
          {pathologyCenter}
        </Text>
      </View>

      {/* Pills */}
      <View className="flex-row flex-wrap gap-2 mb-4">
        <Chip
          icon="flask-outline"
          label={`${testCount || "No"} Test${testCount > 1 ? "s" : ""}`}
        />
        <Chip
          icon="home-outline"
          label={order?.isHomeCollection ? "Home Collection" : "Lab Visit"}
          bg="bg-indigo-100"
        />
        <Chip
          icon="payment"
          label={`Payment: ${order?.paymentMethod || "N/A"}`}
          bg="bg-yellow-100"
        />
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-100 mb-4" />

      {/* Order Summary */}
      <View>
        <Section
          title="Total Amount"
          value={`₹${Number(order?.totalAmount || 0).toFixed(2)}`}
        />
        <Section title="Payment Status" value={order?.paymentStatus || "N/A"} />
        <Section
          title="Order Status"
          value={order?.orderStatus?.replaceAll("_", " ") || "N/A"}
        />
      </View>

      {/* Status Badge (only visible for pending / delivered / cancelled) */}
      <StatusBadge status={order?.orderStatus} />

      {/* Download Report CTA */}
      {isReportAvailable && (
        <Pressable
          onPress={() => {
            if (__DEV__) console.log("Download report for", order._id);
          }}
          className="mt-4 flex-row items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl self-start active:opacity-90"
        >
          <MaterialIcons name="file-download" size={16} color="#fff" />
          <Text className="text-sm font-semibold text-white">
            Download Report
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}
