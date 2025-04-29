import { Stack } from "expo-router";

import { LayoutWrapper } from "@/components/layouts/LayoutWrapper";

export default function CabLayout() {
  return (
    <LayoutWrapper>
      <Stack>
        <Stack.Screen
          name="/cab/book-cab"
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
