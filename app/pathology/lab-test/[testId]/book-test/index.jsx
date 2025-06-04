import { View, Text } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import UserAddressSelection from "@/components/common/UserAddressSelection";
import UserPaymentOptions from "@/components/common/UserPaymentOptions";
import { useRouter } from "expo-router";

export default function BookTestScreen() {
  // This screen allows users to book a lab test by selecting an address and payment method
  const router = useRouter();

  return (
    <AppLayout scroll={false}>
      {/* Header */}
      <HeaderWithBack showBackButton title="Book Test"/>
      <UserAddressSelection />
      <UserPaymentOptions />
    </AppLayout>
  );
}
