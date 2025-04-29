import { Stack } from "expo-router";

import { LayoutWrapper } from "@/components/layouts/LayoutWrapper";

export default function InsuranceLayout() {
  return (
    <LayoutWrapper>
      <Stack>
        <Stack.Screen
          name="/insurance/get-quotes"
          options={{
            headerShown: true,
            headerTitle: "",
            headerTintColor: "#E55150",
          }}
        />
      </Stack>
    </LayoutWrapper>
  );
}
