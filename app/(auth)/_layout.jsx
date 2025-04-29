import { Stack } from "expo-router";

import { LayoutWrapper } from "@/components/layouts/LayoutWrapper";

export default function AuthLayout() {
  return (
    <LayoutWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </LayoutWrapper>
  );
}
