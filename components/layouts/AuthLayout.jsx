// components/layouts/AuthLayout.tsx
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

// Get the screen width and height
const { width, height } = Dimensions.get("window");

const AuthLayout = ({ children }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Scale factor based on screen width
  const scaleFactor = width / 375; // Assuming 375px as a base width (iPhone 6/7/8)

  // Logic to adjust based on screen size (small, medium, large)
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  return (
    <SafeAreaView className="flex-1">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <GradientBackground
            animateBlobs
            darkMode={isDark}
            animationSpeed={1000}
            animationType="pulse"
          >
            <View
              className="flex-1"
              style={{
                // Apply different padding based on screen size
                paddingHorizontal: isSmallScreen
                  ? 12 * scaleFactor
                  : isMediumScreen
                  ? 20 * scaleFactor
                  : 30 * scaleFactor,
                paddingVertical: isSmallScreen
                  ? 8 * scaleFactor
                  : isMediumScreen
                  ? 12 * scaleFactor
                  : 18 * scaleFactor,
                marginHorizontal: isSmallScreen
                  ? 10 * scaleFactor
                  : isMediumScreen
                  ? 15 * scaleFactor
                  : 20 * scaleFactor,
              }}
            >
              {children}
            </View>
          </GradientBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthLayout;
