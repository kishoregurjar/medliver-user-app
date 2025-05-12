import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const accountOptions = [
  { label: "My Wallet", icon: "wallet-outline", path: "/account/wallet" },
  { label: "Offers", icon: "pricetags-outline", path: "/account/offers" },
  {
    label: "My Prescriptions",
    icon: "medkit-outline",
    path: "/account/prescriptions",
  },
  {
    label: "Notifications",
    icon: "notifications-outline",
    path: "/account/notifications",
  },
  { label: "Help", icon: "help-circle-outline", path: "/account/help" },
  {
    label: "Privacy Policy",
    icon: "shield-checkmark-outline",
    path: "/account/privacy-policy",
  },
  {
    label: "Terms of Use",
    icon: "document-text-outline",
    path: "/account/terms-of-use",
  },
  // { label: "Settings", icon: "settings-outline", path: "/account/settings" },
  { label: "Logout", icon: "log-out-outline" },
];

const AccountScreen = () => {
  const userName = "Yash Tiwari";
  const userImage = "https://i.pravatar.cc/150?img=12";
  const insets = useSafeAreaInsets();

  const router = useRouter();

  return (
    <AppLayout scroll={false}>
      {/* Header */}
      <HeaderWithBack showBackButton title="My Account" backTo="/home" />
      
      <View className="flex-1 pb-6">
        {/* User Info Section */}
        <View className="items-center mt-8 mb-4 space-y-3">
          <Image
            source={{ uri: userImage }}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
          <Text className="text-xl font-semibold text-gray-900">
            {userName}
          </Text>

          <TouchableOpacity
            className="px-5 py-2 bg-indigo-100 rounded-full"
            activeOpacity={0.8}
            onPress={() => {
              // Navigate to Edit Profile
            }}
          >
            <Text className="text-sm font-medium text-indigo-600">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-200 my-4" />

        {/* Scrollable Options Only */}
        <View className="flex-1 bg-white rounded-3xl shadow-md overflow-hidden">
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              paddingBottom: insets.bottom + 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {accountOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-between p-3 rounded-xl mb-2"
                activeOpacity={0.8}
                onPress={() => {
                  if (item.path) {
                    // Navigate to the specified path
                    router.push(item.path);
                  } else {
                    // Handle logout or other actions
                    console.log("Logout pressed");
                  }
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
          </ScrollView>
        </View>
      </View>
    </AppLayout>
  );
};

export default AccountScreen;
