import { View, Text, ScrollView } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TermsOfUseScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <AppLayout>
      {/* Sticky Header */}
      <HeaderWithBack showBackButton title="Terms of Use" />
      
      <View className="flex-1">
        {/* Scrollable Content */}
        <ScrollView
          className="mt-4"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1 */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              1. Introduction
            </Text>
            <Text className="text-sm text-gray-700 leading-relaxed">
              Welcome to our platform. By using this app, you agree to our Terms
              of Use. These terms govern your use of the services, features, and
              content provided by us.
            </Text>
          </View>

          {/* Section 2 */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              2. User Responsibilities
            </Text>
            <Text className="text-sm text-gray-700 leading-relaxed">
              You are responsible for maintaining the confidentiality of your
              account and for all activities that occur under your account. Use
              the app lawfully and respectfully.
            </Text>
          </View>

          {/* Section 3 */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              3. Content Ownership
            </Text>
            <Text className="text-sm text-gray-700 leading-relaxed">
              All content provided within the app is owned by or licensed to us.
              You may not reuse, copy, or distribute without explicit
              permission.
            </Text>
          </View>

          {/* Section 4 */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              4. Termination
            </Text>
            <Text className="text-sm text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your access if you
              violate these terms or misuse the app.
            </Text>
          </View>

          {/* Section 5 */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              5. Updates
            </Text>
            <Text className="text-sm text-gray-700 leading-relaxed">
              We may update these terms at any time. Continued use of the app
              implies acceptance of the revised terms.
            </Text>
          </View>

          {/* Last Updated */}
          <Text className="text-xs text-gray-400 mt-6 text-center">
            Last updated: May 5, 2025
          </Text>
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default TermsOfUseScreen;
