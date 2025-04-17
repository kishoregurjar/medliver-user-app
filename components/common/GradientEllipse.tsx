import { LinearGradient } from "expo-linear-gradient";
import { View, Dimensions } from "react-native";
import React from "react";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const GradientEllipse = ({
  colors,
  style,
}: {
  colors: string[];
  style: object;
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[
        {
          position: "absolute",
          borderRadius: 9999,
          opacity: 0.7,
          filter: "blur(50px)",
        },
        style,
      ]}
    />
  );
};

const GradientBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="flex-1 bg-[#F2F2F2]">
      {/* Gradient Blobs - scaled from original px values based on iPhone 14 Pro (393 x 852) */}

      <GradientEllipse
        colors={["#2555FF", "rgba(37, 85, 255, 0.25)"]}
        style={{
          width: 60,
          height: 60,
          top: screenHeight * (232 / 852),
          left: screenWidth * (333 / 393),
        }}
      />
      <GradientEllipse
        colors={["#46BDF0", "rgba(70, 179, 240, 0.15)"]}
        style={{
          width: 58,
          height: 58,
          top: screenHeight * (424 / 852),
          left: screenWidth * (76 / 393),
        }}
      />
      <GradientEllipse
        colors={["#F0B646", "rgba(240, 203, 70, 0.15)"]}
        style={{
          width: 58,
          height: 58,
          top: screenHeight * (767 / 852),
          left: screenWidth * (240 / 393),
        }}
      />
      <GradientEllipse
        colors={["#46F080", "rgba(70, 240, 138, 0.15)"]}
        style={{
          width: 70,
          height: 70,
          top: screenHeight * (126 / 852),
          left: screenWidth * (-15 / 393),
        }}
      />
      <GradientEllipse
        colors={["#EDF046", "rgba(240, 233, 70, 0.15)"]}
        style={{
          width: 70,
          height: 70,
          top: screenHeight * (7 / 852),
          left: screenWidth * (256 / 393),
        }}
      />

      {/* Children Content */}
      {children}
    </View>
  );
};

export default GradientBackground;
