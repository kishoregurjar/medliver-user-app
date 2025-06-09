import { View, ScrollView, useWindowDimensions } from "react-native";
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConfig } from "@/contexts/ConfigContext";
import RenderHTML from "react-native-render-html";

const TermsOfUseScreen = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { config } = useConfig();

  const htmlContent =
    config?.termsOfUse?.content || "<p>No Terms of Use available.</p>";

  return (
    <AppLayout scroll={false}>
      {/* Sticky Header */}
      <HeaderWithBack showBackButton title="Terms of Use" />
      {/* Scrollable Content */}
      <ScrollView
        className="mt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <RenderHTML contentWidth={width} source={{ html: htmlContent }} />
        </View>
        <View className="h-24" /> {/* Spacer for bottom padding */}
      </ScrollView>
    </AppLayout>
  );
};

export default TermsOfUseScreen;
