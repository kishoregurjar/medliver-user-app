import { Tabs } from "expo-router";
import AppTabBar from "@/components/common/AppTabBar";

export default function PathologyLayout() {
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
