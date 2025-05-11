import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const settingsOptions = [
  { label: "Change Password", icon: "lock-closed-outline" },
  { label: "Notification Preferences", icon: "notifications-outline" },
  { label: "Privacy Settings", icon: "shield-checkmark-outline" },
  { label: "Language", icon: "language-outline" },
  { label: "About Us", icon: "information-circle-outline" },
  { label: "Logout", icon: "log-out-outline" },
];

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <AppLayout>
      {/* Header */}
      <HeaderWithBack showBackButton title="Settings" />

      <View className="flex-1">
        {/* Scrollable Content */}
        <ScrollView
          className="mt-4"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Settings Options Section */}
          <View className="bg-white p-4 rounded-3xl shadow-md">
            {settingsOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-between p-3 rounded-xl mb-2"
                activeOpacity={0.8}
                onPress={() => {
                  // Handle navigation or action for each setting option
                }}
              >
                <View className="flex-row items-center space-x-4">
                  <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center flex">
                    <Ionicons name={item.icon} size={22} color="#4B5563" />
                  </View>
                  <Text className="text-base font-medium text-gray-800">
                    {item.label}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default SettingsScreen;
