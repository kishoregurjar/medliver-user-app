import { View, Text } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";

export default function NotificationDetailsScreen() {
  return (
    <AppLayout>
      {/* Header */}
      <HeaderWithBack showBackButton title='Notification' />
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">NotificationDetails</Text>
        <Text className="text-lg">Screen Work In Progress</Text>
      </View>
    </AppLayout>
  );
}
