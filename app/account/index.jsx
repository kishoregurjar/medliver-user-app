import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthUser } from "@/contexts/AuthContext";
import { useAppToast } from "@/hooks/useAppToast";
import ROUTE_PATH from "@/routes/route.constants";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";

const accountOptions = [
  {
    label: "My Wallet",
    icon: "wallet-outline",
    path: "/account/wallet",
    guest: false,
  },
  {
    label: "Offers",
    icon: "pricetags-outline",
    path: "/account/offers",
    guest: true,
  },
  {
    label: "My Orders",
    icon: "cart-outline",
    path: "/account/orders",
    guest: false,
  },
  {
    label: "My Bookings",
    icon: "calendar-outline",
    path: "/account/bookings",
    guest: false,
  },
  {
    label: "My Prescriptions",
    icon: "medkit-outline",
    path: "/account/prescriptions",
    guest: false,
  },
  {
    label: "My Addresses",
    icon: "home-outline",
    path: "/account/addresses",
    guest: false,
  },
  {
    label: "Notifications",
    icon: "notifications-outline",
    path: "/notifications",
    guest: true,
  },
  {
    label: "Help",
    icon: "help-circle-outline",
    path: "/account/help",
    guest: true,
  },
  {
    label: "Privacy Policy",
    icon: "shield-checkmark-outline",
    path: "/account/privacy-policy",
    guest: true,
  },
  {
    label: "Terms of Use",
    icon: "document-text-outline",
    path: "/account/terms-of-use",
    guest: true,
  },
];

const AccountScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout, authUser } = useAuthUser();
  const { showToast } = useAppToast();

  const user = authUser?.user;
  const isGuest = !authUser?.isAuthenticated;
  const userName = user?.fullName || "Guest User";
  const userProfilePicture = user?.profilePicture || null;

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
      <HeaderWithBack showBackButton title="My Account" backTo="/home" />

      <View className="flex-1 relative pb-20">
        {/* User Info */}
        <View className="items-center mt-8 mb-4 space-y-3">
          <Avatar size="xl">
            {userProfilePicture ? (
              <AvatarImage source={{ uri: userProfilePicture }} />
            ) : (
              <AvatarFallbackText>
                <Text className="text-2xl font-lexend-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </AvatarFallbackText>
            )}
          </Avatar>

          <Text className="text-xl font-semibold text-gray-900">
            {userName}
          </Text>

          {isGuest ? (
            <TouchableOpacity
              className="px-5 py-2 mt-4 bg-indigo-100 rounded-lg"
              activeOpacity={0.8}
              onPress={() => router.push(ROUTE_PATH.AUTH.LOGIN)}
            >
              <Text className="text-sm font-medium text-indigo-600">
                Sign In
              </Text>
            </TouchableOpacity>
          ) : (
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
          )}
        </View>

        <View className="h-px bg-gray-200 my-4" />

        {/* Account Options */}
        <View className="flex-1 bg-white rounded-3xl overflow-hidden">
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {accountOptions
              .filter((item) => (isGuest ? item.guest : true))
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center justify-between p-2 rounded-xl"
                  activeOpacity={0.7}
                  onPress={() => router.push(item.path)}
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

        {/* Bottom Action */}
        <View className="h-px bg-gray-200 mt-4" />

        <View className="w-full px-4 pb-6 absolute bottom-0">
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={
              isGuest ? () => router.push(ROUTE_PATH.AUTH.LOGIN) : handleLogout
            }
            className="rounded-2xl flex-row items-center justify-center px-4 py-3 space-x-3"
          >
            <Ionicons
              name={isGuest ? "log-in-outline" : "log-out-outline"}
              size={28}
              color="#B31F24"
              className="mr-2"
            />
            <Text className="text-brand-primary text-lg font-lexend-semibold">
              {isGuest ? "Sign In" : "Logout"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppLayout>
  );
};

export default AccountScreen;
