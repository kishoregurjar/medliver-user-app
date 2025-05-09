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
import GradientBackground from "../common/GradientBackground";

const { width } = Dimensions.get("window");

const AuthLayout = ({ children }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const scaleFactor = width / 375;

  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;

  const paddingHorizontal = isSmallScreen
    ? 12 * scaleFactor
    : isMediumScreen
    ? 20 * scaleFactor
    : 30 * scaleFactor;

  const paddingVertical = isSmallScreen
    ? 8 * scaleFactor
    : isMediumScreen
    ? 12 * scaleFactor
    : 18 * scaleFactor;

  const marginHorizontal = isSmallScreen
    ? 10 * scaleFactor
    : isMediumScreen
    ? 15 * scaleFactor
    : 20 * scaleFactor;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <GradientBackground
        animateBlobs
        darkMode={isDark}
        animationSpeed={1000}
        animationType="pulse"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal,
              paddingVertical,
              justifyContent: "center",
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ marginHorizontal }}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default AuthLayout;
