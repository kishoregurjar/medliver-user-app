import React, { useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  Animated,
  Easing,
  useColorScheme,
  ImageBackground,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import STATIC from "@/utils/constants";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const GradientEllipse = ({
  colors,
  style,
  animate,
  animationType = "float",
  animationSpeed,
}) => {
  const animation = useRef(new Animated.Value(0)).current;
  const speed = animationSpeed ?? (animationType === "pulse" ? 2000 : 4000);

  useEffect(() => {
    if (!animate || animationType === "none") return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: speed,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: speed,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
  }, [animate, animationType, animationSpeed]);

  const animatedStyle =
    animate && animationType === "float"
      ? {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
          ],
        }
      : animate && animationType === "pulse"
      ? {
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }),
            },
          ],
        }
      : {};

  return (
    <Animated.View style={[style, animatedStyle, { position: "absolute" }]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 9999,
          opacity: 0.7,
        }}
      />
    </Animated.View>
  );
};

const GradientBackground = ({
  children,
  animateBlobs = false,
  animationType = "float",
  animationSpeed,
  darkMode,
}) => {
  const systemColorScheme = useColorScheme();
  const isDark =
    darkMode !== undefined ? darkMode : systemColorScheme === "dark";

  const getColors = (light, dark) => (isDark ? dark : light);

  if (Platform.OS === "ios") {
    // ✅ iOS — Show fallback image
    return (
      <ImageBackground
        source={STATIC.IMAGES.APP.BACKGROUND}
        resizeMode="cover"
        style={{
          flex: 1,
          backgroundColor: isDark ? "#1C1C1E" : "#F2F2F2",
        }}
      >
        {children}
      </ImageBackground>
    );
  }

  // ✅ Android — Show animated gradient ellipses
  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#1C1C1E" : "#F2F2F2" }}>
      <GradientEllipse
        colors={getColors(
          ["#2555FF", "rgba(37, 85, 255, 0.15)"],
          ["#3D68FF", "rgba(61, 104, 255, 0.1)"]
        )}
        style={{
          width: 70,
          height: 70,
          top: screenHeight * (232 / 852),
          left: screenWidth * (333 / 393),
        }}
        animate={animateBlobs}
        animationType={animationType}
        animationSpeed={animationSpeed}
      />
      <GradientEllipse
        colors={getColors(
          ["#46BDF0", "rgba(70, 179, 240, 0.15)"],
          ["#3FADE0", "rgba(63, 173, 224, 0.1)"]
        )}
        style={{
          width: 70,
          height: 70,
          top: screenHeight * (424 / 852),
          left: screenWidth * (76 / 393),
        }}
        animate={animateBlobs}
        animationType={animationType}
        animationSpeed={animationSpeed}
      />
      <GradientEllipse
        colors={getColors(
          ["#F0B646", "rgba(240, 203, 70, 0.15)"],
          ["#E9AA2F", "rgba(233, 170, 47, 0.1)"]
        )}
        style={{
          width: 70,
          height: 70,
          top: screenHeight * (767 / 852),
          left: screenWidth * (240 / 393),
        }}
        animate={animateBlobs}
        animationType={animationType}
        animationSpeed={animationSpeed}
      />
      <GradientEllipse
        colors={getColors(
          ["#46F080", "rgba(70, 240, 138, 0.15)"],
          ["#2CEB77", "rgba(44, 235, 119, 0.1)"]
        )}
        style={{
          width: 70,
          height: 70,
          top: screenHeight * (126 / 852),
          left: screenWidth * (-15 / 393),
        }}
        animate={animateBlobs}
        animationType={animationType}
        animationSpeed={animationSpeed}
      />
      <GradientEllipse
        colors={getColors(
          ["#EDF046", "rgba(240, 233, 70, 0.15)"],
          ["#E6EA30", "rgba(230, 234, 48, 0.1)"]
        )}
        style={{
          width: 70,
          height: 70,
          top: screenHeight * (7 / 852),
          left: screenWidth * (256 / 393),
        }}
        animate={animateBlobs}
        animationType={animationType}
        animationSpeed={animationSpeed}
      />
      {children}
    </View>
  );
};

export default GradientBackground;
