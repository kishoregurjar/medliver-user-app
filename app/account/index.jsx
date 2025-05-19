import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthUser } from "@/contexts/AuthContext";
import { useAppToast } from "@/hooks/useAppToast";
import ROUTE_PATH from "@/routes/route.constants";

const accountOptions = [
  { label: "My Wallet", icon: "wallet-outline", path: "/account/wallet" },
  { label: "Offers", icon: "pricetags-outline", path: "/account/offers" },
  {
    label: "My Prescriptions",
    icon: "medkit-outline",
    path: "/account/prescriptions",
  },
  { label: "My Addresses", icon: "home-outline", path: "/account/addresses" },
  {
    label: "Notifications",
    icon: "notifications-outline",
    path: "/notifications",
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
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout } = useAuthUser();
  const { showToast } = useAppToast();

  const { authUser } = useAuthUser();

  const user = authUser?.user;
  const userImage = user?.profilePicture || "https://i.pravatar.cc/150?img=12";
  const userName = user?.fullName || "Guest User";

  const handleLogout = async () => {
    try {
      await logout();
      showToast("success", "Logged out successfully.");
      router.replace(ROUTE_PATH.APP.HOME);
    } catch (error) {
      showToast("error", error.message || "Unexpected error");
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppLayout scroll={false}>
      {/* Header */}
      <HeaderWithBack showBackButton title="My Account" backTo="/home" />

      <View className="flex-1 relative pb-20">
        {/* User Info */}
        <View className="items-center mt-8 mb-4 space-y-3">
          <Image
            source={{ uri: userImage }}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
          <Text className="text-xl font-semibold text-gray-900">
            {userName}
          </Text>

          {authUser && authUser.isAuthenticated ? (
            <View className="flex-row justify-between mt-4 gap-x-4 px-5">
              <TouchableOpacity
                className="flex-1 py-3 bg-indigo-100 rounded-xl items-center"
                activeOpacity={0.85}
                onPress={() => router.push("/account/edit-profile")}
              >
                <Text className="text-sm font-semibold text-indigo-600">
                  Edit Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 py-3 bg-indigo-600 rounded-xl items-center"
                activeOpacity={0.85}
                onPress={() => router.push("/account/change-password")}
              >
                <Text className="text-sm font-semibold text-white">
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="px-5 py-2 mt-4 bg-indigo-100 rounded-lg"
              activeOpacity={0.8}
              onPress={() => {
                router.push(ROUTE_PATH.AUTH.LOGIN);
              }}
            >
              <Text className="text-sm font-medium text-indigo-600">
                Sign In
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-200 my-4" />

        {/* Account Options */}
        <View className="flex-1 bg-white rounded-3xl shadow-md overflow-hidden">
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {accountOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-between p-2 rounded-xl"
                activeOpacity={0.7}
                onPress={() => {
                  if (item.path) {
                    router.push(item.path);
                  }
                }}
              >
                <View className="flex-row items-center space-x-4">
                  <View className="w-10 h-10 bg-brand-primary/30 rounded-full items-center justify-center flex mr-5">
                    <Ionicons name={item.icon} size={22} color="#E55150" />
                  </View>
                  <Text className="text-xs font-lexend-medium text-gray-800">
                    {item.label}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Divider */}

        {/* Fixed Logout Button */}
        {authUser && authUser.isAuthenticated && (
          <>
            <View className="h-px bg-gray-200 mt-4" />

            <View className="w-full mt-0 rounded-2xl bg-brand-primary/90 absolute bottom-0">
              <TouchableOpacity
                className="flex-row items-center justify-between p-3 rounded-xl"
                activeOpacity={0.7}
                onPress={handleLogout}
              >
                <View className="flex-row items-center space-x-3">
                  <View className="w-8 h-8 bg-t rounded-xl items-center justify-center flex">
                    <Ionicons name="log-out-outline" size={24} color="white" />
                  </View>
                  <Text className="text-base font-lexend-bold text-white">
                    Logout
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </AppLayout>
  );
};

export default AccountScreen;
