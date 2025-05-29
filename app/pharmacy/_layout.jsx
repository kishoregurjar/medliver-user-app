import { Tabs } from "expo-router";
import AppTabBar from "@/components/common/AppTabBar";

export default function PharmacyLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <AppTabBar />
    </>
  );
}
