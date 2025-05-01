import { Stack } from "expo-router";

import { LayoutWrapper } from "@/components/layouts/LayoutWrapper";
import { View } from "react-native";

export default function PharmacyLayout() {
  return (
    <LayoutWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </LayoutWrapper>
  );
}
