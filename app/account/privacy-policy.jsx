import { View, Text, ScrollView } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PrivacyPolicyScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <AppLayout>
      {/* Header */}
      <HeaderWithBack showBackButton title="Privacy Policy" />
      
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
              We respect your privacy and are committed to protecting your
              personal information. This Privacy Policy outlines how we collect,
              use, and safeguard your data.
            </Text>
          </View>

          {/* Section 2 */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              2. Information Collection
            </Text>
            <Text className="text-sm text-gray-700 leading-relaxed">
              We collect personal data such as your name, email, and usage
              behavior to improve your experience. Information is collected when
              you use the app or interact with our services.
            </Text>
          </View>

          {/* Section 3 */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              3. How We Use Data
            </Text>
            <Text className="text-sm text-gray-700 leading-relaxed">
              Your data helps us personalize the app, improve services, and
              communicate important updates. We do not sell or share your data
              with third parties without consent.
            </Text>
          </View>

          {/* Section 4 */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              4. Data Security
            </Text>
            <Text className="text-sm text-gray-700 leading-relaxed">
              We implement strong security measures to protect your personal
              information from unauthorized access, alteration, or disclosure.
            </Text>
          </View>

          {/* Section 5 */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              5. Your Rights
            </Text>
            <Text className="text-sm text-gray-700 leading-relaxed">
              You have the right to access, correct, or delete your personal
              information. To exercise your rights, contact our support team.
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

export default PrivacyPolicyScreen;
