import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthUser } from "@/contexts/AuthContext";
import { useAppToast } from "@/hooks/useAppToast";

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
];

const AccountScreen = () => {
  const userName = "Yash Tiwari";
  const userImage = "https://i.pravatar.cc/150?img=12";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout } = useAuthUser();
  const { showToast } = useAppToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast("success", "Logged out successfully.");
      router.replace("/login");
    } catch (error) {
      showToast("error", error.message || "Unexpected error");
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="My Account" backTo="/home" />

      <View className="flex-1 relative bg-gray-50 pb-24">
        {/* User Info */}
        <View className="items-center mt-8 space-y-3 px-4">
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

        {/* Account Options */}
        <View className="mt-6 mx-4 rounded-3xl bg-white shadow-md overflow-hidden">
          <ScrollView
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {accountOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-between px-5 py-3 active:bg-gray-50"
                activeOpacity={0.8}
                onPress={() => {
                  if (item.path) {
                    router.push(item.path);
                  }
                }}
              >
                <View className="flex-row items-center space-x-4">
                  <View className="w-10 h-10 bg-brand-primary/20 rounded-full items-center justify-center">
                    <Ionicons name={item.icon} size={22} color="#E55150" />
                  </View>
                  <Text className="text-sm font-lexend-medium text-gray-800">
                    {item.label}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Logout Button */}
        <View
          className="absolute bottom-4 left-4 right-4 bg-brand-primary/90 rounded-2xl"
          style={{ paddingBottom: insets.bottom || 12 }}
        >
          <TouchableOpacity
            className="flex-row items-center justify-between p-4"
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <View className="flex-row items-center space-x-3">
              <View className="w-8 h-8 bg-white/20 rounded-xl items-center justify-center">
                <Ionicons name="log-out-outline" size={22} color="white" />
              </View>
              <Text className="text-base font-lexend-bold text-white">
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </AppLayout>
  );
};

export default AccountScreen;
