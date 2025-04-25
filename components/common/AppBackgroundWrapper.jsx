import { View, Platform, StatusBar, SafeAreaView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const FLOATING_DOTS = [
  { top: "10%", left: "15%", size: 8, color: "bg-yellow-400", opacity: 70 },
  { top: "20%", left: "70%", size: 6, color: "bg-blue-400", opacity: 60 },
  { top: "35%", left: "30%", size: 6, color: "bg-green-400", opacity: 50 },
  { top: "50%", left: "80%", size: 8, color: "bg-pink-400", opacity: 60 },
  { top: "60%", left: "10%", size: 6, color: "bg-purple-400", opacity: 40 },
  { top: "70%", left: "50%", size: 4, color: "bg-yellow-300", opacity: 50 },
  { top: "80%", left: "25%", size: 6, color: "bg-cyan-400", opacity: 60 },
];

const AppBackgroundWrapper = ({ children, style }) => {
  return (
    <LinearGradient colors={["#e0f7fa", "#fce4ec"]} className="flex-1 relative">
      {/* Android status bar spacer */}
      {Platform.OS === "android" && (
        <View style={{ height: StatusBar.currentHeight }} />
      )}

      {/* Floating Dots */}
      <View className="absolute w-full h-full">
        {FLOATING_DOTS.map((dot, index) => (
          <View
            key={index}
            className={`absolute ${dot.color} opacity-${dot.opacity} rounded-full`}
            style={{
              width: dot.size,
              height: dot.size,
              top: dot.top,
              left: dot.left,
            }}
          />
        ))}
      </View>

      {/* Main content */}
      <SafeAreaView className="flex-1 px-" style={style}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AppBackgroundWrapper;
