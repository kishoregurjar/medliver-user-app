import { View, ScrollView, useWindowDimensions } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConfig } from "@/contexts/ConfigContext";
import RenderHTML from "react-native-render-html";

const PrivacyPolicyScreen = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { config } = useConfig();

  const htmlContent = config?.privacyPolicy?.content || "<p>No Privacy Policy available.</p>";

  return (
    <AppLayout scroll={false}>
      {/* Header */}
      <HeaderWithBack showBackButton title="Privacy Policy" />

      {/* Scrollable Content */}
      <ScrollView
        className="mt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4">
          <RenderHTML
            contentWidth={width}
            source={{ html: htmlContent }}
          />
        </View>
        <View className="h-24" /> {/* Bottom spacer */}
      </ScrollView>
    </AppLayout>
  );
};

export default PrivacyPolicyScreen;
