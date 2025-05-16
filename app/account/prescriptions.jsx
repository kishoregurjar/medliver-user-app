import { View, Text } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";

export default function MyPrescriptionScreen() {
  return (
    <AppLayout>
      {/* Header */}
      <HeaderWithBack showBackButton title="My Prescriptions" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">MyPrescriptionScreen</Text>
        <Text className="text-lg">Screen Work In Progress</Text>
      </View>
    </AppLayout>
  );
}
