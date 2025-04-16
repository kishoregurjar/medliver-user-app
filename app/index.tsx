import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  Animated,
} from "react-native";
import React, { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const LetsStartScreen = () => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const dots = [
    { top: "10%", left: "15%", size: 8, color: "bg-yellow-400", opacity: 70 },
    { top: "20%", left: "70%", size: 6, color: "bg-blue-400", opacity: 60 },
    { top: "35%", left: "30%", size: 6, color: "bg-green-400", opacity: 50 },
    { top: "50%", left: "80%", size: 8, color: "bg-pink-400", opacity: 60 },
    { top: "60%", left: "10%", size: 6, color: "bg-purple-400", opacity: 40 },
    { top: "70%", left: "50%", size: 4, color: "bg-yellow-300", opacity: 50 },
    { top: "80%", left: "25%", size: 6, color: "bg-cyan-400", opacity: 60 },
  ];

  return (
    <LinearGradient
      colors={["#e0f7fa", "#fce4ec"]}
      className="flex-1 justify-center items-center px-6 relative"
    >
      {/* Floating dots */}
      <View className="absolute w-full h-full">
        {dots.map((dot, index) => (
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

      {/* Illustration */}
      <Image
        source={require("../assets/images/lets_start.png")}
        style={{ width: width * 0.6, height: height * 0.3 }}
        resizeMode="contain"
        className="mb-6"
      />

      {/* Headline */}
      <Text className="text-2xl font-bold text-center text-gray-900 mb-2">
        Your Health, Delivered{"\n"}Fast & Safe
      </Text>

      {/* Subtext */}
      <Text className="text-base text-center text-gray-500 mb-8">
        We believe that getting the care you need shouldn’t be complicated or
        time-consuming. Whether it’s ordering medicines or booking diagnostic
        tests.
      </Text>

      {/* CTA Button with Animated Press */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          width: "100%",
          maxWidth: 400,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 4,
          overflow: "hidden", // ensures ripple doesn’t overflow
        }}
      >
        <Pressable
          onPress={() => router.push("/(auth)/signup")}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          android_ripple={{ color: "#c53030" }}
          className="flex-row items-center justify-center bg-[#E55150] px-6 py-3 rounded-2xl"
        >
          <Text className="text-white text-lg font-semibold mr-2">
            Let’s Start
          </Text>
          <AntDesign name="arrowright" size={20} color="white" />
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
};

export default LetsStartScreen;
