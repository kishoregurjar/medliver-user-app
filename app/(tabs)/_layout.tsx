import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // tabBarButton: HapticTab,
        tabBarBackground: () => <View></View>>,
        tabBarStyle: {
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 24,
          height: 72,
          paddingBottom: Platform.OS === "ios" ? 24 : 16,
          paddingTop: 8,
          backgroundColor: isDark
            ? "rgba(18,18,18,0.85)"
            : "rgba(255,255,255,0.9)",
          shadowColor: isDark ? "#000" : "#aaa",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 10,
          borderTopWidth: 0,
          overflow: "hidden",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
