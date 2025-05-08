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

// Get screen width and height once at load time
const { width, height } = Dimensions.get("window");

const AppLayout = ({
  children,
  scroll = true, // allow non-scroll layouts too
  safeArea = true,
  keyboardAvoid = true,
  animationType = "pulse",
  animationSpeed = 1000,
  paddingHorizontalCustom,
  paddingVerticalCustom,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Responsive paddings if not overridden
  const paddingHorizontal =
    paddingHorizontalCustom ?? (width < 375 ? 12 : width < 768 ? 20 : 28);

  const paddingVertical =
    paddingVerticalCustom ?? (height < 667 ? 10 : height < 800 ? 16 : 24);

  const ContentWrapper = scroll ? ScrollView : View;

  const contentProps = scroll
    ? {
        contentContainerStyle: {
          flexGrow: 1,
          paddingHorizontal,
          paddingVertical,
          minHeight: height,
        },
        keyboardShouldPersistTaps: "handled",
        showsVerticalScrollIndicator: false,
      }
    : {
        style: {
          flex: 1,
          paddingHorizontal,
          paddingVertical,
        },
      };

  const Wrapper = keyboardAvoid ? KeyboardAvoidingView : View;
  const wrapperProps = keyboardAvoid
    ? {
        behavior: Platform.OS === "ios" ? "padding" : undefined,
        keyboardVerticalOffset: Platform.OS === "ios" ? 40 : 0,
      }
    : {};

  const Container = safeArea ? SafeAreaView : View;

  return (
    <Container style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <Wrapper style={{ flex: 1 }} {...wrapperProps}>
        <GradientBackground
          animateBlobs
          darkMode={isDark}
          animationType={animationType}
          animationSpeed={animationSpeed}
        >
          <ContentWrapper {...contentProps}>
            <View style={{ flex: 1 }}>{children}</View>
          </ContentWrapper>
        </GradientBackground>
      </Wrapper>
    </Container>
  );
};

export default AppLayout;
