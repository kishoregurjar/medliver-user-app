import { Stack } from "expo-router";

import { LayoutWrapper } from "@/components/layouts/LayoutWrapper";

export default function InsuranceLayout() {
  return (
    <LayoutWrapper>
      <Stack screenOptions={{ headerShown: false }} s>
        <Stack screenOptions={{ headerShown: false }} />
      </Stack>
    </LayoutWrapper>
  );
}
