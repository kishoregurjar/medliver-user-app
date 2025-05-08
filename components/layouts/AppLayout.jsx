import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import GradientBackground from "../common/GradientEllipse";

const { width, height } = Dimensions.get("window");

const AppLayout = ({ children, scrollEnabled = true }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const paddingHorizontal = width < 375 ? 12 : width < 768 ? 20 : 28;
  const paddingVertical = height < 667 ? 10 : height < 800 ? 16 : 24;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <GradientBackground
          animateBlobs
          darkMode={isDark}
          animationSpeed={1000}
          animationType="pulse"
          scrollEnabled={scrollEnabled}
          contentStyle={{
            flex: 1,
            ...(scrollEnabled
              ? {
                  paddingHorizontal,
                  paddingVertical,
                  minHeight: height,
                }
              : {
                  paddingHorizontal,
                  paddingVertical,
                }),
          }}
        >
          {scrollEnabled ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flex: 1 }}>{children}</View>
            </ScrollView>
          ) : (
            <View style={{ flex: 1 }}>{children}</View>
          )}
        </GradientBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AppLayout;
