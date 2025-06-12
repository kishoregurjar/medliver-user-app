import React, { useMemo } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import AppLayout from "@/components/layouts/AppLayout";
import HeaderWithBack from "@/components/common/HeaderWithBack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConfig } from "@/contexts/ConfigContext";
import RenderHTML from "react-native-render-html";
import LoadingDots from "@/components/common/LoadingDots";
import { defaultHTMLTagsStyles } from "@/utils/htmlStyles";

const TermsOfUseScreen = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { config } = useConfig();

  const htmlContent = useMemo(() => {
    return config?.termsOfUse?.content || "<p>No Terms of Use available.</p>";
  }, [config]);

  const isLoading = !config;

  return (
    <AppLayout scroll={false}>
      <HeaderWithBack showBackButton title="Terms of Use" />

      {isLoading ? (
        <View className="flex-1 justify-center items-center mt-10">
          <LoadingDots title="Loading..." subtitle="Please wait..." />
        </View>
      ) : (
        <ScrollView
          className="flex-1 mt-4"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <RenderHTML
            contentWidth={width}
            source={{ html: htmlContent }}
            // enableCSSInlineProcessing={true}
            tagsStyles={defaultHTMLTagsStyles}
          />
        </ScrollView>
      )}
    </AppLayout>
  );
};

export default TermsOfUseScreen;
