import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";

const STATUS_STEPS = {
  pharmacy: [
    {
      key: "order_placed",
      label: "Order Placed",
      icon: "clipboard-list-outline",
      color: "#4B5563",
    },
    {
      key: "accepted_by_pharmacy",
      label: "Accepted by Pharmacy",
      icon: "store-check-outline",
      color: "#1D4ED8",
    },
    {
      key: "assigned_to_delivery_partner",
      label: "Out for Delivery",
      icon: "bike-fast",
      color: "#0D9488",
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: "check-circle-outline",
      color: "#22C55E",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      icon: "cancel",
      color: "#EF4444",
    },
  ],
  pathology: [
    {
      key: "confirmed",
      label: "Order Placed",
      icon: "clipboard-list-outline",
      color: "#4B5563",
    },
    {
      key: "sample_collected",
      label: "Sample Collected",
      icon: "test-tube",
      color: "#1D4ED8",
    },
    {
      key: "in_lab",
      label: "In Lab",
      icon: "flask-outline",
      color: "#F59E0B",
    },
    {
      key: "completed",
      label: "Report Ready",
      icon: "file-document-check-outline",
      color: "#10B981",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      icon: "cancel",
      color: "#EF4444",
    },
  ],
};

export default function OrderStatusSteps({
  currentStatus = "",
  type = "pharmacy",
}) {
  const steps = STATUS_STEPS[type] || [];
  const currentIndex = steps.findIndex((step) => step.key === currentStatus);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <View className="flex-col">
      {steps.map((step, index) => {
        const isActive = index <= safeIndex && currentStatus !== "cancelled";
        const isCancelled =
          currentStatus === "cancelled" && step.key === "cancelled";
        const iconColor = isCancelled
          ? step.color
          : isActive
          ? step.color
          : "#D1D5DB";
        const textColor = isCancelled
          ? step.color
          : isActive
          ? "#111827"
          : "#9CA3AF";
        const lineColor = isActive ? step.color : "#E5E7EB";

        return (
          <View key={step.key} className="flex-row items-start">
            <View className="items-center">
              <MotiView
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 100, type: "timing" }}
                className="rounded-full p-1"
              >
                <MaterialCommunityIcons
                  name={step.icon}
                  size={24}
                  color={iconColor}
                />
              </MotiView>

              {index !== steps.length - 1 && (
                <View
                  className="w-px mx-auto"
                  style={{
                    height: 32,
                    backgroundColor: lineColor,
                  }}
                />
              )}
            </View>
            <View className="ml-3 mt-1">
              <Text
                className="text-sm font-lexend"
                style={{ color: textColor }}
              >
                {step.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
