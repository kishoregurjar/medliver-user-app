import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
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
import CTAButton from "@/components/common/CTAButton";
import LoginRequiredModal from "@/components/modals/LoginRequiredModal";
import { accountOptions } from "@/utils/constants";

const AccountScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout, authUser } = useAuthUser();
  const { showToast } = useAppToast();
  const [showLoginModal, setShowLoginModal] = useState(false);

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

          <Text className="text-xl mt-2 font-semibold text-gray-900">
            {userName}
          </Text>

          {!isGuest && (
            <View className="flex-row justify-between mt-4 gap-4">
              <CTAButton
                label="Edit Profile"
                onPress={() => router.push(ROUTE_PATH.APP.ACCOUNT.EDIT_PROFILE)}
                size="sm"
                icon={
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color="white"
                    className="mr-2"
                  />
                }
              />

              <CTAButton
                label="Change Password"
                onPress={() =>
                  router.push(ROUTE_PATH.APP.ACCOUNT.CHANGE_PASSWORD)
                }
                size="sm"
                icon={
                  <Ionicons
                    name="key-outline"
                    size={16}
                    color="white"
                    className="mr-2"
                  />
                }
              />
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
            {accountOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-between p-2 rounded-xl"
                activeOpacity={0.7}
                onPress={() => {
                  if (item.requiresAuth && isGuest) {
                    // Redirect guest to login screen or show modal
                    setShowLoginModal(true);
                  } else {
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

        {/* Bottom Action */}
        <View className="h-px bg-gray-200 mt-4" />

        <View className="w-full px-4 pb-6 absolute bottom-0">
          <CTAButton
            label={isGuest ? "Sign In" : "Logout"}
            onPress={
              isGuest ? () => router.push(ROUTE_PATH.AUTH.LOGIN) : handleLogout
            }
            variant="transparent"
            icon={
              <Ionicons
                name={isGuest ? "log-in-outline" : "log-out-outline"}
                size={28}
                color="#B31F24"
                className="mr-2"
              />
            }
            textClassName={"font-lexend-semibold text-brand-primary"}
          />
          <CTAButton
            label="PerfDev Tools"
            onPress={() => router.push(`/dev/performance`)}
            icon={
              <Ionicons
                name="construct-outline"
                size={28}
                color="#B31F24"
                className="mr-2"
              />
            }
          />
        </View>
      </View>

      {showLoginModal && (
        <LoginRequiredModal
          visible={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </AppLayout>
  );
};

export default AccountScreen;
