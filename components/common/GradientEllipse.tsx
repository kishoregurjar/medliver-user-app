// components/GradientBackground.tsx
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import React from "react";

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
          opacity: 0.5,
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
      {/* Gradient Blobs */}
      <GradientEllipse
        colors={["#2555FF", "rgba(37, 85, 255, 0.25)"]}
        style={{ width: 60, height: 60, top: 232, left: 333 }}
      />
      <GradientEllipse
        colors={["#46BDF0", "rgba(70, 179, 240, 0.15)"]}
        style={{ width: 58, height: 58, top: 424, left: 76 }}
      />
      <GradientEllipse
        colors={["#F0B646", "rgba(240, 203, 70, 0.15)"]}
        style={{ width: 58, height: 58, top: 767, left: 240 }}
      />
      <GradientEllipse
        colors={["#46F080", "rgba(70, 240, 138, 0.15)"]}
        style={{ width: 70, height: 70, top: 126, left: -15 }}
      />
      <GradientEllipse
        colors={["#EDF046", "rgba(240, 233, 70, 0.15)"]}
        style={{ width: 70, height: 70, top: 7, left: 256 }}
      />

      {/* Screen Content */}
      {children}
    </View>
  );
};

export default GradientBackground;
